<template>
	<div class="visualLargeScreen">
		<div class="visualLargeScreen_left">
			<button class="exit" @click="backReturn">退出</button>

			<div class="left_top">
				<TitleBox />

				<div class="content" ref="deviceDom"></div>
			</div>

			<div class="left_bottom">
				<TitleBox />

				<div class="rateRingChartBox">
					<span class="outerRing" :style="{ width: outerRadius + 'px', height: outerRadius + 'px' }"></span>
					<div class="rateRingChart" ref="chartDom"></div>
					<span class="solidCircle" :style="{ width: innerRadius + 'px', height: innerRadius + 'px' }"></span>
				</div>

				<div class="rateRingInfo">
					<div class="rateRingInfoBox">
						<div class="item">
							<span class="item_num">{{ inLineeQuipment }}</span>
							<span class="item_title">在线数</span>
						</div>
						<div class="item">
							<span class="item_num">{{ offLineEquipment }}</span>
							<span class="item_title">离线数</span>
						</div>
					</div>
					<div class="rateRingInfoBox">
						<div class="item">
							<span class="item_num">100%</span>
							<span class="item_title">GT覆盖率</span>
						</div>
						<div class="item">
							<span class="item_num">57.14%</span>
							<span class="item_title">GT覆盖率</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="visualLargeScreen_content">
			<div class="contentTitleBox"></div>
			<div class="optionSearchArea">
				<DropDownList :lists="administrativeRegion" prompt="省" />
				<DropDownList :lists="administrativeRegion" prompt="市" />
				<DropDownList :lists="administrativeRegion" prompt="区" />

				<button class="search">
					搜索
					<el-icon>
						<ele-Search />
					</el-icon>
				</button>
			</div>

			<div class="contentBox">
				<BaiduMap v-show="state.currentlySelectedMap === 'baiduMap'" ref="baiduMap" />
				<EchartsMap v-show="state.currentlySelectedMap === 'echarts'" ref="echartsMap" />
				<GTDetails v-if="state.currentlySelectedMap === 'GTDetails'" />
				<el-icon v-if="state.isLoading" class="loading">
					<ele-Loading />
				</el-icon>
			</div>

			<div class="switchingArea">
				<button class="button" :class="{ active: state.currentlySelectedMap === 'baiduMap' }" @click="switchMaps('baiduMap')">百度地图</button>
				<button class="button" :class="{ active: state.currentlySelectedMap === 'echarts' }" @click="switchMaps('echarts')">echarts</button>
			</div>
		</div>

		<div class="visualLargeScreen_right">
			<div class="right_top">
				<TitleBox />

				<div class="contentBox">
					<div class="contentBox_content" ref="dotsBox">
						<div class="info">
							<span class="num">3</span>
							<span class="text">隐患总数</span>
						</div>
					</div>
					<div class="contentBox_info">
						<div class="item">
							<span class="drop"></span>
							<p class="text">隐患类型1</p>
						</div>
						<div class="item">
							<span class="drop"></span>
							<p class="text">隐患类型2</p>
						</div>
						<div class="item">
							<span class="drop"></span>
							<p class="text">隐患类型3</p>
						</div>
					</div>
				</div>

				<div class="regulatoryRegion">
					<SliderBar title="线路总数" :maxValue="state.totalNumberOfLines" :value="state.totalNumberOfLines" />
					<SliderBar title="塔杆总数" :maxValue="state.totalNumberOfTowerPoles" :value="state.totalNumberOfTowerPoles" />
				</div>
			</div>

			<div class="right_bottom">
				<TitleBox />

				<div class="carouselChart">
					<div class="swiper">
						<div class="swiper-wrapper">
							<div class="swiper-slide"></div>
							<div class="swiper-slide"></div>
							<div class="swiper-slide"></div>
						</div>
					</div>
					<div class="button-prev switchButton" @click="switchingTheCarouselChart('prev')"></div>
					<div class="button-next switchButton" @click="switchingTheCarouselChart('next')"></div>
				</div>

				<div class="tabulation" @click="enterGT" v-loading="state.alarmLoading">
					<ul class="tabulation_ul">
						<li class="ul_li" v-for="item in alarmDataList" :key="item.alarnCode">
							<p class="li_date">{{ item.createTime }}</p>
							<p class="li_title">{{ item.message }}</p>
						</li>
					</ul>
					<p v-if="!alarmDataList.length" style="color: #88ccdd; font-size: 13px; text-align: center">暂无数据</p>
				</div>
			</div>
		</div>

		<div class="backgroundImage"></div>
	</div>
</template>


<script setup name="visualLargeScreen">
import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NextLoading } from '/@/utils/loading.ts';
import administrativeRegion from './administrativeRegion.js';
import TitleBox from './components/TitleBox.vue';
import BaiduMap from './components/BaiduMap.vue';
import DropDownList from './components/DropDownList.vue';
import EchartsMap from './components/EchartsMap.vue';
import GTDetails from './components/GTDetails.vue';
import SliderBar from './components/SliderBar.vue';
import deviceStatus from './composition/deviceStatus.js'; // 设备状态数据
import circularDiagram from './composition/circularDiagram.js'; // 环形图的内外半径数据
import alarmDataList1 from './composition/alarmDataList.js'; // 告警数据列表
import carouselChart from './composition/carouselChart.js'; // 轮播图数据
import { getOfDeviceStatuses, getTotalNumberOfLineTowers } from '/@/api/visualLargeScreen/index.js';
const router = useRouter();

const deviceDom = ref(null);
const chartDom = ref(null);
const baiduMap = ref(null);
const echartsMap = ref(null);

// 创建数据
const state = reactive({
	currentlySelectedMap: 'GTDetails', // 当前选中的地图

	contentTimerId: null,

	isLoading: false, // 是否正在加载

	isFinite: true,

	alarmLoading: false,

	totalNumberOfLines: 0, // 线路总数
	totalNumberOfTowerPoles: 0, // 塔杆总数
});

const { inLineeQuipment, offLineEquipment, faultyEquipment, renderDeviceStatu } = deviceStatus();
const { innerRadius, outerRadius, renderRateRingChart } = circularDiagram();
const { alarmDataList } = alarmDataList1();
const { initCarouselChart, switchingTheCarouselChart } = carouselChart();

// 挂载前生命周期
onBeforeMount(async () => {
	document.documentElement.webkitRequestFullscreen(); // 进入大屏

	NextLoading.done(); // 移除加载中

	window.addEventListener('resize', antiShakeLargeScreen); // 监听事件

	state.alarmLoading = true;

	const res = await Promise.all([getOfDeviceStatuses(), getTotalNumberOfLineTowers()]);

	state.alarmLoading = false;

	const data = res[0].data.result;
	inLineeQuipment.value = data.onlineCount;
	offLineEquipment.value = data.offCount;
	faultyEquipment.value = data.failureCount;

	const barChartData = {
		inLineeQuipment: inLineeQuipment.value,
		offLineEquipment: offLineEquipment.value,
		faultyEquipment: faultyEquipment.value,
	};

	const pieChartData = [
		{ value: inLineeQuipment.value, name: '在线装置' },
		{ value: offLineEquipment.value, name: '离线装置' },
	];

	const items = res[1].data.result;

	state.totalNumberOfLines = items.trackCount;
	state.totalNumberOfTowerPoles = items.poleCount;

	// 渲染柱状图
	renderDeviceStatu(barChartData, deviceDom.value);

	// 渲染环形饼图
	renderRateRingChart(chartDom.value, pieChartData);
});

// 挂载后执行
onMounted(() => {
	setTimeout(() => {
		initCarouselChart(); // 渲染轮播图
		switchMaps('echarts'); // 渲染地图
	}, 16);
});

// 卸载前生命周期
onBeforeUnmount(() => {
	document.removeEventListener('fullscreenchange', antiShakeLargeScreen);
});

// 监听进退出大屏函数
function largeScreen() {
	if (state.isFinite) {
		return;
	}

	renderRateRingChart(chartDom.value); // 渲染饼图
	initCarouselChart(); // 渲染轮播图

	// 渲染柱状图
	renderDeviceStatu(
		{
			inLineeQuipment: inLineeQuipment.value,
			offLineEquipment: offLineEquipment.value,
			faultyEquipment: faultyEquipment.value,
		},
		deviceDom.value
	);

	if (state.currentlySelectedMap === 'baiduMap') {
		baiduMap.value.renderBaiduMap(); // 渲染百度地图
	} else if (state.currentlySelectedMap === 'echarts') {
		echartsMap.value.renderInitEchartsRender(); // 渲染echarts地图
	}
}

// 切换地图
function switchMaps(type) {
	if (type === state.currentlySelectedMap) {
		return;
	}

	baiduMap.value.destroyBaiduMaps(); // 卸载百度地图
	echartsMap.value.uninstallingAnInstance(); // 卸载echarts地图
	state.isLoading = true;
	clearTimeout(state.contentTimerId);
	state.currentlySelectedMap = type;
	if (type === 'baiduMap') {
		state.contentTimerId = setTimeout(() => {
			baiduMap.value.renderBaiduMap(); // 渲染百度地图
			state.isLoading = false;
		}, 16);
	} else if (type === 'echarts') {
		state.contentTimerId = setTimeout(() => {
			echartsMap.value.renderInitEchartsRender(); // 渲染echarts地图
			state.isLoading = false;
		}, 16);
	}
}

// 切换进入 GT详情
function enterGT(e) {
	state.currentlySelectedMap = 'GTDetails';
}

// 退出
function backReturn() {
	document.exitFullscreen();
	router.replace('/dashboard/workbench');
}

function formatTimestamp(timestamp) {
	// 创建一个 Date 对象并传入时间戳（单位为毫秒）
	var date = new Date(timestamp);

	// 获取年、月、日、时、分、秒
	var year = date.getFullYear();
	var month = ('0' + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，并确保两位数格式
	var day = ('0' + date.getDate()).slice(-2); // 确保两位数格式
	var hours = ('0' + date.getHours()).slice(-2); // 确保两位数格式
	var minutes = ('0' + date.getMinutes()).slice(-2); // 确保两位数格式
	var seconds = ('0' + date.getSeconds()).slice(-2); // 确保两位数格式

	// 拼接日期时间字符串
	var formattedDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

	return formattedDate;
}

// 防抖函数
const antiShake = (callback) => {
	let timedID = null;
	return () => {
		clearTimeout(timedID);
		timedID = setTimeout(callback, 1000);
	};
};

const antiShakeLargeScreen = antiShake(largeScreen);
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
.visualLargeScreen {
    .el-loading-mask{
        background-color: transparent;
    }
	.el-loading-spinner .path {
        stroke: #42f5e1;
	}
}
</style>
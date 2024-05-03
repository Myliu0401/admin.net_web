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
				<DropDownList :lists="state.administrativeRegion" prompt="省" :activeTitle="state.selectRegions[0]" @setSelected="setSelected($event, '省')" />
				<DropDownList
					v-if="state.currentlySelectedMap === 'baiduMap'"
					:lists="state.citys[state.selectRegions[0]]"
					prompt="市"
					:activeTitle="state.selectRegions[1]"
					@setSelected="setSelected($event, '市')"
					:loading="state.cityLoading"
				/>
				<DropDownList
					v-if="state.currentlySelectedMap === 'baiduMap'"
					:lists="state.areas[state.selectRegions[1]]"
					prompt="区"
					:activeTitle="state.selectRegions[2]"
					@setSelected="setSelected($event, '区')"
					:loading="state.areasLoading"
				/>

				<button class="search" @click="search">
					搜索
					<el-icon>
						<ele-Search />
					</el-icon>
				</button>
			</div>

			<div class="contentBox">
				<BaiduMap v-if="state.currentlySelectedMap === 'baiduMap'" ref="baiduMap" key="baiduMap" :administrativeRegion="state.administrativeRegion" @clickPole="clickPole" />
				<EchartsMap v-else-if="state.currentlySelectedMap === 'echarts'" ref="echartsMap" key="echartsMap" :administrativeRegion="state.administrativeRegion" @complete="state.isLoading = false" />

				<GTDetails v-if="state.GTDetails" key="GTDetails" @closeGTD="state.GTDetails = false" :currentGTDid="state.currentGTDid" />

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

				<div class="tabulation" v-loading="state.alarmLoading">
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
import { getOfDeviceStatuses, getTotalNumberOfLineTowers, getTotalNumberOfLines, getRegion } from '/@/api/visualLargeScreen/index.js';
import { ElMessage } from 'element-plus';

const router = useRouter();

const deviceDom = ref(null);
const chartDom = ref(null);
const baiduMap = ref(null);
const echartsMap = ref(null);

// 创建数据
const state = reactive({
	currentlySelectedMap: null, // 当前选中的地图

	isLoading: false, // 是否正在加载

	alarmLoading: false, // 告警列表是否加载中

	totalNumberOfLines: 0, // 线路总数
	totalNumberOfTowerPoles: 0, // 塔杆总数
	GTDetails: false, // 是否展示GTD
	currentGTDid: null, // 当前选中的塔杆id

	selectRegions: [], // 选中的省市区

	administrativeRegion: [], // 所有省份

	citys: {}, // 市
	cityLoading: false, // 市是否加载中
	areas: {}, // 区
	areasLoading: false, // 区是否加载中
});

const { inLineeQuipment, offLineEquipment, faultyEquipment, renderDeviceStatu } = deviceStatus();
const { innerRadius, outerRadius, renderRateRingChart } = circularDiagram();
const { alarmDataList } = alarmDataList1();
const { initCarouselChart, switchingTheCarouselChart } = carouselChart();

// 挂载前生命周期
onBeforeMount(async () => {
	//document.documentElement.webkitRequestFullscreen(); // 进入大屏

	NextLoading.done(); // 移除加载中

	document.addEventListener('keydown', largeScreen);

	state.alarmLoading = true;

	setTimeout(init, 100);

	const res = await getRegion(0); // 获取所有省
	state.administrativeRegion = res.data.result;
});

// 挂载后执行
onMounted(() => {
	state.isLoading = true;
});

// 卸载前生命周期
onBeforeUnmount(() => {
	baiduMap.value && baiduMap.value.destroyBaiduMaps(); // 卸载百度地图
	echartsMap.value && echartsMap.value.uninstallingAnInstance(); // 卸载echarts地图
});

// 监听进退出大屏函数
function largeScreen(event) {
	if (event.key === 'Escape') {
		window.location.reload();
	}
}

// 切换地图
function switchMaps(type) {
	if (type === state.currentlySelectedMap) {
		return;
	}

	if (type === 'echarts') {
		state.isLoading = true;
	}

	state.currentlySelectedMap = type;
	state.selectRegions = [];
	state.GTDetails = false;
}

// 退出
function backReturn() {
	document.exitFullscreen();
	router.replace('/dashboard/workbench');
}

// 初始化
async function init() {
	// 请求数据
	const res = await Promise.all([getOfDeviceStatuses(), getTotalNumberOfLineTowers(), getTotalNumberOfLines()]);

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
	const items1 = res[2].data.result;

	state.totalNumberOfLines = items1.lineCount;
	state.totalNumberOfTowerPoles = items.poleCount;

	// 渲染柱状图
	renderDeviceStatu(barChartData, deviceDom.value);

	// 渲染环形饼图
	renderRateRingChart(chartDom.value, pieChartData);
	// 渲染轮播图
	initCarouselChart();

	setTimeout(() => {
		switchMaps('echarts'); // 渲染地图
	}, 300);
}

// 修改选中区域
async function setSelected(name, type) {
	if (type === '省') {
		state.selectRegions.length = 0;
		state.selectRegions[0] = name;
		if (!state.citys[name]) {
			state.cityLoading = true;
			const arr = await getPonding(getCorresponding(state.administrativeRegion, name));
			state.citys[name] = arr;
			state.cityLoading = false;
		}
	} else if (type === '市') {
		state.selectRegions.length = 1;
		state.selectRegions[1] = name;
		if (!state.areas[name]) {
			state.areasLoading = true;
			const arr = await getPonding(getCorresponding(state.citys[state.selectRegions[0]], name));
			state.areas[name] = arr;
			state.areasLoading = false;
		}
	} else if (type === '区') {
		state.selectRegions[2] = name;
	}
}

// 获取对应行政区
async function getPonding(id) {
	const res = await getRegion(id);
	return res.data.result;
}

// 搜索
function search() {
	if (state.GTDetails || !state.selectRegions.length) {
		return;
	}

	let id = null;

	if (state.currentlySelectedMap === 'baiduMap') {
		if (state.selectRegions.length === 1) {
			id = getCorresponding(state.administrativeRegion, state.selectRegions[0]);
		} else if (state.selectRegions.length === 2) {
			id = getCorresponding(state.citys[state.selectRegions[0]], state.selectRegions[1]);
		} else if (state.selectRegions.length === 3) {
			id = getCorresponding(state.areas[state.selectRegions[1]], state.selectRegions[2]);
		}
		baiduMap.value.getSpecificTowerPoles(id);
	} else if (state.currentlySelectedMap === 'echarts') {
		//id = getCorresponding(state.administrativeRegion, state.selectRegions[0]);
		echartsMap.value.reRendering(state.selectRegions[0]);
	}
}

// 获取对应行政区id
function getCorresponding(data, name) {
	for (let i = 0; i < data.length; i++) {
		const item = data[i];
		if (item.name === name) {
			return item.id;
		}
	}
}

// 点击塔杆
function clickPole(id) {
	state.currentGTDid = id;
	state.GTDetails = true;
}
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
.visualLargeScreen {
	.el-loading-mask {
		background-color: transparent;
	}
	.el-loading-spinner .path {
		stroke: #42f5e1;
	}
}
</style>
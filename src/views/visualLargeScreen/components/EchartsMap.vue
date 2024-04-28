<template>
	<div class="echartsMapBox">
		<div class="echartsMap" id="ChinaMap" ref="ChinaMap"></div>
	</div>
</template>


<script>
import { reactive, defineComponent, onBeforeMount, watch, onBeforeUnmount } from 'vue';
import mapData from '../mapData.js'; // 地图数据
import { getCount, getRegion, getAllProle } from '/@/api/visualLargeScreen/index.js';

const x = 10;
const y = 25;

export default defineComponent({
	props: {
		administrativeRegion: {
			default() {
				return [];
			},
		},
	},

	setup(props, { emit }) {
		const state = reactive({
			// 选中的图片
			graphic: [],

			selectedProvince: [], // 选中的省份

			echartsMapExample: null, // 地图实例

			allCount: [], // 各省杠的数量

		});

		onBeforeMount(() => {
			setTimeout(() => {
				renderInitEchartsRender(); // 初始化
				state.allCount.length || getMyCount(); // 获取设备数量
				emit('complete');
			});
		});

		onBeforeUnmount(() => {
			uninstallingAnInstance();
		});

		// 渲染初始化echarts地图
		function renderInitEchartsRender() {
			window.echarts.registerMap('中国', mapData);
			state.echartsMapExample = window.echarts.init(document.getElementById('ChinaMap'), null, { useWorker: true });

			if (window.allCount && window.allCount.length) {
				state.allCount = window.allCount;
				reRendering();
				return;
			}

			state.echartsMapExample.setOption({
				geo: assemblingMapModules(),
				graphic: state.graphic,
				series: buildingScatterData(),
				animation: false,
			});
		}

		// 渲染选中的省份
		function renderSelectedEcharts() {
			state.graphic.length = 0;
			state.selectedProvince.length = 0;

			const data = [
				{ name: '北京市', value: 100 },
				{ name: '天津市', value: 200 },
				{ name: '上海市', value: 300 },
				{ name: '重庆市', value: 400 },
				{ name: '河北省', value: 500 },
				{ name: '香港特别行政区', value: 600 },
				{ name: '澳门特别行政区', value: 700 },
				{ name: '台湾省', value: 800 },
				{ name: '广东省', value: 900 },
				{ name: '广西壮族自治区', value: 1000 },
				{ name: '江苏省', value: 1100 },
				{ name: '浙江省', value: 1200 },
				{ name: '安徽省', value: 1300 },
				{ name: '福建省', value: 1400 },
				{ name: '江西省', value: 1500 },
				{ name: '山东省', value: 1600 },
				{ name: '河南省', value: 1700 },
				{ name: '湖北省', value: 1800 },
				{ name: '湖南省', value: 1900 },
				{ name: '四川省', value: 2000 },
				{ name: '海南省', value: 2100 },
			];

			data.forEach((item) => {
				const coordinate = state.echartsMapExample.convertToPixel('geo', item.name); // 获取省份在界面中的像素坐标

				state.selectedProvince.push(buildSelectedData(item.name));

				// 修正指定省份的坐标
				if (item.name === '河北省') {
					coordinate[0] = coordinate[0] - 10;
					coordinate[1] = coordinate[1] + 20;
				} else if (item.name === '香港特别行政区') {
					coordinate[0] = coordinate[0] + 10;
					coordinate[1] = coordinate[1] + 5;
				} else if (item.name === '澳门特别行政区') {
					coordinate[0] = coordinate[0] - 10;
					coordinate[1] = coordinate[1] + 5;
				}

				state.graphic.push(buildProvincePromptData(coordinate[0] - x, coordinate[1] - y, item.value));
			});

			state.echartsMapExample.setOption(
				{
					geo: assemblingMapModules(),
					graphic: state.graphic,
				},
				() => {}
			);
		}

		// 获取经纬度
		function getLonAndLat(name) {
			const coordinate = state.echartsMapExample.convertToPixel('geo', name);

			// 修正指定省份的坐标
			if (name === '河北省') {
				coordinate[0] = coordinate[0] - 10;
				coordinate[1] = coordinate[1] + 20;
			} else if (name === '香港特别行政区') {
				coordinate[0] = coordinate[0] + 10;
				coordinate[1] = coordinate[1] + 5;
			} else if (name === '澳门特别行政区') {
				coordinate[0] = coordinate[0] - 10;
				coordinate[1] = coordinate[1] + 5;
			}

			return coordinate;
		}

		// 构建地图选中数据
		function buildSelectedData(provinceName) {
			return {
				name: provinceName,
				itemStyle: {
					areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#5e6ce1' }, // 渐变起点颜色
						{ offset: 1, color: '#5e6ce1' }, // 渐变终点颜色
					]),
				},
			};
		}

		// 组装选择数据
		function buildProvincePromptData(left, top, value) {
			return {
				// 添加图片和文本
				type: 'group',
				left, // 图片位置居中
				top, // 图片位置居上
				children: [
					{
						type: 'image',
						style: {
							image: './img/椭圆形.png',
							width: 20,
							height: 20,
						},
						zlevel: 10,
					},
					{
						type: 'text',
						style: {
							text: value,
							x: 10, // 在图片上方居中位置
							y: 5,
							textAlign: 'center',
							textBaseline: 'middle',
							fill: '#fff',
						},
						zlevel: 11,
					},
				],
				zlevel: 10,
			};
		}

		// 组装地图模块数据
		function assemblingMapModules() {
			const width1 = window.innerWidth;
			const mapBackground = [
				//地图背景
				{
					map: '中国',
					label: {
						show: false,
					},
					roam: false,
					top: width1 < 1400 ? 140 : 65,
					itemStyle: {
						areaColor: '#7fc4cc',
						borderColor: 'rgba(30,130,210,1)',
					},
					silent: true,
					zoom: 1.1,
				},
				{
					map: '中国',
					label: {
						show: false,
					},
					roam: false,

					top: width1 < 1400 ? 137 : 62,
					itemStyle: {
						areaColor: '#7fc4cc',
						borderColor: 'transparent',
					},
					silent: true,
					zoom: 1.1,
				},
				{
					map: '中国',
					label: {
						show: false,
					},
					roam: false,

					top: width1 < 1400 ? 134 : 59,
					itemStyle: {
						areaColor: '#7fc4cc',
						borderColor: 'transparent',
					},
					silent: true,
					zoom: 1.1,
				},
				{
					map: '中国',
					label: {
						show: false,
					},
					roam: false,

					top: width1 < 1400 ? 131 : 56,
					itemStyle: {
						areaColor: '#7fc4cc',
						borderColor: 'transparent',
					},
					silent: true,
					zoom: 1.1,
				},
				{
					map: '中国',
					label: {
						show: false,
					},
					roam: false,

					top: width1 < 1400 ? 128 : 53,
					itemStyle: {
						areaColor: '#7fc4cc',
						borderColor: 'transparent',
					},
					silent: true,
					zoom: 1.1,
				},
				//地图坐标,本层为最上层，上面是为了营造立体效果，可以删除上面的就是2d效果
				{
					map: '中国',
					label: {
						show: false, //是否显示版块标题
						textStyle: {
							color: '#5FB5FF',
							fontSize: 12,
						},
					},
					roam: false, // 是否开启滚轮缩放和拖拽漫游,默认为false（关闭），其他有效输入为true（开启），'scale'（仅开启滚轮缩放），'move'（仅开启拖拽漫游）
					top: width1 < 1400 ? 125 : 50,
					itemStyle: {
						areaColor: {
							type: 'linear-gradient',
							x: 1000,
							y: 4000,
							x2: 1000,
							y2: 0,
							colorStops: [
								{
									offset: 0.9,
									color: '#5e6ce1', // 0% 处的颜色
								},
								{
									offset: 1,
									color: '#5e6ce1', // 100% 处的颜色
								},
							],

							global: true, // 各省为 false
						},
						borderColor: '#1A39D0',
						borderWidth: 1,
					},
					emphasis: {
						// 鼠标放到地图上面显示
						itemStyle: {
							areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: '#2940FE' }, // 渐变起点颜色
								{ offset: 1, color: '#2940FE' }, // 渐变终点颜色
							]),
						},
						label: {
							color: '#fff',
							show: false,
						},
					},
					zoom: 1.1,
					regions: state.selectedProvince,
				},
			];

			return mapBackground;
		}

		// 构建散点数据
		function buildingScatterData(data = []) {
			return [
				{
					type: 'effectScatter',
					coordinateSystem: 'geo', // 使用地理坐标系
					data,

					rippleEffect: {
						//涟漪特效
						period: 2, //动画时间，值越小速度越快
						brushType: 'stroke', //波纹绘制方式 stroke, fill
						scale: 4, //波纹圆环最大限制，值越大波纹越大
					},

					symbolSize: function (val) {
						if (!val[2]) {
							return 10;
						}
						return val[2] / 10;
					},
					label: {
						show: true,
						position: 'right', // 文字位置
						formatter: '{b}', // 显示散点的名称
					},
					itemStyle: {
						color: '#FF0000', // 散点颜色
						shadowBlur: 10, // 散点阴影模糊大小,
						shadowColor: '#333', // 散点阴影颜色
					},
				},
			];
		}

		// 卸载实例
		function uninstallingAnInstance() {
			state.echartsMapExample && state.echartsMapExample.dispose();
		}

		// 获取杠数量
		async function getMyCount() {
			const res = await getAllProle();

			const shengs = res.data.result;

			props.administrativeRegion.forEach((item) => {
				state.allCount.push({ name: item.name, count: shengs[item.id] });
			});

			window.allCount = state.allCount.map((item) => {
				return { ...item };
			});

			reRendering();
		}

		function goujian() {
			return {
				广西壮族自治区: [108.320004, 24.82402],
				北京市: [116.405285, 41.5],
				天津市: [117.190182, 40.425596],
				新疆维吾尔自治区: [87.617733, 45.0928],
				江苏省: [118.767413, 35.441544],
				河北省: [114.502461, 40.045474],
				山西省: [112.549248, 39.857014],
				内蒙古自治区: [111.670801, 42.818311],
				辽宁省: [123.429096, 42.796767],
				吉林省: [125.3245, 44.886841],
				黑龙江省: [126.642464, 47.756967],
				上海市: [121.472644, 33.231706],
				浙江省: [120.153576, 31.287459],
				安徽省: [117.283042, 33.86119],
				福建省: [118.306239, 28.075302],
				江西省: [115.892151, 29.676493],
				山东省: [117.000923, 38.675807],
				河南省: [113.665412, 36.757975],
				湖北省: [113.298572, 32.584355],
				湖南省: [111.982279, 30.19409],
				广东省: [113.280637, 25.125178],
				海南省: [110.3, 20.031971],
				重庆市: [106.504962, 31.533155],
				四川省: [104.065735, 32.659462],
				贵州省: [106.713478, 28.578343],
				云南省: [100.712251, 25.040609],
				西藏自治区: [91.132212, 31.660361],
				陕西省: [108.948024, 36.263161],
				甘肃省: [103.823557, 38.058039],
				青海省: [97.778916, 37.623178],
				宁夏回族自治区: [106.278179, 38.46637],
				台湾省: [121.5, 25.044332],
				香港特别行政区: [114.173355, 23.320048],
				澳门特别行政区: [113.54909, 23.198951],
			};
		}

		// 重渲染
		function reRendering(province) {


			if(!state.echartsMapExample && window.allCount.length){
                return
			}

			const arr = [];

			const s = goujian();

			state.allCount.forEach((item) => {
				if(province && item.name === province){
                    arr.push({ name: item.count, value: [...s[item.name], item.count > 100 ? 100 : 50] });
				}else if(item.count != 0 && !province){
					arr.push({ name: item.count, value: [...s[item.name], item.count > 100 ? 100 : 50] });
				}
			});

			state.echartsMapExample.setOption({
				geo: assemblingMapModules(),
				graphic: state.graphic,
				series: buildingScatterData(arr),
				animation: false,
			});
		}

		return { renderInitEchartsRender, uninstallingAnInstance, reRendering };
	},
});
</script>



<style lang="scss" scoped>
.echartsMapBox {
	width: 100%;
	height: 100%;
	background-position-y: bottom;
	background-position-x: center;
	background-image: url(../../../assets/img/地图底盘.png);
	background-repeat: no-repeat;
	.echartsMap {
		width: 100%;
		height: 100%;

		transform: rotateX(31deg);
	}
}
</style>
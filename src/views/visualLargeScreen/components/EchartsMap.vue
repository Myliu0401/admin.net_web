<template>
	<div class="echartsMapBox">
		<div class="echartsMap" id="ChinaMap" ref="ChinaMap"></div>
	</div>
</template>


<script>
import { reactive, defineComponent } from 'vue';
import mapData from '../mapData.js'; // 地图数据

const x = 10;
const y = 25;

export default defineComponent({
	setup() {
		const state = reactive({
			// 选中的图片
			graphic: [],

			selectedProvince: [], // 选中的省份

			echartsMapExample: null, // 地图实例
		});

		// 渲染初始化echarts地图
		function renderInitEchartsRender() {
			window.echarts.registerMap('中国', mapData);
			state.echartsMapExample = window.echarts.init(document.getElementById('ChinaMap'), null, { useWorker: true });
			state.echartsMapExample.setOption({
				geo: assemblingMapModules(),
				graphic: state.graphic,
				series: buildingScatterData(),
				animation: false
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
				const coordinate = window.mapChart.convertToPixel('geo', item.name); // 获取省份在界面中的像素坐标

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
		function buildingScatterData() {
			return [
				{
					type: 'effectScatter',
					coordinateSystem: 'geo', // 使用地理坐标系
					data: [
						{ name: '散点1', value: [116.405285, 41.5, 100] },
						{ name: '散点2', value: [117.190182, 40.425596, 100] },
						{ name: '散点3', value: [87.617733, 45.0928, 130] },
						// 继续添加更多的散点数据
					],

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

		return { renderInitEchartsRender, uninstallingAnInstance };
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
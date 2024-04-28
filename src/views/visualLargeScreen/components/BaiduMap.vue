<template>
	<div class="baiduMap" id="baiduMap"></div>
</template>


<script>
import { ref, defineComponent, onBeforeMount, reactive } from 'vue';
import { getListOfTowerPoles } from '/@/api/deviceManagement/index.js';

export default defineComponent({
	props: {
		administrativeRegion: {
			default() {
				return [];
			},
		},
	},

	setup(props, { emit }) {
		const mapInstance = ref(null); // 百度地图实例

		const state = reactive({
			poles: [], // 塔杆
		});

		onBeforeMount(() => {
			setTimeout(()=>{
				renderBaiduMap();
			}); 
		});

		// 渲染百度地图
		function renderBaiduMap() {
			mapInstance.value = new BMapGL.Map('baiduMap');
			mapInstance.value.enableScrollWheelZoom(true);
			const point = new BMapGL.Point(116.404, 39.925); // 地图中心点
			mapInstance.value.centerAndZoom(point, 15); // 创建地图并设置中心点
			mapInstance.value.setMapType(BMAP_SATELLITE_MAP); // 切换到卫星地图模式
			mapInstance.value.setMaxZoom(18); // 允许用户放大到18级

			addAllMarker(mapInstance);

			// 在这里执行地图渲染完成后的操作
			mapInstance.value.addEventListener('tilesloaded', () => {
				getAllPole();
			});
		}

		// 添加所有覆盖层
		function addAllMarker(mapInstance) {
			for (let i = 0; i < state.poles.length; i++) {
				const item = state.poles[i];
				if (item.longitude && item.latitude) {
					addMarker(mapInstance, item.longitude, item.latitude, item.id); // 添加覆盖
				}
			}
		}

		// 添加覆盖成
		function addMarker(mapInstance, lon = 116.404, lat = 39.925, id) {
			const node = new BMapGL.Icon('https://img.js.design/assets/img/65f7d9a90a306d32b3048cc1.png', new BMapGL.Size(25, 25), {
				offset: new BMapGL.Size(0, 0),
			});

			var marker = new BMapGL.Marker(new BMapGL.Point(lon, lat), { icon: node });
			mapInstance.value.addOverlay(marker);
			marker.id = id;
			marker.addEventListener('click', (e) => {
				emit('clickPole', marker.id);
			});
		}

		// 销毁百度地图
		function destroyBaiduMaps() {
			window.echarts.init(document.getElementById('baiduMap')).dispose();
			mapInstance.value && mapInstance.value.destroy();
			mapInstance.value = null;
		}

		// 获取所有塔杆
		async function getAllPole() {
			if (window.poles && window.poles.length) {
				state.poles = window.poles;

			} else {
				const res = await getListOfTowerPoles({ page: 1, pageSize: 10000000 });
				window.poles = res.data.result.items;
				state.poles = res.data.result.items;
			}

			setTimeout(() => {
				mapInstance.value.clearOverlays();
				addAllMarker(mapInstance);
			}, 1000);
		};

		return { renderBaiduMap, destroyBaiduMaps };
	},
});
</script>


<style lang="scss" scoped>
.baiduMap {
	width: 100%;
	height: 100%;
}
</style>
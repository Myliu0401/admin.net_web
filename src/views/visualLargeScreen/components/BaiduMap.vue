<template>
	<div class="baiduMap" id="baiduMap"></div>
</template>


<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
	setup() {
		const mapInstance = ref(null); // 百度地图实例

		// 渲染百度地图
		function renderBaiduMap() {
			mapInstance.value = new BMapGL.Map('baiduMap');
			mapInstance.value.enableScrollWheelZoom(true);
			const point = new BMapGL.Point(116.404, 39.925); // 地图中心点
			mapInstance.value.centerAndZoom(point, 15); // 创建地图并设置中心点
			mapInstance.value.setMapType(BMAP_SATELLITE_MAP); // 切换到卫星地图模式
			mapInstance.value.setMaxZoom(18); // 允许用户放大到18级

			const node = new BMapGL.Icon('https://img.js.design/assets/img/65f7d9a90a306d32b3048cc1.png', new BMapGL.Size(25, 25), {
				offset: new BMapGL.Size(0, 0),
			});

			var marker = new BMapGL.Marker(new BMapGL.Point(116.404, 39.925), { icon: node });
			mapInstance.value.addOverlay(marker);

			marker.addEventListener('click', function () {
				console.log('点击了');
			});

			// 在这里执行地图渲染完成后的操作
			mapInstance.value.addEventListener('tilesloaded', function () {
				console.log('地图渲染完成');
			});
		};

		// 销毁百度地图
		function destroyBaiduMaps() {
			window.echarts.init(document.getElementById('baiduMap')).dispose();
			mapInstance.value && mapInstance.value.destroy();
			mapInstance.value = null;
		};

		return  { renderBaiduMap, destroyBaiduMaps };
	}
});


</script>


<style lang="scss" scoped>
.baiduMap {
	width: 100%;
	height: 100%;
}
</style>
<template>
	<div class="GTDLatestPictures">
		<div class="selectBox">
			<div class="GTDetails_selectDevice">
				<span class="title">设备: </span>
				<DropDownList prompt="请选择设备" :lists="polesDevices" @setSelected="setSelectedDevice" :activeTitle="state.devicesName" />
			</div>

			<div class="GTDetails_selectDevice">
				<span class="title">通道: </span>
				<DropDownList prompt="请选择通道" :lists="state.passDatas[state.deviceId]" :loading="state.loading" @setSelected="setSelectedPass" :activeTitle="state.passName" />
			</div>
		</div>

		<div class="GTDetails_content">
			<el-icon v-if="state.imgLoading"><ele-Loading /></el-icon>

			<el-image v-if="state.imgSrc" style="width: 90%; max-height: 90%" :src="'http://8.134.249.156:30000/'+state.imgSrc" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="['http://8.134.249.156:5005/'+state.imgSrc]" :initial-index="0" fit="cover" />
		</div>
	</div>
</template>


<script setup>
import DropDownList from './DropDownList.vue';
import { reactive, defineEmits, defineProps, onBeforeMount } from 'vue';
import { getMyChannelList } from '/@/api/deviceManagement/index.js';
import { getLatestPictures } from '/@/api/visualLargeScreen/index.js';

const props = defineProps({
	polesDevices: {
		default() {
			return [];
		},
	},
});

const state = reactive({
	devicesName: '', // 设备名称
	deviceId: '', // 设备id
	passName: '', // 通道名称
	passId: null, // 通道id
	loading: false, // 是否加载中
	passDatas: {},

	imgLoading: false,
	imgSrc: null
});

// 切换设备
async function setSelectedDevice(name) {
	const item = correspondingDevice(name);
	state.devicesName = name;
	state.deviceId = item.id;
	if (state.passDatas[item.id]) {
		return;
	}

	state.loading = true;

	// 获取通道
	const channes = await getMyChannelList({
		page: 1,
		pageSize: 10000,
		id: item.id,
	});

	state.loading = false;

	state.passDatas[item.id] = channes.data.result;
}

// 过滤获取到对应设备
function correspondingDevice(name) {
	for (let i = 0; i < props.polesDevices.length; i++) {
		const item = props.polesDevices[i];
		if (item.name === name) {
			return item;
		}
	}
}

// 选择通道
async function setSelectedPass(name) {
	state.passName = name;
	const items = state.passDatas[state.deviceId];
	const findIndex = items.findIndex((item) => {
		return item.name === name;
	});
	state.imgLoading = true;
	const res = await getLatestPictures({ id: items[findIndex].id });
	state.imgLoading = false;
	state.imgSrc = res.data.result;
}
</script>


<style lang="scss" scoped>
.GTDLatestPictures {
	width: 100%;
	height: 80%;

	.selectBox {
		display: flex;
		align-items: center;
	}

	.GTDetails_selectDevice {
		display: flex;
		align-items: center;
		position: relative;
		padding-left: 20px;
		margin-top: 10px;

		.title {
			color: rgba(99, 235, 233, 1);
			font-size: 13px;
		}
	}

	.GTDetails_content {
		margin-top: 20px;
		height: calc(100% - 65px);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.el-icon {
			font-size: 30px;
			color: #68c3c1;
		}
	}
}
</style>
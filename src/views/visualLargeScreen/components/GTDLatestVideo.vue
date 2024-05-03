<template>
	<div class="GTDLatestVideo">
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
			<el-icon v-if="state.videoLoading"><ele-Loading /></el-icon>
			<el-button v-if="example && isPlaying()" style="z-index: 111" :icon="Close" circle @click.stop="closeVideo()" />
			<el-button v-if="example && isPlaying()" style="z-index: 111; top: 52px" :icon="FullScreen" circle @click.stop="fullScreen()" />
			/*
			<div class="mongolianLayer" v-if="passId && !isPlaying()">
				<el-button :icon="CaretRight" circle @click.stop="playVideo()" />
			</div>
			*/
			<div class="content" ref="container"></div>
		</div>
	</div>
</template>


<script setup>
import DropDownList from './DropDownList.vue';
import { reactive, defineEmits, defineProps, onBeforeMount, ref, onBeforeUnmount } from 'vue';
import { getMyChannelList } from '/@/api/deviceManagement/index.js';
import { Close, CaretRight, FullScreen } from '@element-plus/icons-vue';
import { getChannelVideo } from '/@/api/visualLargeScreen/index.js';

const props = defineProps({
	polesDevices: {
		default() {
			return [];
		},
	},
});


onBeforeUnmount(()=>{
	closeVideo()
})

const example = ref(null);
const container = ref(null);

const state = reactive({
	devicesName: '', // 设备名称
	deviceId: '', // 设备id
	passName: '', // 通道名称
	passId: '', // 通道id
	loading: false, // 是否加载中
	passDatas: {},

	videoLoading: false,
	videoScr: null,
});

// 选择设备
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

// 选择通道
async function setSelectedPass(name) {
	state.passName = name;
	const items = state.passDatas[state.deviceId];
	const findIndex = items.findIndex((item) => {
		return item.name === name;
	});

	state.videoLoading = true;
	const res = await getChannelVideo({ id: items[findIndex].id });
	state.videoLoading = false;
	state.videoScr = res.data.result;
	closeVideo();
	createDirect();
	playVideo(state.videoScr);
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

// 创建视频
function createDirect() {
	example.value = new window.Jessibuca({
		container: container.value,
		videoBuffer: 1,
		isResize: true,
		useMSE: true,
		useWCS: false,
		loadingText: '正在加载中...',
		debug: false,
		supportDblclickFullscreen: false,
		showBandwidth: true,
		forceNoOffscreen: true,
		isNotMute: true,
		timeout: 10,
		controlAutoHide: true,
	});
}

// 播放视频
function playVideo(url = '', options = {}) {
	if (!example.value) {
		return;
	}
	return example.value.play(url, options);
}

// 关闭视频
function closeVideo() {
	if (!example.value) {
		return;
	}
	example.value.destroy();
	state.passName = null;
}

// 进入全屏
function fullScreen() {
	if (!example.value) {
		return;
	}

	example.value.setFullscreen(true)
}

// 返回是否正在播放中状态
function isPlaying() {
	if (!example.value) {
		return;
	}
	return example.value.isPlaying();
}
</script>


<style lang="scss" scoped>
.GTDLatestVideo {
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
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;

		.el-icon {
			font-size: 30px;
			color: #68c3c1;
			position: absolute;
		}

		.content {
			width: 100%;
			height: 100%;
		}

		.el-button--small {
			position: absolute;
			top: 20px;
			right: 20px;
			z-index: 11;
			cursor: pointer;
		}

		.mongolianLayer {
			position: absolute;
			z-index: 1;
			width: 100%;
			height: 100%;
			background-color: rgba(000, 000, 000, 0.4);
			top: 0px;
			left: 0px;

			button {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				cursor: pointer;
			}
		}
	}
}
</style>
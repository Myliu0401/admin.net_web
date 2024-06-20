<template>
	<div class="realTimeVideo">
		<div class="realTimeVideo_leftNavs">
			<div class="searchArea">
				<el-input v-model="treeData.keyword" placeholder="搜索" suffix-icon="el-icon-search" @change="search">
				</el-input>
			</div>
			<div class="accordion" :style="{ height: state.gimbalShow ? 'calc(100% - 60%)' : 'calc(100% - 17%)' }">
				<el-tree :key="treeData.myKey" show-checkbox :load="loadNode" lazy :props="treeData.defaultProps"
					:highlight-current="true" accordion @node-click="handleNodeClick">
					<template v-slot="{ node, data }">
						<p class="custom-tree-node" :title="data.code" style="width: 100%">
							{{ data.name }}
						</p>
					</template>
				</el-tree>
			</div>

			<div class="control" :style="{ height: state.gimbalShow ? 'calc(60% - 60px)' : '40px' }">
				<div class="text" style="display: flex; align-items: center">
					云台控制
					<el-icon class="el-icon--right" @click="state.gimbalShow = !state.gimbalShow">
						<ele-ArrowDown v-if="state.gimbalShow" />
						<ele-ArrowUp v-if="!state.gimbalShow" />
					</el-icon>
				</div>

				<div class="content">
					<div class="directionBox">
						<div class="item" title="左上角" @mousedown="contentMousedown('UpLeft')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="向上" @mousedown="contentMousedown('Up')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="右上角" @mousedown="contentMousedown('UpRight')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="向左" @mousedown="contentMousedown('Left')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="暂停" @click="clickGimbal('Stop')">
							<el-icon size="20"><ele-UserFilled /></el-icon>
						</div>
						<div class="item" title="向右" @mousedown="contentMousedown('Right')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="左下角" @mousedown="contentMousedown('DownLeft')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="向下" @mousedown="contentMousedown('Down')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
						<div class="item" title="右下角" @mousedown="contentMousedown('DownRight')">
							<el-icon size="20"><ele-CaretLeft /></el-icon>
						</div>
					</div>

					<div class="zoomOutBox">
						<div class="item" title="变倍 +" @mousedown="contentMousedown('Zoom1')">
							<el-icon size="20"><ele-Search /></el-icon>
							<el-icon size="10"><ele-Plus /></el-icon>
						</div>
						<div class="item" title="变倍 -" @mousedown="contentMousedown('Zoom2')">
							<el-icon size="20"><ele-Search /></el-icon>
							<el-icon size="10"><ele-Minus /></el-icon>
						</div>

						<div class="item" title="聚焦 +" @mousedown="contentMousedown('Focus1')">
							<el-icon size="20"><ele-FolderAdd /></el-icon>
						</div>
						<div class="item" title="聚焦 -" @mousedown="contentMousedown('Focus2')">
							<el-icon size="20"><ele-FolderRemove /></el-icon>
						</div>

						<div class="item" title="光圈 +" @mousedown="contentMousedown('Iris1')">
							<el-icon size="20"><ele-HelpFilled /></el-icon>
							<el-icon size="10"><ele-Plus /></el-icon>
						</div>
						<div class="item" title="光圈 -" @mousedown="contentMousedown('Iris2')">
							<el-icon size="20"><ele-Help /></el-icon>
							<el-icon size="10"><ele-Minus /></el-icon>
						</div>
					</div>

					<div class="sliderBox">
						<el-slider v-model="gimbalData.speed" :show-tooltip="false" :min="1" :max="254" />
						<el-input v-model="gimbalData.speed" disabled placeholder="速度" />
					</div>
				</div>
			</div>
		</div>

		<div class="realTimeVideo_main">
			<div class="content">
				<MultiGridVideo :currentGrid="state.currentGrid" @deleteVideo="deleteVideo" ref="multiGridVideo" @switchGrid="switchGrid1"/>
			</div>
			<div class="domain">
				<div class="domain_left">
					<div class="item">
						<img class="weiduyip" src="../../assets/realTimeVideo/2.png" @click.stop="fullScreen" />
					</div>
					<div class="item">
						<img class="weiduyip" :class="{ down: state.isDown }" :src="myMicrophoneSrc"
							@click="recordingAudio" />
					</div>
					<div class="item">
						<img class="weiduyip" src="../../assets/realTimeVideo/4.png" @click.stop="screenshot" />
					</div>
					<div class="item">
						<span class="text" v-if="state.isRecording">录制中...</span>
						<img class="weiduyip" src="../../assets/realTimeVideo/5.png"
							@click.stop="recordingAndDownloading" />
					</div>
					<div class="item">
						<img class="weiduyip" :src="volumeIcon" />

						<div class="progressBarSlider">
							<el-slider size="small" :min="0" :max="100" v-model="volume" :show-tooltip="false"
								@input="adjustingVolume"></el-slider>
						</div>
					</div>
				</div>

				<div class="domain_right">
					<Choices @setSelected="switchGrid" />
				</div>
			</div>
		</div>


		<PresetPosition />
	</div>
</template>

<script setup>
import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import Choices from './components/Choices.vue';
import directSeeding from './composition/directSeeding.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import treeInfo from './composition/tree.js';
import gimbalInfo from './composition/gimbal.js';
import MultiGridVideo from './components/MultiGridVideo.vue';
import microphoneSrc from '../../assets/realTimeVideo/麦克风.png';
import microphoneDisabledSrc from '../../assets/realTimeVideo/麦克风禁用.png';
import volumeIcon1 from '../../assets/realTimeVideo/6.png';
import volumeIcon2 from '../../assets/realTimeVideo/静音.png';
import PresetPosition from './components/presetPosition.vue';
const volume = ref(0);
const multiGridVideo = ref(null);

const state = reactive({
	voice: 0, // 音量

	isDown: false, // 是否按照
	isRecording: false, // 是否录制中

	currentGrid: '1x1', // 当前格子

	broadcastRtc: null,

	gimbalShow: true, // 云台是否展示

});

const myMicrophoneSrc = computed(() => {
	if (!multiGridVideo.value) {
		return microphoneDisabledSrc;
	}
	const example = multiGridVideo.value.returnExample();
	if (!example) {
		return microphoneDisabledSrc;
	} else {
		return example.isBroadcasting ? microphoneSrc : microphoneDisabledSrc;
	}
});

const volumeIcon = computed(()=>{
	if(volume.value){
         return volumeIcon1
	}

	return volumeIcon2
});

const { treeData, loadNode, handleNodeClick, search, cleanUp } = treeInfo(state, multiGridVideo);

const { gimbalData, clickGimbal, contentMousedown } = gimbalInfo(treeData, multiGridVideo);

//================================//

onMounted(() => { });

//=======================================================================================================//

// 录制与下载
function recordingAndDownloading() {
	if (!multiGridVideo.value.myIsRecording()) {
		startRecord();
	} else {
		stopRecordAndSave();
	}
}

function switchGrid1(value){
    volume.value = value;
}

// 按下
function mousedown() {
	state.isDown = true;
	document.addEventListener('mouseup', mouseup);
}

// 抬起
function mouseup() {
	state.isDown = false;
	document.removeEventListener('mouseup', mouseup);
}

// 切换格子
function switchGrid(text) {
	state.currentGrid = text;

	setTimeout(() => {
		const s = multiGridVideo.value.cleanUp(); // 清除
		s.forEach((currentNodeId) => {
			cleanUp(currentNodeId); // 清空导航栏的选中
		});
	}, 16);
}

// 删除视频
function deleteVideo(currentNodeId) {
	cleanUp(currentNodeId); // 解除选中导航
}

// 截图
function screenshot() {
	multiGridVideo.value.screenshot();
}

// 调节音量
function adjustingVolume(value) {
	multiGridVideo.value.adjustingVolume(value);
}

// 录制视频
function startRecord() {
	/* state.isRecording =  */ multiGridVideo.value.startRecord();
}

// 停止录制并下载
function stopRecordAndSave() {
	/* state.isRecording = false; */
	multiGridVideo.value.stopRecordAndSave();
}

// 全屏
function fullScreen() {
	multiGridVideo.value.fullScreen();
}

// 广播
function recordingAudio() {
	multiGridVideo.value.enablePauseBroadcast();
	//broadcastStatusClick();
}


function currentInstance() {
	if (!multiGridVideo.value) {
		return null
	}

	const example = multiGridVideo.value.returnExample();

	if (!example) {
		return
	}

	return example;
}

const broadcastStatusClick = async () => {
	state.broadcastRtc = new ZLMRTCClient.Endpoint({
		debug: true, // 是否打印日志
		zlmsdpUrl:
			'https://120.25.172.200:30006/index/api/webrtc?app=broadcast&stream=34020000001320004006&type=push', //流地址
		simulecast: false,
		useCamera: false,
		audioEnable: true,
		videoEnable: false,
		recvOnly: false,
	});

	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_NOT_SUPPORT, (e) => {
		// 获取到了本地流
		console.error('不支持webrtc', e);
	});

	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, (e) => {
		// ICE 协商出错
		console.error('ICE 协商出错');
	});

	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, (e) => {
		// offer anwser 交换失败
		console.error('offer anwser 交换失败', e);
	});
	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e) => {
		// offer anwser 交换失败
		console.log('状态改变', e);
	});
	state.broadcastRtc.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, (e) => {
		// offer anwser 交换失败
		console.log('捕获流失败', e);
	});
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>

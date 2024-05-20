<template>
	<div class="realTimeVideo">
		<div class="realTimeVideo_leftNavs">
			<div class="searchArea">
				<el-input v-model="treeData.keyword" placeholder="搜索" suffix-icon="el-icon-search" @change="search"> </el-input>
			</div>
			<div class="accordion">
				<el-tree :key="treeData.myKey" show-checkbox :load="loadNode" lazy :props="treeData.defaultProps" :highlight-current="true" accordion @node-click="handleNodeClick" />
			</div>

			<div class="control">
				<span class="text">云台控制</span>

				<div class="content">
					<div class="circle-btn">
						<el-icon v-for="text in ['Up', 'UpRight', 'Right', 'DownRight', 'Down', 'Left', 'DownLeft', 'UpLeft']" :size="27" :key="text" color="#ccc" @click="clickGimbal(text)">
							<ele-CaretTop />
						</el-icon>

						<el-button class="cease" circle @click="clickGimbal('Stop')">停止</el-button>
					</div>

					<ul class="liest">
						<li class="item">
							<span class="title">变倍</span>
							<div class="main">
								<el-icon :size="25" :key="num" color="#333" @click="clickGimbal('Zoom1')">
									<ele-CirclePlusFilled />
								</el-icon>

								<el-icon :size="25" :key="num" color="#333" @click="clickGimbal('Zoom2')">
									<ele-RemoveFilled />
								</el-icon>
							</div>
						</li>

						<li class="item">
							<span class="title">聚焦</span>
							<div class="main">
								<el-icon :size="25" :key="num" color="#333" @click="clickGimbal('Focus1')">
									<ele-CirclePlusFilled />
								</el-icon>

								<el-icon :size="25" :key="num" color="#333" @click="clickGimbal('Focus2')">
									<ele-RemoveFilled />
								</el-icon>
							</div>
						</li>

						<li class="item">
							<span class="title">光圈</span>
							<div class="main">
								<el-icon :size="25" :key="num" color="#333" @click="clickGimbal('Iris1')">
									<ele-CirclePlusFilled />
								</el-icon>

								<el-icon :size="25" :key="num" color="#333" @click="clickGimbal('Iris2')">
									<ele-RemoveFilled />
								</el-icon>
							</div>
						</li>

						<li class="item">
							<span class="title">速度</span>
							<div class="main" style="padding-left: 13px; padding-right: 13px">
								<el-slider :min="1" :max="254" size="small" v-model="gimbalData.speed" />
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="realTimeVideo_main">
			<div class="content">
				<MultiGridVideo :currentGrid="state.currentGrid" @deleteVideo="deleteVideo" ref="multiGridVideo" />
			</div>
			<div class="domain">
				<div class="domain_left">
					<div class="item">
						<img class="weiduyip" src="../../assets/realTimeVideo/1.png" />
					</div>

					<div class="item">
						<img class="weiduyip" src="../../assets/realTimeVideo/2.png" @click.stop="fullScreen" />
					</div>
					<div class="item">
						<img class="weiduyip" :class="{ down: state.isDown }" src="../../assets/realTimeVideo/3.png" @mousedown="mousedown" />
					</div>
					<div class="item">
						<img class="weiduyip" src="../../assets/realTimeVideo/4.png" @click.stop="screenshot" />
					</div>
					<div class="item">
						<span class="text" v-if="state.isRecording">录制中...</span>
						<img class="weiduyip" src="../../assets/realTimeVideo/5.png" @click.stop="recordingAndDownloading" />
					</div>
					<div class="item">
						<img class="weiduyip" src="../../assets/realTimeVideo/6.png" />

						<div class="progressBarSlider">
							<el-slider size="small" :min="0" :max="100" v-model="volume" :show-tooltip="false" @input.stop="adjustingVolume"></el-slider>
						</div>
					</div>
				</div>

				<div class="domain_right">
					<Choices @setSelected="switchGrid" />
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import Choices from './components/Choices.vue';
import directSeeding from './composition/directSeeding.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import treeInfo from './composition/tree.js';
import gimbalInfo from './composition/gimbal.js';
import MultiGridVideo from './components/MultiGridVideo.vue';

const volume = ref(0);
const multiGridVideo = ref(null);

const state = reactive({
	voice: 0, // 音量

	isDown: false, // 是否按照
	isRecording: false, // 是否录制中

	currentGrid: '1x1', // 当前格子
});

const { treeData, loadNode, handleNodeClick, search, cleanUp } = treeInfo(state, multiGridVideo);

const { gimbalData, clickGimbal } = gimbalInfo(treeData, multiGridVideo);

//================================//

onMounted(() => {});

//=======================================================================================================//

// 录制与下载
function recordingAndDownloading() {
	if (state.isRecording) {
		startRecord();
	} else {
		stopRecordAndSave();
	}
};

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
		const s = multiGridVideo.value.cleanUp();
		s.forEach((currentNodeId) => {
			cleanUp(currentNodeId);
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
	state.isRecording = multiGridVideo.value.startRecord();
}

// 停止录制并下载
function stopRecordAndSave() {
	state.isRecording = false;
	multiGridVideo.value.stopRecordAndSave();
}

// 全屏
function fullScreen() {
	multiGridVideo.value.fullScreen();
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style  lang="scss">
@import './index.scss';
</style>
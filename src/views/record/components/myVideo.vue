<template>
	<el-dialog title="播放视频" v-model="state.show" :close-on-click-modal="false" width="50%" :before-close="close">
		<div class="myVideo">
			<div class="content" ref="container"></div>
			<el-icon v-if="state.loading" class="loading"><ele-Loading /></el-icon>
			<el-icon class="quanpin" @click="fullScreen"><ele-FullScreen /></el-icon>
		</div>
	</el-dialog>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import { getRecordSrc } from '/@/api/recordingManagement/index.js';

export default {
	setup(props, { emit }) {
		const state = reactive({
			show: false,
			videoSrc: null,
			loading: false,
		});

		const example = ref(null);
		const container = ref(null);

		function close() {
			state.show = false;
			closeVideo();
		}

		async function open(item) {
			state.show = true;
			state.loading = true;
			const res = await getRecordSrc({ id: item.id, taskId: item.taskId });
			state.loading = false;
			state.videoSrc = res.data.result;
			createDirect();
			playVideo(state.videoSrc);
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

		// 全屏
		function fullScreen() {
		
          
			example.value && example.value.setFullscreen(true);
		}

		// 关闭视频
		function closeVideo() {
			if (!example.value) {
				return;
			}
			example.value.destroy();
		}

		// 返回是否正在播放中状态
		function isPlaying() {
			if (!example.value) {
				return;
			}
			return example.value.isPlaying();
		}
		return { state, open, close, example, container, fullScreen };
	},
};
</script>


<style lang="scss" scoped>
.myVideo {
	height: 53vh;
	display: flex;
	align-items: center;
	position: relative;
	justify-content: center;
	.content {
		width: 90%;
		height: 90%;
	}

	.loading {
		font-size: 30px;
		position: absolute;
		animation: rotate360 2s linear infinite;
	}

	.quanpin {
		position: absolute;
		top: 0px;
		right: 0px;
		font-size: 20px;
		cursor: pointer;
        transition: all 0.2s;
		&:hover{
			transform: scale(1.2);
		}
	}
}

@keyframes rotate360 {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
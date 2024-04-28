<template>
	<el-dialog title="播放视频" v-model="state.show" :close-on-click-modal="false" width="50%" :before-close="close">
		<div class="myVideo">
            <div class="content" ref="container">

            </div>
        </div>
	</el-dialog>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
export default {
	setup(props, { emit }) {
		const state = reactive({
			show: false,
		});

        const example = ref(null);
        const container = ref(null);

		function close() {
			state.show = false;
            closeVideo();
		}

		function open() {
			state.show = true;
            setTimeout(()=>{ createDirect(); }, 500)
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
		function playVideo() {
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
		}

		// 返回是否正在播放中状态
		function isPlaying() {
			if (!example.value) {
				return;
			}
			return example.value.isPlaying();
		}
		return { state, open, close, example, container };
	},
};
</script>


<style lang="scss" scoped>
.myVideo {
	height: 53vh;
    display: flex;
    align-items: center;
    justify-content: center;
    .content{
        width: 90%;
        height: 90%;
    }
}
</style>
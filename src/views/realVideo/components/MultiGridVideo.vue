<template>
	<div class="multiGridVideo">
		<ul class="multiGridVideo_ul">
			<li v-for="num in currentGridNum" :key="num" class="ul_li" :class="{
				yige: currentGridNum === 1,
				liange: currentGridNum === 4,
				shangge: currentGridNum === 9,
				active: state.activeNum === num,
			}" @click.stop="selectGrid(num)">
				<el-button style="z-index: 111" :icon="Close" circle @click.stop="closeVideo(num)"
					v-if="state.videoInfos[num]" />

				<div class="mongolianLayer" v-if="state.videoInfos[num] && !state.videoInfos[num].isPlaying()">
					<el-button v-if="!state.videoInfos[num].loading" :icon="CaretRight" circle
						@click.stop="playVideo(num)" />
					<el-icon v-else style="
							color: #fff;
							font-size: 30px;
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						"><ele-Loading /></el-icon>
				</div>
				<el-text v-if="state.videoInfos[num] && state.videoInfos[num].isBroadcasting" class="guanbo"
					type="danger" size="small">广播中...</el-text>
				<el-text v-if="state.videoInfos[num]" class="guanbo" size="small" style="
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						top: 0px;
						color: #fff;
						text-align: center;
						z-index: 11;
					">
					通道名称:{{ state.videoInfos[num].passagewayName }}</el-text>

				<div class="myVideo"></div>
			</li>
		</ul>

		<teleport to="#app">
			<PullFrame :videoInfos="state.videoInfos" :activeNum="state.activeNum" :currentGrid="currentGrid" />
		</teleport>

		<span style="display: none">{{ state.random }}</span>
	</div>
</template>

<script name="MultiGridVideo">
import { defineProps, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed, watch } from 'vue';
import { Close, CaretRight } from '@element-plus/icons-vue';
import { getMyPlaybackURL, getBroadcastAddress } from '/@/api/realTimeVideo/index.js';
import PullFrame from './pullFrame.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
	components: { PullFrame },

	props: {
		// 当前格子
		currentGrid: {
			default: '1x1',
		},
	},

	setup(props, { emit }) {
		const state = reactive({
			activeNum: null, // 当前选中的格子

			videoInfos: {}, // 视频数据

			random: null,

			randomId: null,
		});

		watch(
			() => {
				return props.currentGrid;
			},
			() => {
				const keys = Object.keys(state.videoInfos);

				for (let i = 0; i < keys.length; i++) {
					if (+keys[i] > +currentGridNum.value) {
						state.videoInfos[keys[i]].destroy();
					}
				}
			}
		);

		// 当前格子数量
		const currentGridNum = computed(() => {
			state.activeNum = null;
			switch (props.currentGrid) {
				case '1x1':
					return 1;
				case '2x2':
					return 4;
				case '3x3':
					return 9;
			}
		});

		onBeforeMount(() => {
			window.addEventListener('click', deselect);

			state.randomId = setInterval(() => {
				state.random = Math.random();
			}, 2000);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('click', deselect);

			clearInterval(state.randomId);

			const s = Object.keys(state.videoInfos);

			for (let i = 0; i < s.length; i++) {
				state.videoInfos[s[i]] && state.videoInfos[s[i]].destroy();
			}
		});

		// 取消选中
		function deselect(e) {
			state.activeNum = null;
		}

		// 选中格子
		function selectGrid(num) {
			if (props.currentGrid === '1x1') {
				state.activeNum = null;
			} else {
				state.activeNum = num;
			}
			const example = state.videoInfos[state.activeNum || geta()];
			emit('switchGrid', example ? example.volume : 0);
		}

		// 关闭视频
		function closeVideo(key) {
			state.videoInfos[key].destroy();

			emit('deleteVideo', state.videoInfos[key].currentNodeId); // 删除视频

			delete state.videoInfos[key];
		}

		// 播放视频
		async function playVideo(num) {
			if (state.videoInfos[num].loading) {
				return;
			}
			state.videoInfos[num].loading = true;
			let res = null;
			try {
				res = await getMyPlaybackURL({
					id: state.videoInfos[num].id,
				});
			} catch (err) {
				state.videoInfos[num].loading = false;
				return;
			}

			state.videoInfos[num].create(num);
			state.videoInfos[num].play(res.data.result);
			state.videoInfos[num].loading = false;

		}

		function getDuiYin() {
			if (!state.videoInfos['1']) {
				return 1;
			} else if (!state.videoInfos['2']) {
				return 2;
			} else if (!state.videoInfos['3']) {
				return 3;
			} else if (!state.videoInfos['4']) {
				return 4;
			} else if (!state.videoInfos['5']) {
				return 5;
			} else if (!state.videoInfos['6']) {
				return 6;
			} else if (!state.videoInfos['7']) {
				return 7;
			} else if (!state.videoInfos['8']) {
				return 8;
			} else if (!state.videoInfos['9']) {
				return 9;
			}
		}

		// 创建视频实例
		class createVideoInstance {
			constructor(currentNodeId, id, name) {
				// 判断选择宽中是否已经有数据
				if (state.videoInfos[state.activeNum]) {
					state.activeNum = null;
				}

				state.videoInfos[state.activeNum || getDuiYin()] = this;
				this.currentNodeId = currentNodeId; // 随机的唯一id
				this.loading = false;
				this.id = id; // 通道id
				this.passagewayName = name; // 通道名称
				this.player = null;
				this.isBroadcasting = false; // 是否广播中
				this.volume = 50; // 音量
				state.activeNum = null;
			}

			create(num) {
				this.destroy();
				this.example = new window.Jessibuca({
					container: document.querySelectorAll('.multiGridVideo .myVideo')[num - 1],
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

				// 播放过程中是否异常
				this.example.on('delayTimeout', () => {
					this.destroy();
				});

				// 录制是否结束
				this.example.on('recordEnd', () => { });

				// 是否是全屏
				this.example.on('fullscreen', function (flag) {
					window.fullscreen = flag;
				});

				this.example.on("error",  (error)=> {
					this.volume = 0;
					console.log(error)
					emit('switchGrid', 0);
				})
			}

			// 调节音量
			adjustingVolume(value) {
				if (!this.example) {
					return;
				}
				this.example.setVolume(value / 100);
				this.volume = value;
			}

			// 暂停播放
			pause() {
				if (!this.example) {
					return;
				}
				return this.example.pause();
			}

			// 关闭视频,不释放底层资源
			close() {
				if (!this.example) {
					return;
				}
				this.example.close();
				this.example.player && this.example.player.close();
			}

			// 关闭视频，释放底层资源
			destroy() {
				if (!this.example) {
					return;
				}
				this.example.destroy();
			}

			// 清理画布为黑色背景
			clearView() {
				if (!this.example) {
					return;
				}
				this.example.clearView();
			}

			// 播放视频
			play(url = undefined, options = {}) {
				if (!this.example) {
					return;
				}
				let bool = false;
				bool = this.example.play(url, options);
				setTimeout(() => {
					adjustingVolume(this.volume);
				}, 1000);
				return bool;
			}

			// 重新调整视图大小
			resize() {
				if (!this.example) {
					return;
				}
				return this.example.resize();
			}

			// 全屏(取消全屏)播放视频
			setFullscreen(bool = true) {
				if (!this.example) {
					return;
				}
				this.example.setFullscreen(bool);
			}

			// 截图
			screenshot(filename = 'shipin', format = 'jpeg', quality = 1, type = 'download') {
				let text = '';
				if (!this.example) {
					text = '请先创建实例';
				}
				if (text) {
					ElMessage({
						message: text,
						type: 'warning',
					});
					return;
				}
				this.example.screenshot(filename, format, quality, type);
			}

			// 录制视频
			startRecord(fileName = 'luzhi', fileType = 'mp4') {
				if (!this.example) {
					return;
				}
				this.example.startRecord(fileName, fileType);
			}

			// 暂停录制并下载
			stopRecordAndSave() {
				if (!this.example) {
					return;
				}
				this.example.stopRecordAndSave();
			}

			// 返回是否正在播放中状态
			isPlaying() {
				if (!this.example) {
					return;
				}

				let bool = false;

				bool = this.example.isPlaying();

				return bool;
			}

			// 返回是否静音
			isMute() {
				if (!this.example) {
					return;
				}
				return this.example.isMute();
			}

			// 返回是否正在录制
			isRecording() {
				if (!this.example) {
					return;
				}
				let bool = null;
				try {
					bool = this.example.isRecording();
				} catch (err) {
					bool = false;
				}

				return bool;
			}
		}

		// 清除
		function cleanUp() {
			let index = null;
			if (props.currentGrid === '1x1') {
				index = 1;
			} else if (props.currentGrid === '2x2') {
				index = 4;
			} else if (props.currentGrid === '3x3') {
				index = 1000;
			}

			const s = Object.keys(state.videoInfos).length;
			const arr = [];

			for (let i = index; i < s; i++) {
				i + 1 >= index && state.videoInfos[i + 1] && arr.push(state.videoInfos[i + 1].currentNodeId);
				i + 1 >= index && state.videoInfos[i + 1] && delete state.videoInfos[i + 1];
			}

			return arr;
		}

		// 全屏
		function fullScreen() {
			const example = state.videoInfos[state.activeNum || geta()];

			example && example.setFullscreen();
		}

		// 截图
		function screenshot() {
			const example = state.videoInfos[state.activeNum || geta()];

			example && example.screenshot();
		}

		// 调节音量
		function adjustingVolume(value) {
			const example = state.videoInfos[state.activeNum || geta()];
			example && example.adjustingVolume(value);
		}

		// 录制视频
		function startRecord() {
			const example = state.videoInfos[state.activeNum || geta()];

			example && example.startRecord();

			return !!example;
		}

		// 停止录制并下载
		function stopRecordAndSave() {
			const example = state.videoInfos[state.activeNum || geta()];

			example && example.stopRecordAndSave();

			return !!example;

		}

		function myIsRecording() {
			const example = state.videoInfos[state.activeNum || geta()];

			if (example) {
				return example.isRecording();
			}

			return undefined;
		}

		function geta() {
			if (state.videoInfos['1']) {
				return 1;
			} else if (state.videoInfos['2']) {
				return 2;
			} else if (state.videoInfos['3']) {
				return 3;
			} else if (state.videoInfos['4']) {
				return 4;
			} else if (state.videoInfos['5']) {
				return 5;
			} else if (state.videoInfos['6']) {
				return 6;
			} else if (state.videoInfos['7']) {
				return 7;
			} else if (state.videoInfos['8']) {
				return 8;
			} else if (state.videoInfos['9']) {
				return 9;
			}
		}

		function currentId() {
			if (state.activeNum) {
				return state.videoInfos[state.activeNum] ? state.videoInfos[state.activeNum].id : false;
			} else {
				return state.videoInfos[geta()] ? state.videoInfos[geta()].id : false;
			}
		}

		// 启用暂停广播
		async function enablePauseBroadcast() {
			const example = state.videoInfos[state.activeNum || geta()];

			if (!example) {
				return;
			}

			// 判断是否广播中
			if (example.isBroadcasting && example.player) {
				example.isBroadcasting = false;
				example.player.close();
				ElMessage({
					message: '已关闭',
					type: 'success',
				});
				return;
			}

			const res = await getBroadcastAddress({ id: example.id }); // 获取媒体流地址
			const player = createPlayer(res.data.result, example);
			example.player = player;
			example.isBroadcasting = true;

		}

		// 创建播放实例
		function createPlayer(url, example) {
			console.log(url);
			const player = new ZLMRTCClient.Endpoint({
				debug: true, // 是否打印日志
				zlmsdpUrl: url, //流地址
				simulecast: false,
				useCamera: false,
				audioEnable: true,
				videoEnable: false,
				recvOnly: false,
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS, (e) => {
				//获取到了远端流，可以播放
				console.log('WEBRTC_ON_REMOTE_STREAMS 播放成功', e.streams);
				ElMessage({
					message: '播放成功',
					type: 'success',
				});
				example.isBroadcasting = true;
			});

			player.on(ZLMRTCClient.Events.WEBRTC_NOT_SUPPORT, (e) => {
				// 获取到了本地流
				console.error('WEBRTC_NOT_SUPPORT 不支持webrtc', e);
				example.isBroadcasting = false;
				ElMessage({
					message: '不支持webrtc',
					type: 'warning',
				});
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, (e) => {
				// ICE 协商出错
				console.error('WEBRTC_ICE_CANDIDATE_ERROR ICE 协商出错');
				example.isBroadcasting = false;
				ElMessage({
					message: 'ICE 协商出错',
					type: 'warning',
				});
			});

			player.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, (e) => {
				// offer anwser 交换失败
				console.error('WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED offer anwser 交换失败', e);
				example.isBroadcasting = false;
				ElMessage({
					message: 'offer anwser 交换失败',
					type: 'warning',
				});
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e) => {
				// offer anwser 交换失败
				console.log('WEBRTC_ON_CONNECTION_STATE_CHANGE 状态改变', e);
			});

			player.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, (e) => {
				// offer anwser 交换失败
				console.log('CAPTURE_STREAM_FAILED 捕获流失败', e);
				example.isBroadcasting = false;
				ElMessage({
					message: '捕获流失败',
					type: 'warning',
				});
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN, (e) => {
				console.log('WEBRTC_ON_DATA_CHANNEL_OPEN', e);
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE, (e) => {
				console.log('WEBRTC_ON_DATA_CHANNEL_CLOSE', e);
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR, (e) => {
				console.log('WEBRTC_ON_DATA_CHANNEL_ERR', e);
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_MSG, (e) => {
				console.log('WEBRTC_ON_DATA_CHANNEL_MSG', e);
			});

			player.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM, function (s) {
				console.log('WEBRTC_ON_LOCAL_STREAM', e);
			});

			return player;
		}


		// 返回当前选中的实例
		function returnExample() {
			const example = state.videoInfos[state.activeNum || geta()];

			if (!example) {
				return null;
			};

			return example;
		};



		return {
			state,
			currentGridNum,
			selectGrid,
			Close,
			closeVideo,
			playVideo,
			cleanUp,
			fullScreen,
			screenshot,
			adjustingVolume,
			startRecord,
			stopRecordAndSave,
			currentId,
			myIsRecording,
			enablePauseBroadcast,
			CaretRight,
			createVideoInstance,
			returnExample
		};
	},
};
</script>

<style lang="scss" scoped>
.multiGridVideo {
	width: 100%;
	height: 100%;

	.multiGridVideo_ul {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;

		.ul_li {
			list-style: none;
			padding: 0px;
			margin: 0px;
			cursor: pointer;
			position: relative;
			overflow: hidden;

			&.active {
				border: 2px solid #116895 !important;
			}

			&.yige {
				width: 100%;
				height: 100%;
			}

			&.liange {
				width: 50%;
				height: 50%;
				border: 1px solid transparent;

				&:nth-child(1) {
					border-bottom: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}

				&:nth-child(2) {
					border-bottom: 1px solid #ccc;
				}

				&:nth-child(3) {
					border-right: 1px solid #ccc;
				}

				&:nth-child(4) {}
			}

			&.shangge {
				width: 33.33%;
				height: 33.33%;
				border: 1px solid transparent;

				&:nth-child(1) {
					border-bottom: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}

				&:nth-child(2) {
					border-bottom: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}

				&:nth-child(3) {
					border-bottom: 1px solid #ccc;
				}

				&:nth-child(4) {
					border-bottom: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}

				&:nth-child(5) {
					border-bottom: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}

				&:nth-child(6) {
					border-bottom: 1px solid #ccc;
				}

				&:nth-child(7) {
					border-right: 1px solid #ccc;
				}

				&:nth-child(8) {
					border-right: 1px solid #ccc;
				}

				&:nth-child(9) {}
			}

			&:hover {
				.el-button {
					right: 15px;
					top: 15px;
				}
			}

			.el-button {
				width: 30px;
				height: 30px;
				position: absolute;
				right: 15px;
				top: -40px;
				transition: all 0.5s;
			}

			.mongolianLayer {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 2;
				background-color: rgba(102, 102, 102, 0.5);
				top: 0px;
				left: 0px;

				.el-button {
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					transition: all 0s;
					width: 37px;
					height: 37px;
				}
			}

			.guanbo {
				position: absolute;
				top: 3px;
				left: 3px;
			}
		}
	}
}
</style>

<style lang="scss">
.multiGridVideo {
	.multiGridVideo_ul {
		.ul_li {
			.el-button {
				.el-icon {
					font-size: 20px;
				}
			}

			.mongolianLayer {
				.el-button {
					.el-icon {
						font-size: 25px;
					}
				}
			}
		}
	}
}
</style>

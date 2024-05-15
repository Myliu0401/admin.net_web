<template>
	<div
		v-if="state.isMove"
		class="pullFrame"
		:style="{
			top: state.moveY < state.pressY ? state.pressY - (state.pressY - state.moveY) + 'px' : state.pressY + 'px',
			left: state.moveX < state.pressX ? state.pressX - (state.pressX - state.moveX) + 'px' : state.pressX + 'px',
			width: Math.abs(state.moveX - state.pressX) + 'px',
			height: Math.abs(state.moveY - state.pressY) + 'px',
		}"
	></div>
</template>



<script>
import { defineProps, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed, watch } from 'vue';
import { dragZoom } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		videoInfos: {
			default() {
				return {};
			},
		},
		activeNum: {
			default: undefined,
		},
		currentGrid: {
			default: undefined,
		},
	},

	setup(props, { emit }) {
		const state = reactive({
			isPress: false, // 是否按下
			isMove: false,
			pressX: 0, // 按下的x坐标
			pressY: 0, // 按下的y坐标
			moveX: 0, // 移动的x坐标
			moveY: 0, // 移动的y坐标
		});

		onBeforeMount(() => {
			window.addEventListener('mousedown', mousedown);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('mousedown', mousedown);
		});

		// 按下
		function mousedown({ clientX, clientY }) {
			if (window.fullscreen) {
				return;
			}

			state.pressX = clientX;
			state.pressY = clientY;

			if (judge()) {
				state.isPress = true;
			}

			window.addEventListener('mousemove', mousemove);
			window.addEventListener('mouseup', mouseup);
		}

		// 移动
		function mousemove({ clientX, clientY }) {
			state.moveX = clientX;
			state.moveY = clientY;
			if (state.isPress) {
				state.isMove = true;
			}
		}

		// 抬起
		function mouseup({ clientX, clientY }) {
			window.removeEventListener('mousemove', mousemove);
			window.removeEventListener('mouseup', mouseup);

			if (window.fullscreen) {
				return;
			}

			const s = calculateTheDistance();

			if (s) {	

				let x = state.pressX < s.startX ? s.startX : state.pressX > s.endX ? s.endX : state.pressX;
				let y = state.pressY < s.startY ? s.startY : state.pressY > s.endY ? s.endY : state.pressY;
				let x1 = state.moveX < s.startX ? s.startX : state.moveX > s.endX ? s.endX : state.moveX;
				let y1 = state.moveY < s.startY ? s.startY : state.moveY > s.endY ? s.endY : state.moveY;
				

				let xz = x - s.startX;
				let yx = y - s.startY;
				let xz1 = x1 - s.startX;
				let yz1 = y1 - s.startY;

               
				myDragZoom({ 
					startX: Math.round(xz), 
					startY: Math.round(yx), 
					endX: Math.round(xz1), 
					endY: Math.round(yz1), 
					contentActualWidth: Math.round(s.contentActualWidth), 
					contentActualHeight: Math.round(s.contentActualHeight),
					id: s.id
				});
			}

			state.isPress = false;
			state.isMove = false;
			state.pressX = null;
			state.pressY = null;
			state.moveX = null;
			state.moveY = null;
		};


		function calculateTheDistance() {
			const multiGridVideo_uls = document.querySelectorAll('.multiGridVideo_ul .ul_li');

			if (!Object.keys(props.videoInfos).length) {
				return;
			}

			let video;

			if (props.currentGrid === '1x1') {
				video = multiGridVideo_uls[0].querySelector('video');
			} else if (props.currentGrid !== '1x1' && props.activeNum) {
				video = multiGridVideo_uls[props.activeNum - 1].querySelector('video');
			}

			if (!video) {
				return;
			}

			const obj = redundancy(video);

			if (state.pressX > obj.x1 && state.pressX < obj.x2 && state.pressY > obj.y1 && state.pressY < obj.y2) {
				return {
					startX: obj.x1,
					startY: obj.y1,
					endX: obj.x2,
					endY: obj.y2,
					contentActualHeight: obj.contentActualHeight,
					contentActualWidth: obj.contentActualWidth,
					id: props.currentGrid === '1x1' ? props.videoInfos[1].id : props.videoInfos[props.activeNum].id
				};
			}

			return;
		}

		function judge() {
			const videos = document.querySelectorAll('video');
			if (!videos.length) {
				return false;
			}

			for (let i = 0; i < videos.length; i++) {
				const video = videos[i];
				const obj = redundancy(video);

				if (state.pressX > obj.x1 && state.pressX < obj.x2 && state.pressY > obj.y1 && state.pressY < obj.y2) {
					return true;
				}
			}

			return false;
		}

		// 冗余
		function redundancy(video) {
			const info = video.getBoundingClientRect();

			// 获取视频元素的宽度和高度
			const videoWidth = video.offsetWidth;
			const videoHeight = video.offsetHeight;

			// 获取视频内容的原始宽度和高度
			const contentWidth = video.videoWidth;
			const contentHeight = video.videoHeight;

			// 计算视频内容区域的实际宽度和高度
			let contentActualWidth, contentActualHeight;

			if (contentWidth / videoWidth > contentHeight / videoHeight) {
				contentActualWidth = videoWidth;
				contentActualHeight = contentHeight * (videoWidth / contentWidth);
			} else {
				contentActualWidth = contentWidth * (videoHeight / contentHeight);
				contentActualHeight = videoHeight;
			}

			const x = videoWidth - contentActualWidth;
			const y = videoHeight - contentActualHeight;

			const x1 = info.left + x / 2;
			const y1 = info.top + y / 2;

			const x2 = x1 + contentActualWidth;
			const y2 = y1 + contentActualHeight;

			return {
				x1,
				y1,
				x2,
				y2,
				contentActualWidth,
				contentActualHeight
			};
		};


        // 进行拉框缩放
		async function myDragZoom(obj){

			let startX = obj.startX < 0 ? 0 : obj.startX;
			let startY = obj.startY < 0 ? 0 : obj.startY;
			let endX = obj.endX < 0 ? 0 : obj.endX;
			let endY = obj.endY < 0 ? 0 : obj.endY;

			endX = obj.contentActualWidth - (obj.contentActualWidth - endX);
			endY = obj.contentActualHeight - (obj.contentActualHeight - endY);

            await dragZoom({
                channelId: obj.id,
				displayBoxWidth: obj.contentActualWidth,
				displayBoxHeight: obj.contentActualHeight,
				selectionStartPoint: {
					x: startX,
					y: startY
				},
				selectionEndPoint: {
					x: endX,
					y: endY
				}
			});

			ElMessage({
				message: '成功',
				type: 'success',
			});

		};

		return { state };
	},
};
</script>


<style lang="scss" scoped>
.pullFrame {
	position: fixed;
	background-color: rgba(44, 127, 169, 0.3);
	border: 1px solid rgba(44, 127, 169, 0.8);
	z-index: 1111;
}
</style>
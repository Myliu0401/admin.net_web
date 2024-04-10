<template>
	<div class="sliderBar">
		<span class="text">{{ title }}</span>
		<div class="barBox" ref="barBoxDom">
			<p class="barBox_bar" :style="{ width: state.schedule + 'px' }">
				<span class="drop" :class="{ down: state.isDown }" @mousedown="mousedown"></span>
			</p>
		</div>
		<span class="text1">{{ state.myValue }}</span>
	</div>
</template>

<script setup>
import { defineProps, ref, onBeforeMount, onMounted, reactive, watch } from 'vue';

const props = defineProps({
	title: {
		default: '',
	},
	maxValue: {
		default: 100,
	},
	minValue: {
		default: 0,
	},
	value: {
		default: 0,
	},
});

const barBoxDom = ref(null);

const state = reactive({
	schedule: 11, // 当前进度条
	barBoxWidth: 0, // 进度条总宽度
	downX: 0, // 按住位置
	lastTimeX: 0, // 上一次的位置
	isDown: false, // 是否按住鼠标
	myValue: props.value, // 当前值
});

onMounted(() => {
	setTimeout(() => {
		state.barBoxWidth = barBoxDom.value.offsetWidth;
		init();
	}, 300);
});

watch(
	() => {
		return props.value;
	},
	(newVal) => {
		state.myValue = newVal;
		init();
	}
);

// 鼠标按下时触发
function mousedown(e) {
	state.downX = e.clientX;
	state.isDown = true;
	document.addEventListener('mousemove', mousemove);
	document.addEventListener('mouseup', mouseup);
}

// 鼠标移动时触发
function mousemove(e) {
	state.schedule = e.clientX - state.downX + state.lastTimeX;

	if (state.schedule <= 11) {
		state.schedule = 11;
	} else if (state.schedule >= state.barBoxWidth) {
		state.schedule = state.barBoxWidth;
	}

	let value = ((state.schedule - 11) / (state.barBoxWidth - 11)) * (props.maxValue - props.minValue) + props.minValue;
	state.myValue = Math.ceil(value);
}

// 鼠标抬起时触发
function mouseup() {
	state.lastTimeX = state.schedule;
	state.isDown = false;
	document.removeEventListener('mousemove', mousemove);
	document.removeEventListener('mouseup', mouseup);
}

// 初始化
function init() {
	state.schedule = (state.barBoxWidth / props.maxValue) * props.value;
	state.schedule = state.schedule <= 11 ? 11 : state.schedule;
	state.lastTimeX = state.schedule;
}
</script>


<style lang="scss" scoped>
.sliderBar {
	display: flex;
	align-items: center;

	.text {
		color: rgba(197, 255, 254, 1);
		width: 50px;
		display: flex;
		justify-content: flex-end;
		font-size: 13px;
		white-space: nowrap;
	}

	.text1 {
		color: rgba(197, 255, 254, 1);
		display: flex;
		justify-content: flex-end;
		width: 30px;
		justify-content: flex-start;
		font-size: 14px;
	}

	.barBox {
		margin: 0px 10px;
		flex-grow: 1;
		height: 11px;
		border-radius: 8px;
		background-color: rgba(6, 75, 161, 1);
		cursor: pointer;
		position: relative;

		.barBox_bar {
			position: absolute;
			height: 100%;
			background: linear-gradient(270deg, rgba(99, 235, 233, 1) 0%, rgba(6, 118, 255, 1) 100%);
			border-radius: 8px;

			.drop {
				position: absolute;
				height: 100%;
				width: 11px;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, 1);
				right: 0px;
				//  transform: translateX(100%);

				border: 1px solid rgba(99, 235, 233, 0.8);

				transition: all 0.3s;

				box-shadow: 0px 0px 1.5px 1.5px rgba(255, 255, 255, 0.5), 0px 0px 1px 1px rgba(0, 195, 255, 0.5);

				&:not(.down):hover {
					box-shadow: 0px 0px 2.5px 2.5px rgba(255, 255, 255, 0.5), 0px 0px 2px 1px rgba(0, 195, 255, 0.5);
				}

				&.down {
					box-shadow: 0px 0px 4px 4px rgba(255, 255, 255, 0.5), 0px 0px 4px 2px rgba(0, 195, 255, 0.5);
				}
			}
		}
	}
}
</style>
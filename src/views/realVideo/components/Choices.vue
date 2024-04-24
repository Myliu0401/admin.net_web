<template>
	<div class="choice">
		<div class="choiceBox" :class="{ active: state.isActive }" @click="handleClick">
			{{ state.data[state.activeIndex] }}
		</div>
		<div class="contentBox" :style="{ height: state.isActive ? (state.data.length - 1) * 40 + 1 + 'px' : '0px' }">
			<ul class="ul">
				<li class="li" v-for="(text, index) in selectionItems" :key="index" @click="switchSelection(text)">{{
			text }}</li>
			</ul>
		</div>
	</div>
</template>


<script setup name="Choices">
import { defineProps, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed, defineEmits } from 'vue';
const emit = defineEmits(['setSelected']);

const props = defineProps({
	selectIndex: {
		default: 0,
	},
});

const state = reactive({
	data: ['1x1', '2x2', '3x3'],
	isActive: false,
	activeIndex: props.selectIndex
});

const selectionItems = computed(() => {
	return state.data.filter((item, index) => {
		return index !== state.activeIndex;
	});
});



onBeforeMount(() => {
	window.addEventListener('click', close);
});

onBeforeUnmount(() => {
	window.removeEventListener('click', close);
});
function handleClick(event) {
	event.stopPropagation();
	state.isActive = !state.isActive;
};
function close() {
	state.isActive = false;
};


function switchSelection(text) {
	state.activeIndex = state.data.indexOf(text);
	emit('setSelected', state.data[state.activeIndex]);
};
</script>


<style lang="scss" scoped>
.choice {
	position: relative;
	z-index: 11;

	.choiceBox {
		height: 40px;
		width: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(238, 238, 238, 1);
		font-size: 23px;
		cursor: pointer;
		transition: all 0.3s ease-in-out;

		&.active {
			background-color: rgb(194, 194, 194);
		}

		&:hover {
			background-color: rgb(194, 194, 194);
		}
	}

	.contentBox {
		position: absolute;
		width: 100px;
		background-color: rgba(238, 238, 238, 1);
		bottom: 100%;
		overflow: hidden;
		transition: all 0.3s;

		.ul {
			width: 100%;

			.li {
				list-style: none;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				font-size: 23px;
				cursor: pointer;
				transition: all 0.3s ease-in-out;
				box-shadow: 0px 1px 0px #ccc;

				&:hover {
					background-color: rgb(209, 209, 209);
				}
			}
		}
	}
}
</style>
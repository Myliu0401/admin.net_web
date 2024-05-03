<template>
	<div class="GTDetails">
		<div class="GTDetails_titleBox">
			<span class="title">GT 详情</span>
			<i class="closeIcon" @click.stop="close"></i>
		</div>

		<div class="GTDetails_buttonBox" @click="switchingTypes">
			<button class="button" :class="{ active: state.currentType === 'GTDDetailsList' }"
				data-type="GTDDetailsList">设备详情</button>
			<button class="button" :class="{ active: state.currentType === 'GTDLatestPictures' }"
				data-type="GTDLatestPictures">最新图片</button>
			<button class="button" :class="{ active: state.currentType === 'GTDLatestVideo' }"
				data-type="GTDLatestVideo">最新视频</button>
		</div>

		<GTDDetailsList v-if="state.currentType === 'GTDDetailsList'" :polesDevices="state.polesDevices"/>
	    <GTDLatestPictures v-else-if="state.currentType === 'GTDLatestPictures'" :polesDevices="state.polesDevices"/>
	    <GTDLatestVideo v-else-if="state.currentType === 'GTDLatestVideo'" ref="" :polesDevices="state.polesDevices"/>
	</div>
</template>



<script setup>
import { reactive, defineEmits, defineProps, onBeforeMount  } from 'vue';
import { getDeviceList } from '/@/api/deviceManagement/index.js';
import GTDDetailsList from './GTDDetailsList.vue';
import GTDLatestPictures from './GTDLatestPictures.vue';
import GTDLatestVideo from './GTDLatestVideo.vue';

const emit = defineEmits(['closeGTD']);

const props = defineProps({
	currentGTDid: {
		default: null
	}
});

const state = reactive({
	currentType: 'GTDDetailsList', // 当前类型
	polesDevices: [], // 指定塔杆下的所有设备
});

onBeforeMount(()=>{
	getTowerPoles();
});


// 切换类型 
function switchingTypes(e) {
	const type = e.target.dataset.type;
	if (type === state.currentType) {
		return;
	}
	state.currentType = type;

};


// 获取指定塔杆下的所有设备
async function getTowerPoles(){
    const res = await getDeviceList({
		page: 1,
		pageSize: 10000,
		treeNode: {
			id: props.currentGTDid,
			type: 3
		}
	});

	state.polesDevices = res.data.result.items;
};



// 关闭弹窗
function close(){
	emit('closeGTD');

};

</script>

<style scoped lang="scss">
.GTDetails {
	width: 100%;
	height: 100%;
	background-repeat: no-repeat;
	background-image: url(../../../assets/img/GTback.png);
	background-size: 100% 100%;
	padding-top: 9px;
	position: absolute;
    top: -6px;
    z-index: 11;
    height: 102%;
    left: 0px;

	.GTDetails_titleBox {
		width: 100%;
		height: 40px;
		background: linear-gradient(270deg,
				rgba(99, 235, 255, 0) 0%,
				rgba(99, 235, 233, 0.5) 34.74%,
				rgba(14, 179, 255, 0.5) 68.86%,
				rgba(27, 38, 174, 0) 100%);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;

		.title {
			color: rgba(255, 255, 255, 1);
			font-size: 14px;
		}

		.closeIcon {
			width: 30px;
			height: 30px;
			transition: all 0.4s;
			cursor: pointer;
			position: absolute;
			right: 4%;
			top: 50%;
			transform: translateY(-50%) rotate(0deg);
			transform-origin: center center;

			&:hover {
				transform: translateY(-50%) rotate(270deg);
			}

			&::after {
				content: '';
				position: absolute;
				width: 17px;
				height: 2px;
				background-color: #04a6a5;
				top: 50%;
				left: 5px;
				transform: rotate(45deg);
			}

			&::before {
				content: '';
				position: absolute;
				width: 17px;
				height: 2px;
				background-color: #04a6a5;
				top: 50%;
				left: 5px;
				transform: rotate(-45deg);
			}
		}
	}

	.GTDetails_buttonBox {
		display: flex;
		align-items: center;
		position: relative;
		justify-content: flex-end;
		padding-right: 10%;

		.button {
			outline: none;
			height: 30px;
			border: none;
			width: 120px;
			background-color: rgba(24, 57, 190, 0.5);
			color: #fff;
			cursor: pointer;
			font-size: 12px;
			transition: all 0.4s;

			&.active {
				background-color: rgba(44, 107, 255, 1);
				border: 1px solid rgba(99, 235, 233, 0.5);
			}

			&:hover:not(.active) {
				background-color: rgba(44, 107, 255, 1);
			}
		}
	}

	

	
}
</style>

<style lang="scss">
.GTDetails {
	.GTDetails_selectDevice {
		.dropDownList {
			margin-left: 15px;

			.dropDownList_Box {
				//background-color: transparent;
				height: 29px;
				border-radius: 6px;
				font-size: 13px;

				.triangle {
					border-left: 6px solid transparent;
					border-right: 6px solid transparent;
					border-bottom: 7px solid #72d3d2;
				}
			}

			.tabulation {
				//background-color: transparent;
			}
		}
	}
}
</style>
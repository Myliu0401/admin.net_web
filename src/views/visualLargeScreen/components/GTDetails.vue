<template>
	<div class="GTDetails">
		<div class="GTDetails_titleBox">
			<span class="title">GT 详情</span>
			<i class="closeIcon" @click.stop="close"></i>
		</div>

		<div class="GTDetails_buttonBox" @click="switchingTypes">
			<button class="button" :class="{ active: state.currentType === 'deviceDetails' }"
				data-type="deviceDetails">设备详情</button>
			<button class="button" :class="{ active: state.currentType === 'latestPictures' }"
				data-type="latestPictures">最新图片</button>
			<button class="button" :class="{ active: state.currentType === 'latestVideo' }"
				data-type="latestVideo">最新视频</button>
		</div>

		<div class="GTDetails_selectDevice">
			<span class="title">请选择设备: </span>
			<DropDownList prompt="请选择id" />
		</div>

		<div class="GTDetails_content">
			<ul class="content_ul">
				<li class="ul_li">
					<p class="left">MEID/IMEI</p>
					<p class="right">86728005238357700</p>
				</li>
				<li class="ul_li">
					<p class="left">电话号码</p>
					<p class="right">1441272207747</p>
				</li>
				<li class="ul_li">
					<p class="left">装置类型</p>
					<p class="right">主机</p>
				</li>
				<li class="ul_li">
					<p class="left">镜头类型</p>
					<p class="right">暂无信息</p>
				</li>
				<li class="ul_li">
					<p class="left">装置型号</p>
					<p class="right">SCHY</p>
				</li>
				<li class="ul_li">
					<p class="left">安装日期</p>
					<p class="right">2023-06-20</p>
				</li>
				<li class="ul_li">
					<p class="left">最后上传时间</p>
					<p class="right">2023-09-01</p>
				</li>
				<li class="ul_li">
					<p class="left">网络类型</p>
					<p class="right">移动</p>
				</li>
				<li class="ul_li">
					<p class="left">运行状态</p>
					<p class="right">启用</p>
				</li>
				<li class="ul_li">
					<p class="left">生产厂家</p>
					<p class="right">SCHY</p>
				</li>
			</ul>
		</div>
	</div>
</template>



<script setup>
import DropDownList from './DropDownList.vue';
import { reactive, defineEmits } from 'vue';
const emit = defineEmits(['closeGTD']);

const state = reactive({
	currentType: 'deviceDetails'
});

// 切换类型 
function switchingTypes(e) {
	const type = e.target.dataset.type;
	if (type === state.currentType) {
		return;
	}
	state.currentType = type;
};


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
    top: 0px;
    z-index: 11;
    height: 100%;
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
		width: 95%;
		margin: 0 auto;
		height: calc(100% - 135px);
		border: 1px solid #04a6a5;
		margin-top: 10px;

		.content_ul {
			width: 100%;
			height: 100%;

			.ul_li {
				width: 100%;
				height: calc(100% / 10);
				list-style: none;
				border-bottom: 1px solid #04a6a5;
				display: flex;
				align-items: center;

				&:last-child {
					border-bottom: none;
				}

				p {
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #05cfcf;
					font-size: 13px;
				}

				.left {
					width: 40%;
					border-right: 1px solid #04a6a5;
				}

				.right {
					width: 60%;
				}
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
				background-color: transparent;
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
				background-color: transparent;
			}
		}
	}
}
</style>
<template>
    <div class="GTDDetailsList">
        <div class="GTDetails_selectDevice">
			<span class="title">请选择设备: </span>
			<DropDownList prompt="请选择设备" :lists="polesDevices" @setSelected="setSelected" :activeTitle="state.devicesName"/>
		</div>

		<div class="GTDetails_content">
			<ul class="content_ul">
				<li class="ul_li">
					<p class="left">设备id</p>
					<p class="right">{{ state.currentDevice.id }}</p>
				</li>
				<li class="ul_li">
					<p class="left">设备名称</p>
					<p class="right">{{ state.currentDevice.name }}</p>
				</li>
				<li class="ul_li">
					<p class="left">创建人名称</p>
					<p class="right">{{ state.currentDevice.createUserName }}</p>
				</li>
				<li class="ul_li">
					<p class="left">镜头类型</p>
					<p class="right">{{ state.currentDevice.lensType }}</p>
				</li>
				<li class="ul_li">
					<p class="left">装置型号</p>
					<p class="right">{{ state.currentDevice.model }}</p>
				</li>
				<li class="ul_li">
					<p class="left">安装日期</p>
					<p class="right">{{  state.currentDevice.installDate }}</p>
				</li>
				<li class="ul_li">
					<p class="left">最后上传时间</p>
					<p class="right"></p>
				</li>
				<li class="ul_li">
					<p class="left">网络类型</p>
					<p class="right">{{ state.currentDevice.networkType }}</p>
				</li>
				<li class="ul_li">
					<p class="left">运行状态</p>
					<p class="right">{{ state.currentDevice.onOffStatus == 1 ? '在线' : state.currentDevice.onOffStatus == 2 ? '离线' : '' }}</p>
				</li>
				<li class="ul_li">
					<p class="left">生产厂家</p>
					<p class="right">{{ state.currentDevice.manufacturer }}</p>
				</li>
			</ul>
		</div>
    </div>
</template>



<script setup>
import DropDownList from './DropDownList.vue';
import { reactive, defineEmits, defineProps, onBeforeMount  } from 'vue';

const props = defineProps({
    polesDevices: {  // 塔杆下的所有设备
        default(){ 
            return []
        }
    }
});


const state = reactive({
    devicesName: '', // 选择设备名称
    currentDevice: {}, // 当前设备详情
});

// 修改选中设备
function setSelected(name){
    state.devicesName = name;
    const item = correspondingDevice(name);
	state.currentDevice = item;

};

// 过滤获取到对应设备
function correspondingDevice(name){
    for(let i = 0; i < props.polesDevices.length; i++){
		const item = props.polesDevices[i];
         if(item.name === name){
               return item;
		 }
	}
};


</script>

<style lang="scss" scoped>
.GTDDetailsList{
    height: 80%;
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
		height: calc(100% - 65px);
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
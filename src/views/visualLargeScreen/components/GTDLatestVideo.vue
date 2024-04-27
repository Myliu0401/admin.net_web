<template>
	<div class="GTDLatestVideo">
		<div class="selectBox">
			<div class="GTDetails_selectDevice">
				<span class="title">设备: </span>
				<DropDownList prompt="请选择设备" :lists="polesDevices" @setSelected="setSelectedDevice" :activeTitle="state.devicesName" />
			</div>

			<div class="GTDetails_selectDevice">
				<span class="title">通道: </span>
				<DropDownList prompt="请选择通道" :lists="state.passDatas[state.deviceId]" :loading="state.loading" @setSelected="setSelectedPass" :activeTitle="state.passName" />
			</div>
		</div>

        
	</div>
</template>


<script setup>
import DropDownList from './DropDownList.vue';
import { reactive, defineEmits, defineProps, onBeforeMount } from 'vue';
import { getMyChannelList } from '/@/api/deviceManagement/index.js';


const props = defineProps({
	polesDevices: {
		default() {
			return [];
		},
	},
});

const state = reactive({
	devicesName: '', // 设备名称
    deviceId: '', // 设备id
	passName: '', // 通道名称
    loading: false, // 是否加载中
    passDatas: {}
});

async function setSelectedDevice(name) {
    const item = correspondingDevice(name);
    state.devicesName = name;
    state.deviceId =  item.id;
    if(state[item.id]){
        return
    };

    state.loading = true;

    const channes = await getMyChannelList({
        page: 1,
        pageSize: 10000,
        id: item.id
    });

    state.loading = false;

    console.log(channes.data.result)

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

// 选中对应的通道
function setSelectedPass(name) {
    state.passName = name;
};
</script>


<style lang="scss" scoped>
.GTDLatestVideo {
	width: 100%;
	height: 100%;

    .selectBox{
        display: flex;
        align-items: center;
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
}
</style>
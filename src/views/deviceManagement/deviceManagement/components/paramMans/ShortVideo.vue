<template>
	<div class="ShortVideo">
		<div class="itemOption">
			<span class="title">设备通道</span>
			<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px; margin-right: 15px;" @change="change">
				<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>

            <span class="title">类型</span>
			<el-select v-model="state.type" placeholder="请选择" style="width: 150px; margin-right: 15px" @change="change">
				<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>

            <span class="title">拍摄时长:秒</span>
            <el-input v-model="state.duration" style="width: 100px; margin-right: 15px;" placeholder="单位：秒" />
            <el-button type="primary" :loading="state.loading" @click="myTakeShortVideo">搜索</el-button>
		</div>

        <div style="margin-top: 20px; height: 50vh;" v-loading="state.loading">
             <video controls style="width: 100%; height: 100%;" v-if="state.src"></video>
        </div>
		
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, takeShortVideo } from '/@/api/allocation/index.js';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			channelId: '',
            streamType: '',
            duration: '',
			loading: false,
            src: '',
            lists: []
		});

		const channels = ref([]);
        const types = ref([{
            id: 0,
            name: 'Main',
        },{
            id: 1,
            name: 'Second'
        },{
            id: 2,
            name: 'Third'
        }]);

		onBeforeMount(() => {
			myGetChannelList();
		});

		// 获取设备通道列表
		async function myGetChannelList() {
			const res = await getChannelList({
				page: 1,
				pageSize: 100000,
				id: props.deviceID,
			});
			channels.value = res.data.result;
		
			
		};

        // 获取拍摄视频
        async function myTakeShortVideo(){
            state.loading = true;
            const res = await takeShortVideo({
                channelId: state.channelId,
                streamType: state.type,
                duration: state.duration
            });
            state.loading = false;
            state.src = res.data.result;
        };



		return { state, channels, types, myTakeShortVideo };
	},
};
</script>


<style lang="scss" scoped>
.ShortVideo {
	.itemOption {
		.title {
			font-size: 13px;
			margin-right: 10px;
		}
	}
}
</style>
<template>
	<div class="photographySchedule">
		<div class="itemOption">
			<span class="title">设备通道</span>
			<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px" @change="change">
				<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</div>

		<el-table :data="state.lists" v-loading="state.loading" border style="width: 100%; margin-top: 15px;" max-height="50vh">
			<el-table-column prop="hour" label="时"  align="center"/>
			<el-table-column prop="minute" label="分"   align="center"/>
			<el-table-column prop="preset" label="预置位号"  align="center"/>
		</el-table>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, getPhotographySchedule } from '/@/api/allocation/index.js';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			channelId: '',
			loading: false,
            lists: []
		});

		const channels = ref([]);

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
			state.channelId = res.data.result[0].id;
			myGetPhotographySchedule();
		}

		// 切换通道
		function change(id) {
            myGetPhotographySchedule();
        };

		// 获取拍照时间表
		async function myGetPhotographySchedule() {
			state.loading = true;
			const res = await getPhotographySchedule({ channelId: state.channelId });
			state.loading = false;
            state.lists = res.data.result.photos;
			
		}

		return { state, channels, change };
	},
};
</script>


<style lang="scss" scoped>
.photographySchedule {
	.itemOption {
		.title {
			font-size: 13px;
			margin-right: 10px;
		}
	}
}
</style>
<template>
	<div class="KeyframesAndRestarts">
		<div class="item">
			<span class="title">重启设备</span>
			<div style="display: flex">
				<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myRebootDevice">重启</el-button>
			</div>
		</div>

		<div class="item">
			<span class="title">强制关键帧</span>
			<div class="itemBox" style="width: 100%; justify-content: center">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px; margin-right: 20px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div style="display: flex">
				<el-button type="primary" :loading="state.loading1" style="margin-top: 10px" @click="myForceKeyframes">强制关键帧</el-button>
			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, rebootDevice, forceKeyframes } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
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
			loading1: false,
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
		}

		// 重启
		async function myRebootDevice() {
			await ElMessageBox.confirm('是否确定重启设备', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});

			state.loading = true;
			await rebootDevice({ deviceId: props.deviceID });
			state.loading = false;

			ElMessage({
				message: '重启成功',
				type: 'success',
			});
		}

		// 强制关键帧
		async function myForceKeyframes() {
			if (!state.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state.loading1 = true;
			const res = await forceKeyframes({
				channelId: state.channelId,
			});
			state.loading1 = false;
			ElMessage({
				message: '成功',
				type: 'success',
			});
		}

		return { state, channels, myRebootDevice, myForceKeyframes };
	},
};
</script>


<style lang="scss" scoped>
.KeyframesAndRestarts {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	.item {
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&:nth-child(1) {
			border-right: 1px solid #ccc;
		}

		&:nth-child(2) {
		}

		&:nth-child(3) {
			border-top: 1px solid #ccc;
			border-right: 1px solid #ccc;
		}

		&:nth-child(4) {
			border-top: 1px solid #ccc;
		}

		.title {
			font-size: 17px;
		}

		.itemBox {
			display: flex;
			align-items: center;
			margin-top: 10px;
			.itemBox_title {
				font-size: 12px;
				white-space: pre;
				margin-right: 15px;
			}
		}
	}
}
</style>
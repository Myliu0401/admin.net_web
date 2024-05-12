<template>
	<div class="DeviceConfig">
		<div class="item">
			<span class="title">查询装置配置</span>
			<div class="itemBox">
				<span class="itemBox_title">文件传输功能</span>
				<el-switch v-model="state.fileTransfer" size="small" active-text="开启" inactive-text="关闭" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">图像监测功能</span>
				<el-switch v-model="state.imageMonitoring" size="small" active-text="开启" inactive-text="关闭" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">视频监测功能</span>
				<el-switch v-model="state.videoMonitoring" size="small" active-text="开启" inactive-text="关闭" />
			</div>
			<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myQueryDeviceConfig">查询</el-button>
		</div>

		<div class="item">
			<span class="title">设置装置配置</span>
			<div class="itemBox">
				<span class="itemBox_title">文件传输功能</span>
				<el-switch v-model="state1.fileTransfer" size="small" active-text="开启" inactive-text="关闭" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">图像监测功能</span>
				<el-switch v-model="state1.imageMonitoring" size="small" active-text="开启" inactive-text="关闭" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">视频监测功能</span>
				<el-switch v-model="state1.videoMonitoring" size="small" active-text="开启" inactive-text="关闭" />
			</div>
			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px" @click="mySetDeviceConfig">设置</el-button>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { queryDeviceConfig, setDeviceConfig } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			fileTransfer: false,
			imageMonitoring: false,
			videoMonitoring: false,
			loading: false,
		});

		const state1 = reactive({
			fileTransfer: false,
			imageMonitoring: false,
			videoMonitoring: false,
			loading: false,
		});

		// 查询
		async function myQueryDeviceConfig() {
			state.loading = true;
			const res = await queryMainSiteInfo({ deviceId: props.deviceID });
			state.loading = false;
            state.fileTransfer = res.data.result.fileTransfer;
            state.imageMonitoring = res.data.result.imageMonitoring;
            state.videoMonitoring = res.data.result.videoMonitoring;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}

		// 设置
		async function mySetDeviceConfig() {
			state1.loading = true;
			const res = await setMasterStationInfo({ deviceId: props.deviceID, fileTransfer: state1.fileTransfer, imageMonitoring: state1.imageMonitoring, videoMonitoring: state1.videoMonitoring });
			state1.loading = false;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}

		return {
			state,
			state1,
			myQueryDeviceConfig,
			mySetDeviceConfig,
		};
	},
};
</script>


<style lang="scss" scoped>
.DeviceConfig {
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
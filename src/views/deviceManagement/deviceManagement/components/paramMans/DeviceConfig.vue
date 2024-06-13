<template>
	<div class="DeviceConfig">
		<el-radio-group v-model="data.type" class="ml-4">
			<el-radio value="1" size="small">查询装置配置</el-radio>
			<el-radio value="2" size="small">设置装置配置</el-radio>
			<el-radio value="3" size="small">主站下发参数</el-radio>
		</el-radio-group>

		<div v-if="data.type == '1'" class="item">
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
			<div class="itemBox">
				<span class="itemBox_title">心跳间隔</span>
				<el-text class="mx-1" size="small" style="width: 120px;">{{ state.keepAliveInterval }}</el-text>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">采集间隔</span>
				<el-text class="mx-1" size="small" style="width: 120px;">{{ state.collectionInterval }}</el-text>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">休眠时长</span>
				<el-text class="mx-1" size="small" style="width: 120px;">{{ state.sleepDuration }}</el-text>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">在线时长</span>
				<el-text class="mx-1" size="small" style="width: 120px;">{{ state.onlineDuration }}</el-text>
			</div>
			<el-button type="primary" :loading="state.loading" style="margin-top: 10px"
				@click="myQueryDeviceConfig">查询</el-button>
		</div>

		<div v-else-if="data.type == '2'" class="item">
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
			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px"
				@click="mySetDeviceConfig">设置</el-button>
		</div>

		<div v-else-if="data.type == '3'" class="item">
			<span class="title">主站下发参数配置</span>
			<div class="itemBox">
				<span class="itemBox_title">心跳间隔</span>
				<el-input v-model="state2.keepAliveInterval" placeholder="分钟" type="number" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">采集间隔</span>
				<el-input v-model="state2.collectionInterval" placeholder="分钟" type="number" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">休眠时长</span>
				<el-input v-model="state2.sleepDuration" placeholder="分钟" type="number" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">在线时长</span>
				<el-input v-model="state2.onlineDuration" placeholder="分钟" type="number" />
			</div>
			<span class="itemBox_title" style="margin-top: 20px;">硬件重启时间点</span>
			<div class="itemBox">
				<span class="itemBox_title">天</span>
				<el-input v-model="state2.day" placeholder="0到28日；（若日为0则每天定时重启）" type="number" :max="28" :min="0"
					style="width: 140px;" />
			</div>
			<p style="font-size: 12px; color: rgb(135 135 135);">0到28日；（若日为0则每天定时重启）</p>
			<div class="itemBox">
				<span class="itemBox_title">时</span>
				<el-input v-model="state2.hour" placeholder="时" type="number" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">分</span>
				<el-input v-model="state2.minute" placeholder="分钟" type="number" />
			</div>
			<el-button type="primary" :loading="state2.loading" style="margin-top: 10px"
				@click="myMainStationIssues">下发</el-button>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { queryDeviceConfig, setDeviceConfig, mainStationIssues } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {

		const data = reactive({
			type: '1'
		});

		const state = reactive({
			fileTransfer: false,
			imageMonitoring: false,
			videoMonitoring: false,
			keepAliveInterval: '',
			collectionInterval: '',
			sleepDuration: '',
			onlineDuration: '',
			loading: false,
		});

		const state1 = reactive({
			fileTransfer: false,
			imageMonitoring: false,
			videoMonitoring: false,
			loading: false,
		});

		const state2 = reactive({
			keepAliveInterval: '',
			collectionInterval: '',
			sleepDuration: '',
			onlineDuration: '',
			day: '',
			hour: '',
			minute: '',
			loading: false,
		});

		// 查询
		async function myQueryDeviceConfig() {
			state.loading = true;
			let res = null;
			try {
				res = await queryDeviceConfig({ deviceId: props.deviceID });
			} catch (err) {
				state.loading = false;
				return
			}

			state.loading = false;
			state.fileTransfer = res.data.result.fileTransfer;
			state.imageMonitoring = res.data.result.imageMonitoring;
			state.videoMonitoring = res.data.result.videoMonitoring;
			state.keepAliveInterval = res.data.result.keepAliveInterval;
			state.collectionInterval = res.data.result.collectionInterval;
			state.sleepDuration = res.data.result.sleepDuration;
			state.onlineDuration = res.data.result.onlineDuration;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}

		// 设置
		async function mySetDeviceConfig() {
			state1.loading = true;
			try {
				const res = await setDeviceConfig({
					deviceId: props.deviceID,
					fileTransfer: state1.fileTransfer,
					imageMonitoring: state1.imageMonitoring,
					videoMonitoring: state1.videoMonitoring
				});
			} catch (err) {
				state1.loading = false;
				return
			}

			state1.loading = false;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}


		// 下发
		async function myMainStationIssues() {
			state2.loading = true;
			try {
				const res = await mainStationIssues({
					deviceId: props.deviceID,
					keepAliveInterval: state2.keepAliveInterval,
					collectionInterval: state2.collectionInterval,
					sleepDuration: state2.sleepDuration,
					onlineDuration: state2.onlineDuration,
					hardwareRestart: {
						day: state2.day,
						hour: state2.hour,
						minute: state2.minute
					}
				});
			} catch (err) {
				state2.loading = false;
				return
			}

			state2.loading = false;
			ElMessage({
				message: '下发成功',
				type: 'success',
			});
		};

		return {
			data,
			state,
			state1,
			state2,
			myQueryDeviceConfig,
			mySetDeviceConfig,
			myMainStationIssues
		};
	},
};
</script>


<style lang="scss" scoped>
.DeviceConfig {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;

	.item {
		width: 100%;
		margin-top: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-height: 60vh;
		overflow: auto;

		&:nth-child(1) {
			border-right: 1px solid #ccc;
		}

		&:nth-child(2) {}

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
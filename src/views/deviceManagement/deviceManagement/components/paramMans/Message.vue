<template>
	<div class="Message">
		<div class="item">
			<span class="title">唤醒短信</span>
			<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myWakeUpSMS">唤醒</el-button>
		</div>

		<div class="item">
			<span class="title">发送短信</span>
			<div class="itemBox">
				<span class="itemBox_title">发送信息</span>
				<el-input v-model="state1.phone" placeholder="短信内容" />
			</div>
			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px" @click="mySendSMS">发送</el-button>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { wakeUpSMS, sendSMS } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			IPAddress: '',
			portNumber: '',
			cardNumber: '',
			loading: false,
		});

		const state1 = reactive({
			phone: '',
			loading: false,
		});

		// 查询
		async function myWakeUpSMS() {
			state.loading = true;
			const res = await queryMainSiteInfo({ deviceId: props.deviceID });
			state.loading = false;
			ElMessage({
				message: '唤醒成功',
				type: 'success',
			});
		}

		// 设置
		async function mySendSMS() {
			state1.loading = true;
			const res = await setMasterStationInfo({ deviceId: props.deviceID, phone: state1.phone });
			state1.loading = false;
			ElMessage({
				message: '发送成功',
				type: 'success',
			});
		}

		return {
			state,
			state1,
			myWakeUpSMS,
			mySendSMS,
		};
	},
};
</script>


<style lang="scss" scoped>
.Message {
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
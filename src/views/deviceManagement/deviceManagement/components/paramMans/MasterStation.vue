<template>
	<div class="MasterStation">
		<div class="item">
			<span class="title">查询主站信息</span>
			<div class="itemBox">
				<span class="itemBox_title">IP地址</span>
				<el-input v-model="state.IPAddress" placeholder="IP地址" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">端口号</span>
				<el-input v-model="state.portNumber" placeholder="端口号" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">卡 号</span>
				<el-input v-model="state.cardNumber" placeholder="卡号" />
			</div>
			<div>
				<el-button type="primary" :loading="state.loading" style="margin-top: 10px"
					@click="myQueryMainSiteInfo">查询</el-button>
				<el-button type="primary" :loading="state1.loading" style="margin-top: 10px"
					@click="mySetMasterStationInfo">设置</el-button>
			</div>

		</div>
		<!-- <div class="item">
			<span class="title">设置主站信息</span>
			<div class="itemBox">
				<span class="itemBox_title">IP地址</span>
				<el-input v-model="state1.IPAddress" placeholder="IP地址" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">端口号</span>
				<el-input v-model="state1.portNumber" placeholder="端口号" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">卡号</span>
				<el-input v-model="state1.cardNumber" placeholder="卡号" />
			</div>
			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px" @click="mySetMasterStationInfo">设置</el-button>
		</div> -->
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { queryMainSiteInfo, setMasterStationInfo } from '/@/api/allocation/index.js';
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
			IPAddress: '',
			portNumber: '',
			cardNumber: '',
			loading: false,
		});

		// 查询
		async function myQueryMainSiteInfo() {
			state.loading = true;
			let res = null;
			try {
				res = await queryMainSiteInfo({ deviceId: props.deviceID });
			} catch (err) {
				state.loading = false;
				return
			}
			state.loading = false;
			state.IPAddress = res.data.result.ip;
			state.portNumber = res.data.result.port;
			state.cardNumber = res.data.result.phone;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}

		// 设置
		async function mySetMasterStationInfo() {
			if (validate()) {
				return
			}
			state1.loading = true;
			try {
				const res = await setMasterStationInfo({
					deviceId: props.deviceID,
					ip: state.IPAddress,
					port: state.portNumber,
					phone: state.cardNumber
				});
			} catch (err) {
				state1.loading = false;
				return
			}

			state1.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		};

		function validate() {
			let tips = null;
			if (!state.IPAddress) {
				tips = '请输入ip地址';
			} else if (!state.portNumber) {
				tips = '请输入端口号';
			} else if (!state.cardNumber) {
				tips = '请输入卡号';
			};

			tips && ElMessage({
				message: tips,
				type: 'warning',
			});

			return tips;
		}

		return {
			state,
			state1,
			myQueryMainSiteInfo,
			mySetMasterStationInfo,
		};
	},
};
</script>


<style lang="scss" scoped>
.MasterStation {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;

	.item {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

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
				width: 60px;
			}
		}
	}
}
</style>
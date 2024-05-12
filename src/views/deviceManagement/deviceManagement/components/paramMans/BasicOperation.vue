<template>
	<div class="basicOperation">
		<div class="item">
			<span class="title">装置时间</span>
			<div class="itemBox">
				<span class="itemBox_title">装置时间</span>
				<el-input v-model="state.deviceTime" placeholder="装置时间" />
			</div>
			<el-button type="primary" :loading="state.deviceTimeLoading" style="margin-top: 10px" @click="myQueryDeviceTime">查询</el-button>
		</div>
		<div class="item">
			<span class="title">装置重启</span>	
			<div style="display: flex">
				<el-button type="primary" :loading="state.deviceMEIDLoading1" style="margin-top: 10px; margin-right: 7px" @click="myDeviceRestart">重启</el-button>
			</div>
		</div>

		<div class="item">
			
		    <span class="title">装置密码</span>
			<div class="itemBox">
				<span class="itemBox_title">旧装置密码</span>
				<el-input v-model="state.devicePassword1" placeholder="装置时间" />
			</div>
            <div class="itemBox">
				<span class="itemBox_title">新装置密码</span>
				<el-input v-model="state.devicePassword2" placeholder="装置时间" />
			</div>
			<el-button type="primary" :loading="state.deviceLoading" style="margin-top: 10px" @click="mySetDevicePassword">设置</el-button>
        </div>
		
		<div class="item">
            <span class="title">短信指令</span>
			<div class="itemBox">
				<span class="itemBox_title">短信指令</span>
				<el-input v-model="state.message" placeholder="新MEID" />
			</div>
            <el-button type="primary" :loading="state.messageLoading" style="margin-top: 10px; margin-right: 7px" @click="mySendSMS">发送</el-button>
        </div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { queryDeviceTime, deviceRestart, sendSMS, setDevicePassword } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {

    props: {
        deviceID: {
            default: ''
        }
    },

	setup(props, { emit }) {
		const state = reactive({
			deviceTime: '', // 装置时间
			deviceTimeLoading: false,

			deviceMEID1: '',
			deviceMEID2: '',
			deviceMEIDLoading1: false,
			deviceMEIDLoading2: false,

			deviceMode: '',
            deviceModeLoading: false,

            devicePassword1: '',
            devicePassword2: '',
            deviceLoading: false,

            message: '',
            messageLoading: false
		});

		const modes = reactive([
			{
				value: 'Option3',
				label: 'Option3',
			},
		]);

        // 查询装置时间
        async function myQueryDeviceTime(){
            state.deviceTimeLoading = true;
            const res = await queryDeviceTime({ deviceId: props.deviceID });
            state.deviceTimeLoading = false;
			state.deviceTime = res.data.result;
            ElMessage({
				message: '查询成功',
				type: 'success',
			});
        };

        // 装置重启
        async function myDeviceRestart(){
            state.deviceMEIDLoading1 = true;
            const res = await deviceRestart({ deviceId: props.deviceID });
            state.deviceMEIDLoading1 = false;
            ElMessage({
				message: '重启成功',
				type: 'success',
			});
        };


        // 发送短信
        async function mySendSMS(){
            state.messageLoading = true;
            const res = await sendSMS({ deviceId: props.deviceID,  phone: state.message });
            state.messageLoading = false;
            ElMessage({
				message: '发送成功',
				type: 'success',
			});
        };


        // 设置装置密码
        async function mySetDevicePassword(){
            state.deviceLoading = true;
            const res = await sendSMS({ deviceId: props.deviceID, oldPassword: state.devicePassword1, newPassword: state.devicePassword2 });
            state.deviceLoading = false;
            ElMessage({
				message: '设置成功',
				type: 'success',
			});
        }

		return { state, modes, myQueryDeviceTime, myDeviceRestart, mySendSMS, mySetDevicePassword };
	},
};
</script>


<style lang="scss" scoped>
.basicOperation {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	.item {
		width: 50%;
		height: 50%;
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
<template>
	<div class="MainStationIssuesPara">
		<div class="item">
			<span class="title">主站下发参数配置</span>
			<div class="itemBox">
				<span class="itemBox_title">心跳间隔</span>
				<el-input v-model="state.keepAliveInterval" placeholder="分钟" type="number"/>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">采集间隔</span>
				<el-input v-model="state.collectionInterval" placeholder="分钟" type="number"/>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">休眠时长</span>
				<el-input v-model="state.sleepDuration" placeholder="分钟" type="number"/>
			</div>
            <div class="itemBox">
				<span class="itemBox_title">在线时长</span>
				<el-input v-model="state.onlineDuration" placeholder="分钟" type="number"/>
			</div>
            <span class="itemBox_title" style="margin-top: 20px;">硬件重启时间点</span>
            <div class="itemBox">
                <span class="itemBox_title">天</span>
				<el-input v-model="state.day" placeholder="0到28日；（若日为0则每天定时重启）" type="number" :max="28" :min="0"/>
            </div>
            <p style="font-size: 12px; color: rgb(135 135 135);">0到28日；（若日为0则每天定时重启）</p>
            <div class="itemBox">
                <span class="itemBox_title">时</span>
				<el-input v-model="state.hour" placeholder="时" type="number"/>
			</div>
            <div class="itemBox">
                <span class="itemBox_title">分</span>
				<el-input v-model="state.minute" placeholder="分钟" type="number"/>
			</div>
			<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myMainStationIssues">下发</el-button>
		</div>
		
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { mainStationIssues } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			keepAliveInterval: '',
			collectionInterval: '',
			sleepDuration: '',
            onlineDuration: '',
            day: '',
            hour: '',
            minute: '',
			loading: false,
		});

		

		
		async function myMainStationIssues() {
			state.loading = true;
			const res = await mainStationIssues({ deviceId: props.deviceID, keepAliveInterval: state.keepAliveInterval,
                collectionInterval: state.collectionInterval,
                sleepDuration: state.sleepDuration,
                onlineDuration: state.onlineDuration,
                hardwareRestart: {
                    day: state.day,
                    hour: state.hour,
                    minute: state.minute
                }
            });
			state.loading = false;
			ElMessage({
				message: '下发成功',
				type: 'success',
			});
		};




		

		return {
			state,
			
			myMainStationIssues,
		
		};
	},
};
</script>


<style lang="scss" scoped>
.MainStationIssuesPara {
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
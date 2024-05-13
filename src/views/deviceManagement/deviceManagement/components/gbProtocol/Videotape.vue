<template>
	<div class="Videotape">
		<div class="item">
			<div class="itemBox" style="width: 100%; justify-content: center">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px; margin-right: 20px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox" style="width: 100%; justify-content: center">
				<span class="itemBox_title">录像计时</span>
				<el-text class="mx-1" size="small" style="width: 170px">{{ state.formattedTime }}</el-text>
			</div>
			<div style="display: flex">
				<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="state.isRecorded ? myEndRecording() : myStartRecording()">{{
					state.isRecorded ? '结束录像' : '开始录像'
				}}</el-button>
			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, startRecording, endRecording } from '/@/api/allocation/index.js';
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
			timerId: null, // 定时器id
            formattedTime: '00:00:00',
            isRecorded: false, // 是否录像中
		});

		const channels = ref([]);

		onBeforeMount(() => {
			myGetChannelList();
		});

        onBeforeUnmount(()=>{
            state.channelId && myEndRecording();
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


        // 开始计时器
		function startTimer() {
			var hours = 0,
				minutes = 0,
				seconds = 0;
			state.timerId = setInterval( ()=> {
				seconds++;
				if (seconds >= 60) {
					seconds = 0;
					minutes++;
					if (minutes >= 60) {
						minutes = 0;
						hours++;
					}
				}
				state.formattedTime = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
			
               
            }, 1000); // 每秒钟更新一次
			
		};


        // 结束计时器
        function endTimer(){
             clearInterval(state.timerId);
        };


        // 开始录像
        async function myStartRecording(){

            if (!state.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			};
            await ElMessageBox.confirm('是否确定开始录像', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
            state.loading = true;
            const res = await startRecording({ channelId: state.channelId });
            state.loading = false;
            ElMessage({
				message: '开始录像',
				type: 'success',
			});
            state.isRecorded = true;
            startTimer();
        };


        // 结束录像
        async function myEndRecording(){
            if (!state.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			};
            state.loading = true;
            const res = await endRecording({ channelId: state.channelId });
            state.loading = false;
            ElMessage({
				message: '结束录像',
				type: 'success',
			});
            state.isRecorded = false;
            state.formattedTime = '00:00:00';
            endTimer();
        };



		return { state, channels, myStartRecording, myEndRecording };
	},
};
</script>


<style lang="scss" scoped>
.Videotape {
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
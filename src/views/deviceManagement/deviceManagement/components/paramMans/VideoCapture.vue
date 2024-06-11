<template>
	<div class="VideoCapture">
		<div class="item">
			<span class="title">视频采集信息</span>
			<div class="itemBox">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">采集类型</span>
				<el-select v-model="state.type" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">帧率</span>
				<el-input v-model="state.frameRate" placeholder="帧率：1-30" type="number" :min="1" :max="30" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">I帧间隔</span>
				<el-input v-model="state.iFrameInterval" placeholder="I帧间隔：1-200" type="number" :min="1" :max="200" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">码率</span>
				<el-input v-model="state.bitRate" placeholder="码率：16-10000，单位：Kbps" type="number" :min="16" :max="10000" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">encoding</span>
				<el-radio-group v-model="state.encoding" class="ml-4">
					<el-radio value="0" size="small">H264</el-radio>
					<el-radio value="1" size="small">H265</el-radio>
				</el-radio-group>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">cbrVbr</span>
				<el-radio-group v-model="state.cbrVbr" class="ml-4">
					<el-radio value="0" size="small">Cbr</el-radio>
					<el-radio value="1" size="small">Vbr</el-radio>
				</el-radio-group>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">resolution</span>
				<el-radio-group v-model="state.resolution" class="ml-4">
					<el-radio value="4" size="small">R_800X600</el-radio>
					<el-radio value="5" size="small">R_1024X768</el-radio>
					<el-radio value="6" size="small">R_1280X1024</el-radio>
					<el-radio value="7" size="small">R_1280X720</el-radio>
					<el-radio value="8" size="small">R_1920X1080</el-radio>
				</el-radio-group>
			</div>
			<div style="display: flex">
				<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myVideoCapture">查询</el-button>
				<el-button type="primary" :loading="state.loading1" style="margin-top: 10px" @click="mySetVideoCapture">设置</el-button>
			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, videoCapture, setVideoCapture } from '/@/api/allocation/index.js';
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
			type: '',
			loading: false,
			frameRate: '',
			iFrameInterval: '',
			encoding: '',
			bitRate: '',
			cbrVbr: '',
			resolution: '',
			loading1: false,
		});

		const channels = ref([]);
		const types = ref([
			{
				id: 0,
				name: 'Main',
			},
			{
				id: 1,
				name: 'Second',
			},
			{
				id: 2,
				name: 'Third',
			},
		]);

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

		// 查询
		async function myVideoCapture() {
			
            if (!(state.channelId + '') || !(state.type + '')) {
				ElMessage({
					message: '必须选择通道和采集类型',
					type: 'warning',
				});
				return;
			}
			state.loading = true;
			const res = await videoCapture({
				channelId: state.channelId,
				streamType: state.type,
			});
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
			state.loading = false;
			const item = res.data.result;
			state.frameRate = item.frameRate;
			state.iFrameInterval = item.iFrameInterval;
			state.encoding = item.encoding + '';
			state.bitRate = item.bitRate;
			state.cbrVbr = item.cbrVbr + '';
			state.resolution = item.resolution + '';

			console.log(state)
		}

		// 设置
		async function mySetVideoCapture() {
			state.loading1 = true;
			const res = await setVideoCapture({
				channelId: state.channelId,
				streamType: state.type,
				frameRate: state.frameRate,
				iFrameInterval: state.iFrameInterval,
				encoding: state.encoding,
				bitRate: state.bitRate,
				cbrVbr: state.cbrVbr,
				resolution: state.resolution,
			});
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
			state.loading1 = false;
		}

		// 设置

		return {
			state,
			channels,
			types,
			myVideoCapture,
			mySetVideoCapture,
		};
	},
};
</script>


<style lang="scss" scoped>
.VideoCapture {
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
		align-items: baseline;
		justify-content: flex-start;

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
				min-width: 100px;
			}
		}
	}
}
</style>
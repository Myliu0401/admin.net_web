<template>
	<div class="VideoCapture">
		<div class="item">
			<span class="title" style="width: 100%; text-align: center">图像采集信息</span>
			<div class="itemBox">
				<span class="itemBox_title">channel1Config</span>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">色彩类型</span>
				<el-radio-group v-model="state.channel1Config.colorSelect" class="ml-4">
					<el-radio value="0" size="small">黑白</el-radio>
					<el-radio value="1" size="small">彩色</el-radio>
				</el-radio-group>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">分辨率</span>
				<!-- <el-radio-group v-model="state.channel1Config.imageSize" class="ml-4">
					<el-radio v-for="item in resolvingPower" :key="item.id" :value="item.id" size="small">{{ item.text }}</el-radio>
				</el-radio-group> -->
				<el-select v-model="state.channel1Config.imageSize" placeholder="请选择" style="width: 170px">
					<el-option v-for="item in resolvingPower" :key="item.id" :label="item.text" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">亮度</span>
				<el-slider v-model="state.channel1Config.brightness" style="width: 170px" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">对比度</span>
				<el-slider v-model="state.channel1Config.contrast" style="width: 170px" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">饱和度</span>
				<el-slider v-model="state.channel1Config.saturation" style="width: 170px" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">channel2Config</span>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">色彩类型</span>
				<el-radio-group v-model="state.channel2Config.colorSelect" class="ml-4">
					<el-radio value="0" size="small">黑白</el-radio>
					<el-radio value="1" size="small">彩色</el-radio>
				</el-radio-group>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">分辨率</span>
				<!-- <el-radio-group v-model="state.channel2Config.imageSize" class="ml-4">
					<el-radio v-for="item in resolvingPower" :key="item.id" :value="item.id" size="small">{{ item.text }}</el-radio>
				</el-radio-group> -->
				<el-select v-model="state.channel2Config.imageSize" placeholder="请选择" style="width: 170px">
					<el-option v-for="item in resolvingPower" :key="item.id" :label="item.text" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">亮度</span>
				<el-slider v-model="state.channel2Config.brightness" style="width: 170px" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">对比度</span>
				<el-slider v-model="state.channel2Config.contrast" style="width: 170px" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">饱和度</span>
				<el-slider v-model="state.channel2Config.saturation" style="width: 170px" />
			</div>
			<div style="display: flex; margin: 0 auto">
				<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="mySetImageCollectionParameter">设置</el-button>
			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { setImageCollectionParameter } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			loading: false,
			channel1Config: {
				colorSelect: '', // 色彩
				imageSize: '', // 分辨率
				brightness: 0, // 亮度
				contrast: 0, // 对比度
				saturation: 0, // 饱和度
			},
			channel2Config: {
				colorSelect: '', // 色彩
				imageSize: '', // 分辨率
				brightness: 0, // 亮度
				contrast: 0, // 对比度
				saturation: 0, // 饱和度
			},
		});

		const resolvingPower = ref([
			{
				text: '320 X 240 / R_320X240',
				id: 1,
			},
			{
				text: '640 X 480 / R_640X480',
				id: 2,
			},
			{
				text: '704 X 576 / R_704X576',
				id: 3,
			},
			{
				text: '800 X 600 / R_800X600',
				id: 4,
			},
			{
				text: '1024 X 768 / R_1024X768',
				id: 5,
			},
			{
				text: '1280 X 1024 / R_1280X1024',
				id: 6,
			},
			{
				text: '1280 X 720 / R_1280X720',
				id: 7,
			},
			{
				text: '1920 X 1080 / R_1920X1080',
				id: 8,
			},
			{
				text: '960H R_960X576',
				id: 9,
			},
			{
				text: '960P R_1280X960',
				id: 10,
			},
			{
				text: '1200P R_1600X1200',
				id: 11,
			},
			{
				text: 'QXGA R_2048X1536',
				id: 12,
			},
			{
				text: '400W R_2592X1520',
				id: 13,
			},
			{
				text: '500W R_2592X1944',
				id: 14,
			},
			{
				text: '600W R_3072X2048',
				id: 15,
			},
			{
				text: '800W(4K) R_3840X2160',
				id: 16,
			},
			{
				text: '1200W R_4000X3000',
				id: 17,
			},
			{
				text: '1600W R_4608X3456',
				id: 18,
			},
			{
				text: 'QUXGA R_3200X2400',
				id: 19,
			},
			{
				text: '4224 X 3136 / R_4224X3136',
				id: 20,
			},
		]);

		// 设置
		async function mySetImageCollectionParameter() {
			state.loading = true;
			await setImageCollectionParameter({
				deviceId: props.deviceID,
				channel1Config: {
					colorSelect: state.channel1Config.colorSelect === '' ? undefined : +state.channel1Config.colorSelect,
					imageSize: state.channel1Config.imageSize == '' ? undefined : +state.channel1Config.imageSize,
					brightness: state.channel1Config.brightness == '' ? undefined : +state.channel1Config.brightness,
					contrast: state.channel1Config.contrast == '' ? undefined : +state.channel1Config.contrast,
					saturation: state.channel1Config.saturation == '' ? undefined : +state.channel1Config.saturation,
				},
				channel2Config: {
					colorSelect: state.channel2Config.colorSelect === '' ? undefined : +state.channel2Config.colorSelect,
					imageSize: state.channel2Config.imageSize == '' ? undefined : +state.channel2Config.imageSize,
					brightness: state.channel2Config.brightness == '' ? undefined : +state.channel2Config.brightness,
					contrast: state.channel2Config.contrast == '' ? undefined : +state.channel2Config.contrast,
					saturation: state.channel2Config.saturation == '' ? undefined : +state.channel2Config.saturation,
				},
			});
			state.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		return {
			state,
			resolvingPower,
			mySetImageCollectionParameter,
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
	overflow: auto;
	.item {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		align-items: baseline;

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
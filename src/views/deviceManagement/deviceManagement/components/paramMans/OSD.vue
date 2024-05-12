<template>
	<div class="OSD">
		<div class="item">
			<span class="title">OSD参数</span>
			<div class="itemBox">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">时间标识</span>
				<el-switch v-model="state.timeShow" size="small" active-text="开" inactive-text="关" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">文本标识</span>
				<el-switch v-model="state.textShow" size="small" active-text="开" inactive-text="关" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">文本内容</span>
				<el-input v-model="state.text" placeholder="文本内容" />
			</div>
			<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myOsdParam">查询</el-button>
		</div>

		<div class="item">
			<span class="title">OSD参数</span>
			<div class="itemBox">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">时间标识</span>
				<el-switch v-model="state1.timeShow" size="small" active-text="开" inactive-text="关" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">文本标识</span>
				<el-switch v-model="state1.textShow" size="small" active-text="开" inactive-text="关" />
			</div>
			<div class="itemBox">
				<span class="itemBox_title">文本内容</span>
				<el-input v-model="state1.text" placeholder="文本内容" />
			</div>
			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px" @click="mySetOsdParam">设置</el-button>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { osdParam, setOsdParam, getChannelList } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			timeShow: false,
			textShow: false,
			text: '',
			channelId: '',
			loading: false,
		});

		const state1 = reactive({
			timeShow: false,
			textShow: false,
			text: '',
			channelId: '',
			loading: false,
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

		// 查询
		async function myOsdParam() {
			if (!state.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state.loading = true;
			const res = await osdParam({ channelId: state.channelId });
			state.loading = false;
			const item = res.data.result;
			state.timeShow = item.timeShow;
			state.textShow = item.textShow;
			state.text = item.text;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}

		// 设置
		async function mySetOsdParam() {
			state1.loading = true;
			const res = await mySetOsdParam({ channelId: state1.channelId, timeShow: state1.timeShow, textShow: state1.textShow, text: state1.text });
			state1.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		return {
			state,
			state1,
			channels,
			myOsdParam,
			mySetOsdParam,
		};
	},
};
</script>


<style lang="scss" scoped>
.OSD {
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
<template>
	<el-drawer :visible="state.show" v-model="state.show" size="56%" :close-on-click-modal="false" direction="rtl" :title="`设备通道 ---- ${state.deviceName}`">
		<div class="deviceChannelTop">
			<el-button plain size="small" @click="openClose('add')" style="margin-right: 10px">添加通道</el-button>
		</div>
		<div class="deviceChannelMain">
			<el-table :data="state.channelList" :border="true" empty-text="暂无数据" max-height="60vh" style="width: 100%" v-loading="state.loading">
				<el-table-column prop="code" label="code" :align="'center'" />
				<el-table-column prop="createTime" label="创建时间" :align="'center'" />
				<el-table-column prop="name" label="名称" :align="'center'">
					<template #default="scope">
						<span>{{ scope.row.customName || scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否启用" :align="'center'">
					<template #default="scope">
						<el-text v-if="scope.row.status == 1" class="mx-1" type="success">启用</el-text>
						<el-text v-else class="mx-1" type="danger">停用</el-text>
					</template>
				</el-table-column>
				<el-table-column label="上下线" :align="'center'">
					<template #default="scope">
						<el-text v-if="scope.row.onOffStatus == 1" class="mx-1" type="success">在线</el-text>
						<el-text v-else class="mx-1" type="danger">离线</el-text>
					</template>
				</el-table-column>
				<el-table-column label="故障状态" :align="'center'">
					<template #default="scope">
						<el-text v-if="scope.row.okFailureStatus != 1" class="mx-1" type="danger">故障</el-text>
						<el-text v-else class="mx-1" type="success">正常</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="deviceId" label="直属设备id" :align="'center'" />
				<el-table-column label="操作" :align="'center'">
					<template #default="scope">
						<el-text @click="openClose('set', scope.row)" class="mx-1" type="success" style="margin-right: 5px">修改</el-text>
						<el-text class="mx-1" type="danger" @click="delelteChanne(scope.row)">删除</el-text>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<AddChannel ref="addChannel" @complete1="getChannelList" />
		<SetChannel ref="setChannel" @complete1="getChannelList" />
	</el-drawer>
</template>

<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, provide } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getMyChannelList, delelteMyChannel } from '/@/api/deviceManagement/index.js';
import AddChannel from './addChannel.vue';
import SetChannel from './setChannel.vue';

export default {
	components: {
		AddChannel,
		SetChannel,
	},

	props: {
		deviceList: {
			default() {
				return [];
			},
		},
	},

	setup(props, { emit }) {
		window.deviceChannelList = getChannelList;

		const state = reactive({
			show: false,
			id: undefined,
			deviceName: undefined,
			loading: false,
			channelList: [],
		});

		const addChannel = ref(null);
		const setChannel = ref(null);

		// 打开
		function open(item = {}) {
			state.show = true;
			state.id = item.id;
			state.deviceName = item.name;
			state.signalStrength = item.signalStrength;
			state.batteryVoltage = item.batteryVoltage;
			getChannelList();
		}

		// 关闭
		function close() {
			state.show = false;
		}

		// 获取通道列表
		async function getChannelList() {
			state.loading = true;
			const res = await getMyChannelList({ id: state.id });
			state.loading = false;
			state.channelList = res.data.result;
		}

		// 打开弹窗
		function openClose(type, item) {
		
			if (type === 'add') {
				
				addChannel.value.open({ ...item, deviceId: state.id, deviceName: state.deviceName });
			} else if (type === 'set') {
				setChannel.value.open({ ...item, deviceId: state.id, deviceName: state.deviceName });
			}
		}

		// 删除通道
		async function delelteChanne(item) {
			const text = await ElMessageBox.confirm(`是否确定删除 ${item.name} 通道`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
			if (text !== 'confirm') {
				return;
			}
			state.loading = true;
			await delelteMyChannel({
				id: item.id,
			});
			ElMessage({
				message: '删除成功',
				type: 'success',
			});
			getChannelList();
		}

		return { state, open, close, openClose, addChannel, setChannel, delelteChanne };
	},
};
</script>

<style lang="scss" scoped>
.deviceChannelTop {
	margin: 0px 30px;
	margin-top: 30px;
}

.deviceChannelMain {
	margin: 0px 30px;
	margin-top: 20px;
}
</style>

<style lang="scss">
.deviceChannelTop {
	margin: 0px 30px;
	margin-top: 30px;
}

.deviceChannelMain {
	margin: 0px 30px;
	margin-top: 20px;

	.el-text {
		cursor: pointer;
	}

	.el-table {
		.el-table__row {
			&:nth-child(even) {
				background-color: rgba(250, 250, 250, 1);
			}
		}
		.el-table__cell {
			padding: 9px 0px;
		}
	}
}
</style>

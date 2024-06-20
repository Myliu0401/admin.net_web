<template>
	<div class="deviceManagement">
		<div class="leftNavigation">
			<div class="searchArea">
				<el-input v-model="leftData.keyword" placeholder="搜索" suffix-icon="el-icon-search" @change="getSpecificTreeShape"></el-input>
			</div>
			<div class="accordion">
				<el-tree :data="leftData.myTrees" :props="leftData.defaultProps" :highlight-current="true" node-key="id" :current-node-key="'2104'" accordion @node-click="handleNodeClick">
					<template v-slot="{ node, data }">
						<p class="custom-tree-node" :title="data.code" style="width: 100%">
							{{ data.label }}
						</p>
					</template>
				</el-tree>
			</div>
		</div>

		<div class="contentMain">
			<div class="contentMain_searchArea">
				<el-select v-model="listData.code" clearable placeholder="设备编号" size="small" style="width: 150px; min-width: 150px; margin-right: 10px">
					<el-option v-for="item in listData.deviceCodeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>
				<el-input v-model="listData.name" suffix-icon="el-icon-search" placeholder="请输入设备名称" size="small" style="margin-right: 10px; max-width: 200px"></el-input>

				<el-button plain size="small" @click="mySearch">搜索</el-button>

				<el-button plain size="small" @click="reset">重置</el-button>

				<el-button plain size="small" icon="el-icon-plus" @click="openPopup('add')">添加设备</el-button>
			</div>

			<div class="cotentMain_table">
				<el-table :data="listData.deviceList" :border="true" 
				empty-text="暂无数据" 
				style="width: 100%" 
				v-loading="listData.loading"
				max-height="70vh"
				>
					<el-table-column prop="code" label="设备id" :align="'center'" width="160" />
					<el-table-column prop="name" label="设备名称" :align="'center'" width="160">
						<template #default="scope">
							<span>{{ scope.row.customName || scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="上下线" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.onOffStatus == 1 ? 'success' : 'warning'">{{ scope.row.onOffStatus == 1 ? '在线' : '离线' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="keepaliveTime" label="心跳时间" :align="'center'" width="130">
						<template #default="scope">
							<span>{{ FormatKeepaliveDate(scope.row.keepaliveTime) }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="signalStrength" label="信号强度" :align="'center'">
						<template #default="scope">
							<el-text v-if="scope.row.signalStrength >= -0.1">{{ scope.row.signalStrength + '%' }}</el-text>
							<el-text v-else>{{ '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="batteryVoltage" label="电池电压" :align="'center'">
						<template #default="scope">
							<el-text v-if="scope.row.batteryVoltage >= -0.1">{{ scope.row.batteryVoltage + 'V' }}</el-text>
							<el-text v-else>{{ '' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="protocol" label="通信协议" :align="'center'">
						<template #default="scope">
							<el-text v-if="scope.row.protocol === 1">{{ 'NW' }}</el-text>
							<el-text v-else-if="scope.row.protocol === 2">{{ 'GB28181' }}</el-text>
							<el-text v-else-if="scope.row.protocol === 3">{{ '温气象' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="imei" label="IMEI/MEID" :align="'center'" />
					<el-table-column prop="phone" label="电话" :align="'center'" />
					<el-table-column prop="type" label="类型" :align="'center'" />
					<el-table-column prop="lensType" label="镜头类别" :align="'center'" />
					<el-table-column prop="model" label="装置型号" :align="'center'" />
					<el-table-column prop="installDate" label="安装日期" :align="'center'" width="130" />
					<el-table-column prop="networkType" label="网络类型" :align="'center'" />
					<el-table-column prop="manufacturer" label="生产厂家" :align="'center'" />
					<el-table-column prop="okFailureStatus" label="故障状态" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.okFailureStatus == 1 ? 'success' : 'warning'">{{ scope.row.okFailureStatus == 1 ? '正常' : '故障' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column label="是否启用" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.status == 1 ? 'success' : 'warning'">{{ scope.row.status == 1 ? '启用' : '停用' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="180" fixed="right" align="center" show-overflow-tooltip>
						<template #default="scope">
							<el-button icon="ele-Edit" size="small" text type="primary" @click="openPopup('set', scope.row)"> 编辑 </el-button>
							<el-button icon="ele-Delete" size="small" text type="danger" @click="myDeleteDevice(scope.row)"> 删除 </el-button>
							<el-dropdown>
								<el-button icon="ele-MoreFilled" size="small" text type="primary" style="padding-left: 12px" />
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item icon="ele-Tickets" @click="openChannel(scope.row)"> 通道管理 </el-dropdown-item>
										<el-dropdown-item icon="ele-Setting" @click="openTheConfig(scope.row)"> 参数管理 </el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<el-pagination
				v-model:currentPage="listData.page"
				v-model:page-size="listData.pageSize"
				:total="listData.totalPages"
				:page-sizes="[10, 20, 50, 100]"
				small
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</div>

		<AddDevice ref="addDevic" @complete="mySearch" :towerTress="state.towerTress" />
		<SetDevice ref="setDevic" @complete="mySearch" :towerTress="state.towerTress" />
		<DeviceChannel ref="channel" :deviceList="state.allDevices" />
		<ParamMans ref="paramMans" />
		<GbProtocol ref="gbProtocol" />
	</div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import leftInfo from './composition/tree.js';
import listInfo from './composition/list.js';
import { getListOfTowerPoles, getDeviceList, deleteDevice, getPoleTree } from '/@/api/deviceManagement/index.js';
import AddDevice from './components/addDevice.vue';
import SetDevice from './components/setDevice.vue';
import DeviceChannel from './components/deviceChannel.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import ParamMans from './components/paramMans/index.vue';
import GbProtocol from './components/gbProtocol/index.vue';

const addDevic = ref(null);
const setDevic = ref(null);
const channel = ref(null);
const paramMans = ref(null);
const gbProtocol = ref(null);

const state = reactive({
	dialogVisible: false, // 弹框
	treeNode: {}, // 选中的树节点
	towerPoles: [], // 塔杆列表
	allDevices: [], // 所有设备

	towerTress: [], // 塔杆上级树
});

const { leftData, getSpecificTreeShape } = leftInfo();
const { listData, search, reset, setPagination, handleSizeChange, handleCurrentChange } = listInfo(state);
listData.pageSize = 20;

onBeforeMount(() => {
	//getAllTowerPole(); // 获取所有塔杆
	getAllDevices(); // 获取所有设备

	getSuperiorTower(); // 获取塔杆上级
});

function FormatKeepaliveDate(str) {
	const date = new Date(str);
	if (isNaN(date.getTime())) {
		return '';
	}
	const now = new Date();
	let difference = now.getTime() - date.getTime();
	difference = difference / 1000 / 60;
	if (difference >= 30) {
		return str;
	}
	return '刚才 ' + str.split(' ')[1];
}

// 选中树节点
function handleNodeClick(data) {
	if (data.id == state.treeNode.id) {
		return;
	}

	state.treeNode = data;
	listData.page = 1;
	listData.pageSize = 20;
}

// 获取所有塔杆
async function getAllTowerPole() {
	const res = await getListOfTowerPoles({
		page: 1,
		pageSize: 10000000,
	});

	state.towerPoles = res.data.result.items.map((item) => {
		return {
			...item,
			value: item.id,
			label: item.name,
		};
	});
}

// 删除设备
async function myDeleteDevice(item) {
	const text = await ElMessageBox.confirm(`是否确定删除 ${item.name} 设备`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	});
	if (text !== 'confirm') {
		return;
	}
	await deleteDevice({
		id: item.id,
	});
	ElMessage({
		message: '删除成功',
		type: 'success',
	});
	search();
}

// 打开弹窗
function openPopup(type, item) {
	if (type === 'add') {
		addDevic.value.open();
	} else if (type === 'set') {
		setDevic.value.open(item);
	}
}

// 搜索
function mySearch() {
	listData.page = 1;
	search();
}

// 打开设备通道
function openChannel(item = {}) {
	channel.value.open(item);
}

// 获取所有设备
async function getAllDevices() {
	const res = await getDeviceList({ page: 1, pageSize: 10000000 });
	state.allDevices = res.data.result.items.map((item) => {
		return {
			value: item.id,
			label: item.name,
		};
	});
}

// 打开配置弹窗
function openTheConfig(item) {
	if (item.protocol == 1) {
		paramMans.value.open(item);
	} else if (item.protocol == 2) {
		gbProtocol.value.open(item);
	}
}

// 获取塔杆上级
async function getSuperiorTower() {
	const res = await getPoleTree({
		showDeviceNode: true,
		showUnmoutNode: true,
	});
	convertKeyValues(res.data.result);
	state.towerTress = res.data.result;
}

// 转换属性名
function convertKeyValues(datas) {
	for (let item of datas) {
		item.label = item.name;
		item.value = item.id;
		if (item.children) {
			convertKeyValues(item.children);
		}
	}
}

function getChannelList() {
	console.log('========');
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>

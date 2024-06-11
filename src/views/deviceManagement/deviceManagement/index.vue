<template>
	<div class="deviceManagement">
		<div class="leftNavigation">
			<div class="searchArea">
				<el-input v-model="leftData.keyword" placeholder="搜索" suffix-icon="el-icon-search" @change="getSpecificTreeShape"></el-input>
			</div>
			<div class="accordion">
				<el-tree :data="leftData.myTrees" :props="leftData.defaultProps" :highlight-current="true" node-key="id" :current-node-key="'2104'" accordion @node-click="handleNodeClick">
					<template v-slot="{ node, data }">
						<p class="custom-tree-node" :title="data.code" style="width: 100%;">
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
				<el-table :data="listData.deviceList" max-height="70vh" :border="true" empty-text="暂无数据" style="width: 100%" v-loading="listData.loading">
					<el-table-column prop="code" label="设备id" width="70" :align="'center'" />
					<!-- <el-table-column prop="code" label="code" width="70" :align="'center'"> </el-table-column> -->
					<el-table-column prop="keepaliveTime" label="心跳时间" width="180" :align="'center'" />
					<el-table-column label="设备名称" :align="'center'">
						<template #default="scope">
							<span>{{ scope.row.customName || scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="signalStrength" label="无线信号强度" :align="'center'" width="110" />
					<el-table-column prop="batteryVoltage" label="电池电压单位" :align="'center'" width="110" />
					<el-table-column prop="imei" label="IMEI/MEID" :align="'center'" />
					<el-table-column prop="phone" label="电话" :align="'center'" />
					<el-table-column prop="type" label="类型" :align="'center'" />
					<el-table-column prop="lensType" label="静态类别" :align="'center'" />
					<el-table-column prop="model" label="装置型号" :align="'center'" />
					<el-table-column prop="installDate" label="安装日期" :align="'center'" />
					<el-table-column prop="networkType" label="网络类型" :align="'center'" />
					<el-table-column prop="manufacturer" label="生产厂家" :align="'center'" />

					<el-table-column label="通用状态" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.status == 1 ? 'success' : 'warning'">{{ scope.row.status == 1 ? '启用' : '停用' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column label="上下线状态" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.onOffStatus == 1 ? 'success' : 'warning'">{{ scope.row.onOffStatus == 1 ? '在线' : '离线' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="okFailureStatus" label="故障状态" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.okFailureStatus == 1 ? 'success' : 'warning'">{{ scope.row.okFailureStatus == 1 ? '正常' : '故障' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="70" :align="'center'">
						<template #default="scope">
							<el-text style="margin-right: 5px" @click="openPopup('set', scope.row)" class="mx-1" type="primary">修改</el-text>
							<el-text style="margin-right: 5px" class="mx-1" type="danger" @click="myDeleteDevice(scope.row)">删除</el-text>
							<el-text class="mx-1" type="primary" @click="openChannel(scope.row)">设备通道</el-text>
							<el-text class="mx-1" type="primary" @click="openTheConfig(scope.row)">参数管理</el-text>
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
		<DeviceChannel ref="channel" :deviceList="state.allDevices"/>
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

onBeforeMount(() => {
	//getAllTowerPole(); // 获取所有塔杆
	getAllDevices(); // 获取所有设备

	getSuperiorTower(); // 获取塔杆上级
});

// 选中树节点
function handleNodeClick(data) {
	if (data.id == state.treeNode.id) {
		return;
	}

	state.treeNode = data;
	listData.page = 1;
	listData.pageSize = 10;
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

function getChannelList(){
	console.log('========')
}
</script>



<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
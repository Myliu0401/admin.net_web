<template>
	<div class="deviceManagement">
		<div class="leftNavigation">
			<div class="searchArea">
				<el-input v-model="leftData.keyword" placeholder="搜索" suffix-icon="el-icon-search"
					@change="getSpecificTreeShape"></el-input>
			</div>
			<div class="accordion">
				<el-tree :data="leftData.myTrees" :props="defaultProps" :highlight-current="true" accordion
					@node-click="handleNodeClick">
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
				<el-select v-model="state.countyId" filterable clearable placeholder="区县" style="width: 240px">
					<el-option v-for="item in state.countys" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>

				<el-select v-model="state.voltageLevelId" clearable placeholder="电压" style="width: 240px">
					<el-option v-for="item in state.voltageLevels" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>

				<el-button plain size="small" @click="search">搜索</el-button>

				<el-button plain size="small" @click="reset">重置</el-button>

				<el-button plain size="small" icon="el-icon-plus" @click="openPopup('add')">添加线路</el-button>
			</div>

			<div class="cotentMain_table">
				<el-table :data="listData.lineList" max-height="70vh" :border="true" empty-text="暂无数据"
					style="width: 100%" v-loading="listData.loading">
					<el-table-column prop="id" label="id" :align="'center'"> </el-table-column>
					<el-table-column prop="createTime" label="创建时间" :align="'center'"> </el-table-column>
					<el-table-column prop="name" label="线路名称" :align="'center'"> </el-table-column>
					<el-table-column label="是否启用" :align="'center'">
						<template #default="scope">
							<el-text v-if="scope.row.status == 1" class="mx-1" type="success">启用</el-text>
							<el-text v-else-if="scope.row.status == 2" class="mx-1" type="warning">停用</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="voltageLevelId" label="电压等级" :align="'center'"> </el-table-column>
					<el-table-column prop="countyId" label="直属区县Id" :align="'center'"> </el-table-column>
					<el-table-column label="操作" width="70" :align="'center'">
						<template #default="scope">
							<el-text @click="openPopup('set', scope.row)" class="mx-1" type="primary"
								style="margin-right: 5px">修改</el-text>
							<el-text @click="myDeletePole(scope.row)" class="mx-1" type="danger">删除</el-text>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- <div class="contentPage">
				<button class="button" @click="setPagination('lastPage')">上一页</button>
				<div class="info">{{ listData.page }}/{{ listData.totalPages }}</div>
				<button class="button" @click="setPagination('nextPage')">下一页</button>
			</div> -->

			<el-pagination v-model:currentPage="listData.page" v-model:page-size="listData.pageSize"
				:total="listData.totalPages" :page-sizes="[10, 20, 50, 100]" small background
				@size-change="handleSizeChange" @current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper" />
		</div>

		<AddTowerPole ref="addPole" :voltageLevels="state.voltageLevels" :countys="state.countys" @complete="search" />
		<SetTowerPole ref="setPole" :voltageLevels="state.voltageLevels" :countys="state.countys" @complete="search" />
	</div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import terrInfo from './composition/tree.js';
import listInfo from './composition/list.js';
import AddTowerPole from './components/addTowerPole.vue';
import SetTowerPole from './components/set1TowerPole.vue';
import { getVoltageList, getRegionList, deleteLine } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const addPole = ref(null);
const setPole = ref(null);

const state = reactive({
	treeNode: {}, // 选中的树节点
	railLines: [], // 直属线路
	countyId: undefined, // 区县id
	voltageLevelId: undefined, // 电压id
	voltageLevels: [], // 电压等级列表
	countys: [], // 区县列表
});

const { leftData, getSpecificTreeShape } = terrInfo();
const { listData, search, reset, setPagination, handleSizeChange, handleCurrentChange } = listInfo(state);

onBeforeMount(() => {
	getAllVoltageList(); // 获取全部电压等级
	//getAllCountys(); // 获取行政区
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

// 打开弹窗
function openPopup(type, item) {
	if (type === 'add') {
		addPole.value.open();
	} else if (type === 'set') {
		setPole.value.open(item);
	}
}

// 删除线路
async function myDeletePole(item) {
	const text = await ElMessageBox.confirm(`是否确定删除 ${item.name} 线路`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	});
	if (text !== 'confirm') {
		return;
	}
	await deleteLine({
		id: item.id,
	});
	ElMessage({
		message: '删除成功',
		type: 'success',
	});
	search();
};

// 获取全部电压等级列表
async function getAllVoltageList() {
	const res = await getVoltageList({ page: 1, pageSize: 1000000 });
	state.voltageLevels = res.data.result.items.map((item) => {
		return {
			...item,
			value: item.id,
			label: item.name,
		};
	});
}

// 获取所有行政区
async function getAllCountys() {
	const res = await getRegionList({
		page: 1,
		pageSize: 1000000,
		excludeSelf: true,
	});
	state.countys = res.data.result.items.map((item) => {
		return {
			value: item.id,
			label: item.name,
			...item
		};
	});
};
</script>



<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
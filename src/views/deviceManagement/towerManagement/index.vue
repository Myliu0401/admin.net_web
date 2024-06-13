<template>
	<div class="deviceManagement">
		<div class="leftNavigation">
			<div class="searchArea">
				<el-input v-model="leftData.keyword" placeholder="搜索" suffix-icon="el-icon-search" @change="getSpecificTreeShape"></el-input>
			</div>
			<div class="accordion">
				<el-tree :data="leftData.myTrees" :props="leftData.defaultProps" :highlight-current="true" 
				node-key="id" :current-node-key="'2104'" accordion @node-click="handleNodeClick" >
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
				<el-select v-model="state.lineId" clearable placeholder="线路" size="small" style="width: 150px; min-width: 150px; margin-right: 10px">
					<el-option v-for="item in state.railLines" :key="item.value" :label="item.label" :value="item.value"> </el-option>
				</el-select>

				<el-button plain size="small" @click="mySearch">搜索</el-button>

				<el-button plain size="small" @click="reset">重置</el-button>

				<el-button plain size="small" icon="el-icon-plus" @click="addPole">添加塔杆</el-button>
			</div>

			<div class="cotentMain_table">
				<el-table :data="listData.deviceList" max-height="70vh" :border="true" empty-text="暂无数据" style="width: 100%;" v-loading="listData.loading">
					<el-table-column prop="id" label="id" :align="'center'"> </el-table-column>
					<el-table-column prop="createTime" label="创建日期" :align="'center'"> </el-table-column>
					<el-table-column prop="name" label="塔杆名称" :align="'center'"> </el-table-column>
					<el-table-column prop="material" label="材质" :align="'center'"> </el-table-column>
					<el-table-column prop="property" label="性质" :align="'center'"> </el-table-column>

					<el-table-column label="通用状态" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" :type="scope.row.status == 1 ? 'success' : 'warning'">{{ scope.row.status == 1 ? '启用' : '停用' }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="lineId" label="直属线路Id" :align="'center'"> </el-table-column>
					<el-table-column prop="longitude" label="经度" :align="'center'"> </el-table-column>
					<el-table-column prop="latitude" label="纬度" :align="'center'"> </el-table-column>
					<el-table-column label="操作" width="70" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" type="primary" style="margin-right: 5px" @click="setPole(scope.row)">修改</el-text>
							<el-text class="mx-1" type="danger" @click="deleteTow(scope.row)">删除</el-text>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!-- <div class="contentPage">
				<button class="button" @click="setPagination('lastPage')">上一页</button>
				<div class="info">{{ listData.page }}/{{ listData.totalPages }}</div>
				<button class="button" @click="setPagination('nextPage')">下一页</button>
			</div> -->

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

		<AddTowerPole ref="towex" :railLines="state.railLines"  @complete="mySearch"/>
		<SetTowerPole ref="setTowex" :railLines="state.railLines" @complete="mySearch"/>
	</div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { deleteTowerPole, getRailLines } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import AddTowerPole from './components/addTowerPole.vue';
import SetTowerPole from './components/setTowerPole.vue';
import leftInfo from './composition/tree.js';
import listInfo from './composition/list.js';

const towex = ref(null);
const setTowex = ref(null);

const state = reactive({
	treeNode: {}, // 选中的树节点
	railLines: [], // 直属线路
	lineId: undefined, // 线路id
});

const { leftData, getSpecificTreeShape } = leftInfo();
const { listData, search, reset, setPagination, handleSizeChange, handleCurrentChange } = listInfo(state);

onBeforeMount(()=>{
    getAllRailLines();
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

// 删除塔杆
async function deleteTow(item) {
	const text = await ElMessageBox.confirm(`是否确定删除 ${item.name} 塔杆`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	});
	if (text !== 'confirm') {
		return;
	}

	listData.loading = true;
	await deleteTowerPole({ id: item.id });
	ElMessage({
		message: '删除成功',
		type: 'success',
	});
	search();
}

// 获取所有直属线路
async function getAllRailLines() {
	const res = await getRailLines({
		page: 1,
		pageSize: 1000000,
	});
	
    state.railLines = res.data.result.items.map((item)=>{
        return {
            value: item.id,
            label: item.name
        }
    });
};


function addPole() {
	towex.value.open();
};

function setPole(item) {
	setTowex.value.open(item);
};

function mySearch(){
	listData.page = 1;
	search()
};
</script>



<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
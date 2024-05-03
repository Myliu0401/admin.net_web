<template>
	<div class="deviceManagement">
		<div class="contentMain">
			<div class="contentMain_searchArea">
				<el-button plain size="small" icon="el-icon-plus" @click="openPopup('add')">添加电压</el-button>
			</div>

			<div class="cotentMain_table">
				<el-table :data="listData.voltageList" max-height="70vh" :border="true" empty-text="暂无数据" style="width: 100%" v-loading="listData.loading">
					<el-table-column prop="id" label="id" width="180" :align="'center'"> </el-table-column>
					<el-table-column prop="createTime" label="创建日期" :align="'center'"> </el-table-column>
					<el-table-column prop="name" label="电压" :align="'center'"> </el-table-column>
					<el-table-column label="操作" width="70" :align="'center'">
						<template #default="scope">
							<el-text class="mx-1" type="success" style="margin-right: 5px" @click="openPopup('set', scope.row)">修改</el-text>
							<el-text class="mx-1" type="danger" @click="myDeleteLevel(scope.row)">删除</el-text>
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

		<AddVoltagePopup ref="addVol" @complete="getVolList" />
		<SetVoltagePopup ref="setVol" @complete="getVolList" />
	</div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import AddVoltagePopup from './components/addVoltagePopup.vue';
import SetVoltagePopup from './components/setVoltagePopup.vue';
import listInfo from './composition/list.js';
import { deleteLevel } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

const addVol = ref(null);
const setVol = ref(null);

const { listData, getVolList, setPagination, handleSizeChange, handleCurrentChange } = listInfo();

// 打开弹窗
function openPopup(type, item) {
	if (type === 'add') {
		addVol.value.open();
	} else if (type === 'set') {
		setVol.value.open(item);
	}
}

// 删除
async function myDeleteLevel(item) {
	const text = await ElMessageBox.confirm(`是否确定删除 ${item.name} 电压`, '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
	});
	if (text !== 'confirm') {
		return;
	}
	await deleteLevel({ id: item.id });
	ElMessage({
		message: '删除成功',
		type: 'success',
	});
	getVolList(); // 重新获取列表
}
</script>



<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
<template>
	<div class="userList">
		<div class="userList_selectionArea">
			<el-input v-model="input" style="width: 200px; margin-right: 7px" placeholder="用户名称" clearable />
			<el-button type="primary" :icon="Search" @click="search">搜索</el-button>
		</div>

		<div class="mainContent">
			<el-table :data="listData.lists" max-height="70vh" :border="true" empty-text="暂无数据" style="width: 100%" v-loading="listData.loading">
				<el-table-column prop="id" label="用户id" width="180" :align="'center'" />
				<el-table-column prop="nickName" label="用户名称" :align="'center'" />
				<el-table-column prop="createTime" label="创建时间"  :align="'center'" />
				<el-table-column  label="操作" :align="'center'" width="100">
                    <template #default="scope">
							<el-text class="mx-1" type="success" style="margin-right: 5px;" @click="openPopup(scope.row)">已授权设备</el-text>
						</template>
                </el-table-column>
			</el-table>

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

        <teleport to="#app">
            <Drawer ref="drawer"/>
        </teleport>
	</div>
</template>


<script setup>
import { Search } from '@element-plus/icons-vue';
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import listInfo from './composition/list.js';
import Drawer from './components/drawer.vue';

const drawer = ref(null);

const { listData, setPagination, search, handleSizeChange, handleCurrentChange } = listInfo();


// 打开抽屉
function openPopup(item){
    drawer.value.open(item);
};


</script>



<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
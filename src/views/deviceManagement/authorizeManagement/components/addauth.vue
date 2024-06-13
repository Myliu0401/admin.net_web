<template>
	<el-dialog :visible="state.show" title="添加授权设备" v-model="state.show" :close-on-click-modal="false" width="50%">
		<div class="mainContent">
			<div class="mainContent_searchArea">
				<el-input v-model="state.name" suffix-icon="el-icon-search" placeholder="请输入设备名称" size="small"
					style="margin-right: 10px; max-width: 200px"></el-input>
				<el-button type="primary" :icon="Search" @click="search">搜索</el-button>
			</div>

			<el-table ref="myTable" @selection-change="handleSelectionChange" :data="state.lists" max-height="50vh"
				:border="true" empty-text="暂无数据" style="width: 100%" v-loading="state.loading">
				<el-table-column type="selection" width="50" />
				<el-table-column prop="code" label="设备id" width="180" :align="'center'" />
				<el-table-column prop="name" label="设备名称" :align="'center'" />
				<el-table-column prop="createTime" label="创建时间" :align="'center'" />
			</el-table>

			<el-pagination layout="prev, pager, next" :total="state.total" @current-change="pagination" />
		</div>
		<div style="display: flex; justify-content: flex-end;"><el-button type="primary"
				@click="addAuthorization">添加授权</el-button></div>
	</el-dialog>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getDeviceList } from '/@/api/deviceManagement/index.js';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { addDevicesAuthorization } from '/@/api/authority/index.js';

export default {
	setup(props, { emit }) {
		const state = reactive({
			show: false,
			name: undefined, // 设备名称
			loading: false,
			page: 1,
			total: undefined, // 总数据量
			pageSize: 10,
			lists: [], // 设备列表
			selectedRows: [], // 选中的数据
			id: null
		});

		const myTable = ref(null);

		function open(id) {
			state.show = true;
			state.id = id;
			getMyDeviceList();
		};

		// 关闭弹窗
		function close() {
            state.show = false;
		};

		// 获取设备列表
		async function getMyDeviceList() {
			state.loading = true;
			const res = await getDeviceList({
				page: state.page,
				pageSize: state.pageSize,
				name: state.name,
			});
			state.loading = false;
			state.total = res.data.result.total;
			state.lists = res.data.result.items;
			console.log(res.data.result.items);
		}

		function search() {
			state.page = 1;
			state.pageSize = 10;
			getMyDeviceList();
		}

		async function pagination(page) {
			state.page = page;
			await getMyDeviceList();
			restoreSelection();
		}

		function handleSelectionChange(e) {
			state.selectedRows = e;
		}

		function restoreSelection() {
			const table = myTable.value;
			const multipleSelection = table.multipleSelection; // 获取当前选中的行
			const needToSelect = state.selectedRows.filter((row) => !multipleSelection.includes(row)); // 找出需要被重新选中的行
			needToSelect.forEach((row) => {
				table.toggleRowSelection(row, true); // 重新选中这些行
			});
		};



		// 添加授权
		async function addAuthorization() {

			if (state.loading) {
				return
			}

			if (!state.selectedRows || !state.selectedRows.length) {
				ElMessage({
					message: '请选择设备',
					type: 'warning',
				})
				return
			};

			state.loading = true;
			await addDevicesAuthorization({
				userId: state.id,
				devices: state.selectedRows.map((item) => { return item.id })
			});

			state.loading = false;
			emit('complete');
			close();
			ElMessage({
				message: '添加成功',
				type: 'success',
			});

		};

		return { state, open, search, pagination, handleSelectionChange, addAuthorization, myTable };
	},
};
</script>


<style lang="scss" scoped>
.mainContent {
	height: 65vh;

	.mainContent_searchArea {
		margin-bottom: 10px;
	}
}
</style>

<style lang="scss">
.el-dialog__title {
	color: #fff !important;
}
</style>
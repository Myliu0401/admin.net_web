<template>
	<el-drawer :visible="state.show" v-model="state.show" :title="`已授权的设备列表---${state.nickName}`" :with-header="true" size="56%"
		:close-on-click-modal="false" direction="rtl">
		<div class="drawer">
			<div class="drawer_selectionArea">
				<el-button :icon="Plus" @click="popUpWindow('add')">添加授权设备</el-button>
			</div>
			<el-table :data="state.lists" max-height="70vh" :border="true" empty-text="暂无数据" style="width: 100%"
				v-loading="state.loading">
				<el-table-column prop="id" label="设备id" width="180" :align="'center'" />
				<el-table-column prop="name" label="设备名称" :align="'center'" />
				<el-table-column prop="createTime" label="创建时间" :align="'center'" />
				<el-table-column label="操作" :align="'center'" width="100">
					<template #default="scope">
						<el-text class="mx-1" type="danger" @click="deleteUnbindAuth(scope.row)">删除授权</el-text>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<teleport to="#app">
			<Addauth ref="addauth" @complete="complete" />
		</teleport>
	</el-drawer>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMyAuthorizedDevices, unbindAuthorization } from '/@/api/authority/index.js';
import { Plus } from '@element-plus/icons-vue';
import Addauth from './addauth.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {

	components: { Addauth },

	setup(props, { emit }) {
		const state = reactive({
			show: false,
			loading: false,
			lists: [],
			id: undefined,
			nickName: undefined,
		});

		const addauth = ref(null);

		function open(item) {
			state.id = item.id;
			state.nickName = item.nickName;
			state.show = true;
			getAuthorizedDevices();
		}

		// 调起弹窗
		function popUpWindow(type, item) {
			if (type === 'add') {
				addauth.value.open(state.id);
			}
		};

		// 获取授权设备列表
		async function getAuthorizedDevices() {
			state.loading = true;
			const res = await getMyAuthorizedDevices({ userId: state.id });
			state.loading = false;
			state.lists = res.data.result;
		};


		function complete() {
			getAuthorizedDevices()
		};


		// 解绑授权
		async function deleteUnbindAuth(item) {
			const text = await ElMessageBox.confirm(`是否确定解绑 ${item.name} 设备授权`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			});
			if (text !== 'confirm') {
				return;
			};
			state.loading = true;
			try{
				await unbindAuthorization({ userId: state.id, devices: [item.id] });
			}catch(err){
				state.loading = false;
              return
			}
			state.loading = false;
			getAuthorizedDevices();
			ElMessage({
				message: '解绑成功',
				type: 'success',
			});
		};

		return { state, open, Plus, addauth, popUpWindow, complete, deleteUnbindAuth };
	},
};
</script>


<style lang="scss" scoped>
.drawer {
	width: 100%;
	height: 100%;
	padding: 25px;
	padding-top: 30px;

	.drawer_selectionArea {
		margin-bottom: 20px;
	}

	.el-text {
		cursor: pointer;
	}
}
</style>
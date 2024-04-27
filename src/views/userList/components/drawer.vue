<template>
	<el-drawer v-model="state.show" :title="`已授权的设备列表---${state.nickName}`" :with-header="true" size="56%" :close-on-click-modal="false" direction="rtl">
		<div class="drawer">
           <div class="drawer_selectionArea">
              <el-button :icon="Plus" @click="popUpWindow('add')">添加授权设备</el-button>
           </div>
            <el-table :data="state.lists" max-height="70vh" :border="true" empty-text="暂无数据" style="width: 100%" v-loading="state.loading">
				<el-table-column prop="id" label="用户id" width="180" :align="'center'" />
				<el-table-column prop="nickName" label="用户名称" :align="'center'" />
				<el-table-column prop="createTime" label="创建时间"  :align="'center'" />
				<el-table-column  label="操作" :align="'center'" width="100">
                    <template #default="scope">
							
						</template>
                </el-table-column>
			</el-table>
        </div>

        <teleport to="#app">
            <Addauth ref="addauth"/>
        </teleport>
	</el-drawer>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMyAuthorizedDevices } from '/@/api/authority/index.js';
import {  Plus } from '@element-plus/icons-vue';
import Addauth from './addauth.vue';

export default {
   
    components: { Addauth },

	setup() {
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
        function popUpWindow(type, item){
             if(type === 'add'){
                addauth.value.open();
             }
        };

		// 获取授权设备列表
		async function getAuthorizedDevices() {
			state.loading = true;
			const res = await getMyAuthorizedDevices({ userId: state.id });
			state.loading = false;
			state.lists = res.data.result;
		}

		return { state, open, Plus, addauth, popUpWindow };
	},
};
</script>


<style lang="scss" scoped>
.drawer {
	width: 100%;
	height: 100%;
    padding: 25px;
    padding-top: 30px;

    .drawer_selectionArea{
        margin-bottom: 20px;
    }
}
</style>
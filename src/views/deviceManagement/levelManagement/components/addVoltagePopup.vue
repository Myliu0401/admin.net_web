<template>
	<el-dialog title="添加电压" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="close">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="70px">
			<el-form-item label="电压名称" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { addLevel } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	setup(props, { emit }) {
		const ruleFormRef = ref(null);
		const state = reactive({
			dialogVisible: false,
			loading: false,
		});

		const form = reactive({
			name: '', // 电压名称
		});

		const rules = reactive({
			name: [{ required: true, message: '必须输入电压名称', trigger: 'blur' }],
		});

		function open() {
			state.dialogVisible = true;
		}

		function close() {
			state.dialogVisible = false;
			wipeData();
		}

		async function submitForm(ruleFormRef) {
			const bool = await ruleFormRef.validate();
			if (!bool) {
				return;
			}
			state.loading = true;
			await addLevel({ name: form.name });
			state.loading = false;
			ElMessage({
				message: '添加成功',
				type: 'success',
			});
			emit('complete');
            close();
            
		};

		function wipeData(){
			state.dialogVisible = false;
			state.loading = false;

			form.name = '';
		} 

		return {
			state,
			form,
			rules,
			open,
			close,
			submitForm,
			ruleFormRef,
		};
	},
};
</script>

<style lang="scss">
.el-dialog__title {
	color: #fff;
}
.el-form-item__content {
	display: flex;
	justify-content: end;
}
</style>
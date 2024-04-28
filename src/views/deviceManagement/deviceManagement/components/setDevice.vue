<template>
	<el-dialog title="修改设备" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="close">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="100px">
			<el-form-item label="设备名称" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item label="备注">
				<el-input v-model="form.remark" />
			</el-form-item>

			<el-form-item label="排序">
				<el-input v-model="form.orderNo" type="number" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="上下线状态">
				<el-switch inline-prompt active-text="上线" inactive-text="离线" v-model="form.onOffStatus" />
			</el-form-item>

			<el-form-item label="设备故障状态">
				<el-switch inline-prompt active-text="正常" inactive-text="故障" v-model="form.okFailureStatus" />
			</el-form-item>

			<el-form-item label="直属杆塔" prop="poleId">
				<el-select v-model="form.poleId" clearable placeholder="塔杆" style="width: 240px">
					<el-option v-for="item in towerPoles" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script>
import { ElMessage, ElMessageBox } from 'element-plus';
import { defineProps, reactive, defineComponent, ref, defineEmits } from 'vue';
import { setDevice } from '/@/api/deviceManagement/index.js';

export default {

    props: {
        towerPoles: {
            default(){
                return []
            }
        }
    },

	setup(props, { emit }) {
		const ruleFormRef = ref(null);

		const state = reactive({
			dialogVisible: false,
			loading: false,
			id: undefined,
			item: null
		});

		const form = reactive({
			name: undefined, // 塔杆名称
			onOffStatus: false, // 上下线状态
            okFailureStatus: false, // 设备故障状态
			remark: undefined, // 备注
			orderNo: undefined, // 排序
            poleId: undefined, // 直属塔杆
			status: undefined, // 通用状态
		});

		const rules = reactive({
			name: [{ required: true, message: '必须输入设备名称', trigger: 'blur' }],
		});

		// 开启弹窗
		function open(item) {
			state.dialogVisible = true;
			state.item = item;
			state.id = item.id;
			form.name = item.name;
			form.poleId = item.poleId;
			form.remark = item.remark;
			form.orderNo = item.orderNo;
			form.onOffStatus = item.onOffStatus == 1 ? true : false;
			form.okFailureStatus = item.okFailureStatus == 1 ? true : false;
			form.status = item.status == 1 ? true : false;
		};

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
		};


        async function submitForm(ruleFormRef) {
			const bool = await ruleFormRef.validate();
			if (!bool) {
				return;
			};
			state.loading = true;
			await setDevice({
				id: state.id,
                ...state.item,
				name: form.name,
				orderNo: form.orderNo,
				remark: form.remark,
				onOffStatus: form.status ? 1 : 2,
                okFailureStatus: form.status ? 1 : 2,
                poleId: form.poleId
			});
			state.loading = false;
			ElMessage({
				message: '修改成功',
				type: 'success',
			});
			emit('complete');
            close();


		}


        return { state, open, close, form, rules, ruleFormRef, submitForm }
	},
};
</script>

<style lang="scss">
.dialog-footer {
	margin-top: 20px;
	text-align: end;
}

.el-dialog__title {
	color: #fff;
}
</style>

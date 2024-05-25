<template>
	<el-dialog title="修改线路" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="close">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="70px">
			<el-form-item label="线路名称" prop="name">
				<el-input v-model="form.name" />
			</el-form-item>

			<el-form-item label="备注">
				<el-input v-model="form.remark" />
			</el-form-item>

			<el-form-item label="排序">
				<el-input v-model="form.orderNo" type="number" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="通用状态">
				<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="form.status" />
			</el-form-item>

			<el-form-item label="电压等级" prop="voltageLevelId">
				<el-select v-model="form.voltageLevelId" clearable placeholder="电压" style="width: 240px">
					<el-option v-for="item in voltageLevels" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

			<el-form-item label="区县" prop="countyId">
				<el-select v-model="form.countyId" filterable clearable placeholder="区县" style="width: 240px">
					<el-option v-for="item in countys" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>

	
			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script >
import { defineProps, reactive, defineComponent, ref, defineEmits } from 'vue';
import { setLine } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default defineComponent({
	props: {
		railLines: {
			default() {
				return [];
			},
		},
		voltageLevels: {
			default(){
				return []
			}
		},
		countys: {
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
			id: null
		});

		const form = reactive({
			name: undefined, // 塔杆名称
			status: false, // 通用状态
			remark: undefined, // 备注
			orderNo: undefined, // 排序
			voltageLevelId: undefined, // 电压等级id
			countyId: undefined, // 区县id
		});

		const rules = reactive({
			name: [{ required: true, message: '必须输入线路名称', trigger: 'blur' }],
			voltageLevelId: [{ required: true, message: '必须选择电压等级', trigger: 'blur' }],
			countyId: [{ required: true, message: '必须选择行政区', trigger: 'blur' }]
		});

		// 开启弹窗
		function open(item) {
			state.dialogVisible = true;
			form.name = item.name;
			form.status = item.status == 1 ? true : false;
			form.remark = item.remark;
			form.orderNo = item.orderNo;
			form.voltageLevelId = item.voltageLevelId;
			form.countyId = item.countyId;
			state.id = item.id;
		};

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
			wipeData();
		}

		async function submitForm(ruleFormRef) {
			const bool = await ruleFormRef.validate();
			if (!bool) {
				return;
			};
			state.loading = true;
			await setLine({
				voltageLevelId: form.voltageLevelId,
				countyId: form.countyId,
				name: form.name,
				orderNo: form.orderNo,
				remark: form.remark,
				status: form.status ? 1 : 2,
				id: state.id
			});
			state.loading = false;
			ElMessage({
				message: '修改成功',
				type: 'success',
			});
			emit('complete');
            close();


		};


		function wipeData(){
			state.dialogVisible = false;
			state.loading = false;

			form.name = undefined;
			form.status = false;
			form.remark = undefined; 
			form.orderNo = undefined;
			form.voltageLevelId = ''; 
			form.countyId = '';
		};

		return { state, open, close, form, rules, submitForm, ruleFormRef };
	},
});
</script>

<style lang="scss">
.dialog-footer {
	margin-top: 20px;
	text-align: end;
}
.el-dialog__title{
	color: #fff;
}
</style>
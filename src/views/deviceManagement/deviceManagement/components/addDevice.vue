<template>
	<el-dialog title="添加设备" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="close">
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

			<el-form-item label="IMEI/MEID">
				<el-input v-model="form.imei" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="电话">
				<el-input v-model="form.phone" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="类型">
				<el-input v-model="form.type" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="静态类别">
				<el-input v-model="form.lensType" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="装置型号">
				<el-input v-model="form.model" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="网络类型">
				<el-input v-model="form.networkType" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="生产厂家">
				<el-input v-model="form.manufacturer" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="安装日期">
				<el-date-picker style="width: 150px" v-model="form.installDate" type="date" placeholder="安装日期" />
			</el-form-item>

			<el-form-item label="通用状态">
				<el-switch inline-prompt active-text="上线" inactive-text="离线" v-model="form.status" />
			</el-form-item>

			<el-form-item label="上下线状态">
				<el-switch inline-prompt active-text="上线" inactive-text="离线" v-model="form.onOffStatus" />
			</el-form-item>

			<el-form-item label="设备故障状态">
				<el-switch inline-prompt active-text="启用" inactive-text="停用" v-model="form.status" />
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
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { addDevice } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
	props: {
		towerPoles: {
			default() {
				return [];
			},
		},
	},

	setup(props, { emit }) {
		const ruleFormRef = ref(null);

		const state = reactive({
			dialogVisible: false,
			loading: false,
		});

		const form = reactive({
			name: undefined, // 塔杆名称
			onOffStatus: false, // 上下线状态
			okFailureStatus: false, // 设备故障状态
			remark: undefined, // 备注
			orderNo: undefined, // 排序
			poleId: undefined, // 直属塔杆
			status: undefined, // 通用状态
			imei: undefined, // IMEI/MEID
			phone: undefined, // 电话
			type: undefined, // 类型
			lensType: undefined, // 静态类别
			model: undefined, // 装置型号
			installDate: undefined, // 安装日期
			networkType: undefined, // 网络类型
			manufacturer: undefined, // 生产厂家
		});

		const rules = reactive({
			name: [{ required: true, message: '必须输入设备名称', trigger: 'blur' }],
		});

		// 开启弹窗
		function open() {
			state.dialogVisible = true;
		}

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
		}

		function formatDate(date) {
			// 获取年、月、日
			var year = date.getFullYear();
			var month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
			var day = String(date.getDate()).padStart(2, '0');

			// 拼接成所需格式
			var formattedDate = year + '-' + month + '-' + day;

			return formattedDate;
		}

		async function submitForm(ruleFormRef) {
			const bool = await ruleFormRef.validate();
			if (!bool) {
				return;
			}
			state.loading = true;
			await addDevice({
				name: form.name,
				orderNo: form.orderNo,
				remark: form.remark,
				onOffStatus: form.status ? 1 : 2,
				okFailureStatus: form.status ? 1 : 2,
				status: form.status ? 1 : 2,
				poleId: form.poleId,
				imei: form.imei,
				phone: form.phone,
				type: form.type,
				lensType: form.lensType,
				model: form.model,
				installDate: form.installDate ? formatDate(form.installDate) : undefined,
				networkType: form.networkType,
				manufacturer: form.manufacturer,
			});
			state.loading = false;
			ElMessage({
				message: '添加成功',
				type: 'success',
			});
			emit('complete');
			close();
		}

		return { state, open, close, form, rules, ruleFormRef, submitForm };
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


 
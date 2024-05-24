<template>
	<el-dialog title="修改设备" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="close">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="100px">
			<el-form-item label="通道名称">
				<el-input v-model="form.name" disabled/>
			</el-form-item>

			<el-form-item label="自定义名称" prop="customName">
				<el-input v-model="form.customName" />
			</el-form-item>

			<el-form-item label="code" prop="code">
				<el-input v-model="form.code" />
			</el-form-item>

			<el-form-item label="通讯协议类型" prop="protocol">
				<el-radio-group v-model="form.protocol" class="ml-4">
					<el-radio :value="1" size="small">南方电网</el-radio>
					<el-radio :value="2" size="small">GB28181</el-radio>
				</el-radio-group>
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

			<el-form-item label="上下线状态">
				<el-switch inline-prompt active-text="上线" inactive-text="离线" v-model="form.onOffStatus" />
			</el-form-item>

			<el-form-item label="设备故障状态">
				<el-switch inline-prompt active-text="正常" inactive-text="故障" v-model="form.okFailureStatus" />
			</el-form-item>

			<el-form-item label="直属杆塔" prop="poleId">
				<div>
					<el-tree-select v-model="state.towerLevel" :data="towerTress" filterable style="width: 170px" placeholder="上级" @change="towerPole" />
					--
					<el-select v-model="form.poleId" clearable placeholder="塔杆" style="width: 170px">
						<el-option v-for="item in state.towerPoles" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</div>
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
			id: undefined,
			item: null,
			towerLevel: '', // 塔杆上级
			towerPoles: '', // 塔杆列表
			lineId: '', // 线路
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
			customName: '', // 自定义名称
			code: '', // code
			protocol: 1, // 通讯协议类型 1 南网 2 2818
		});

		const rules = reactive({
			/* name: [{ required: true, message: '必须输入设备名称', trigger: 'blur' }], */
			customName: [{ required: true, message: '必须输入自定义名称', trigger: 'blur' }],
			code: [{ required: true, message: '必须输入code', trigger: 'blur' }],
		});

		// 开启弹窗
		function open(item) {
			state.dialogVisible = true;
			state.item = item;
			state.id = item.id;
			form.name = item.name;
			form.poleId = form.poleId ? form.poleId : 0;
			form.remark = item.remark;
			form.orderNo = item.orderNo;
			form.onOffStatus = item.onOffStatus == 1 ? true : false;
			form.okFailureStatus = item.okFailureStatus == 1 ? true : false;
			form.status = item.status == 1 ? true : false;
			form.imei = item.imei;
			form.phone = item.phone;
			form.type = item.type;
			form.lensType = item.lensType;
			form.model = item.model;
			form.installDate = item.installDate;
			form.networkType = item.networkType;
			form.manufacturer = item.manufacturer;
			form.code = item.code;
			form.customName = item.customName;
			form.protocol = item.protocol;
		}

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
		}

		function formatDate(date) {
			date = typeof date === 'string' ? new Date(date) : date;

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
			await setDevice({
				id: state.id,
				...state.item,
				name: form.name,
				orderNo: form.orderNo,
				remark: form.remark,
				onOffStatus: form.status ? 1 : 2,
				okFailureStatus: form.status ? 1 : 2,
				poleId: form.poleId,
				imei: form.imei,
				phone: form.phone,
				type: form.type,
				lensType: form.lensType,
				model: form.model,
				installDate: form.installDate ? formatDate(form.installDate) : undefined,
				networkType: form.networkType,
				manufacturer: form.manufacturer,
				code: form.code,
				customName: form.customName,
				protocol: form.protocol
			});
			state.loading = false;
			ElMessage({
				message: '修改成功',
				type: 'success',
			});
			emit('complete');
			close();
		}

		// 获取塔杆
		async function towerPole() {
			if (!state.towerLevel) {
				return;
			}
			form.poleId = null;
			const item = getDuiyin(props.towerTress, state.towerLevel);

			const res = await getListOfTowerPoles({
				page: 1,
				pageSize: 100000,

				treeNode: {
					id: item.id,
					type: item.type,
					extId: item.extId,
				},
			});
			state.towerPoles = res.data.result.items.map((item) => {
				return {
					...item,
					value: item.id,
					label: item.name,
				};
			});
		}

		function getDuiyin(data, id) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id === id) {
					return data[i];
				} else if (data[i].children && data[i].children.length) {
					const item = getDuiyin(data[i].children, id);
					if (item) {
						return item;
					}
				}
			}
		}

		return { state, open, close, form, rules, ruleFormRef, submitForm, towerPole };
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

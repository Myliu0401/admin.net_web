<template>
	<el-dialog title="修改线路" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%"
		:before-close="close">
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

			<el-form-item label="是否启用">
				<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="form.status" />
			</el-form-item>

			<el-form-item label="电压等级" prop="voltageLevelId">
				<el-select v-model="form.voltageLevelId" clearable placeholder="电压" style="width: 240px">
					<el-option v-for="item in voltageLevels" :key="item.value" :label="item.label"
						:value="item.value" />
				</el-select>
			</el-form-item>

			<el-form-item label="区县" prop="countyId">
				<el-select v-model="stateRegion.currentProvince" placeholder="省" style="width: 100px !important;"
					@change="administrationChange('省', $event)">
					<el-option v-for="item in stateRegion.province" :key="item.id" :label="item.name"
						:value="item.id" />
				</el-select>

				<el-select v-model="stateRegion.currentCity" placeholder="市" style="width: 100px !important;"
					@change="administrationChange('市', $event)">
					<el-option v-for="item1 in stateRegion.city[stateRegion.currentProvince]" :key="item1.id"
						:label="item1.name" :value="item1.id" />
				</el-select>

				<el-select v-model="stateRegion.currentArea" placeholder="区" style="width: 100px !important;">
					<el-option v-for="item1 in stateRegion.area[stateRegion.currentCity]" :key="item1.id"
						:label="item1.name" :value="item1.id" />
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
import { defineProps, reactive, defineComponent, ref, defineEmits, onBeforeMount } from 'vue';
import { setLine, getRegionList } from '/@/api/deviceManagement/index.js';
import { getRegion, getSuperiorData } from '/@/api/visualLargeScreen/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default defineComponent({
	props: {
		railLines: {
			default() {
				return [];
			},
		},
		voltageLevels: {
			default() {
				return []
			}
		},
		countys: {
			default() {
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

		const stateRegion = reactive({
			province: [],
			city: {

			},
			area: {

			},

			currentProvince: null,
			currentCity: null,
			currentArea: null
		});

		const form = reactive({
			name: undefined, // 塔杆名称
			status: false, // 是否启用
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

		onBeforeMount(() => {
			getAllProvince();
		});

		// 开启弹窗
		async function open(item) {
			state.dialogVisible = true;
			form.name = item.name;
			form.status = item.status == 1 ? true : false;
			form.remark = item.remark;
			form.orderNo = item.orderNo;
			form.voltageLevelId = item.voltageLevelId;
			//form.countyId = item.countyId;
			stateRegion.currentArea = +item.countyId;
			state.id = item.id;

		    const res = await myGetSuperiorData({
				type: 0,
				id: item.countyId
			});

			stateRegion.currentProvince = +res.result[2].id;

			await administrationChange('省', stateRegion.currentProvince);

			stateRegion.currentCity = +res.result[1].id;

			await administrationChange('市', stateRegion.currentCity);

			stateRegion.currentArea = +item.countyId;

			
			
		};

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
			wipeData();
		}

		async function submitForm(ruleFormRef) {
			stateRegion.currentArea && (form.countyId = stateRegion.currentArea)
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


		function wipeData() {
			state.dialogVisible = false;
			state.loading = false;

			form.name = undefined;
			form.status = false;
			form.remark = undefined;
			form.orderNo = undefined;
			form.voltageLevelId = '';
			form.countyId = '';
		};

		async function getAdministration(type, pid = 0) {

			if (type === '省' && stateRegion.city[pid] || type === '市' && stateRegion.area[pid]) {
				return
			}
			const res = await getRegionList({
				page: 1,
				pageSize: 10000,
				pid,
				excludeSelf: true,
			});
			const arr = res.data.result.items;

			if (type === '省' && !stateRegion.city[pid]) {
				stateRegion.city[pid] = arr;
				stateRegion.currentCity = null;
				stateRegion.currentArea = null;
			} else if (type === '市' && !stateRegion.area[pid]) {
				stateRegion.area[pid] = arr;
				stateRegion.currentArea = null;
			};


			return arr;


		};

		async function getAllProvince(num = 0) {
			const res = await getRegion(num);

			stateRegion.province = res.data.result


		};


		async function administrationChange(type, id) {
			if (type === '省') {
				stateRegion.currentProvince = id;
			} else if (type === '市') {
				stateRegion.currentCity = id;

			}

			if (type === '省' || type === '市') {
				return await getAdministration(type, id)
			}

		};

		async function myGetSuperiorData(obj = {}){
			const res = await getSuperiorData(obj);

			return res.data;
		}



		return { state, open, close, form, rules, submitForm, ruleFormRef, stateRegion, administrationChange };
	},
});
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
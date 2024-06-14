<template>
	<el-dialog title="添加设备" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%"
		:before-close="close">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="100px">

			<el-form-item label="自定义名称" prop="customName">
				<el-input v-model="form.customName" />
			</el-form-item>

			<el-form-item label="code" prop="code">
				<el-input v-model="form.code" />
			</el-form-item>

			<el-form-item label="通讯协议类型" prop="protocol">
				<el-radio-group v-model="form.protocol" class="ml-4">
					<el-radio :value="1" size="small">NW</el-radio>
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

			<el-form-item label="镜头类别">
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

			<el-form-item label="是否启用">
				<el-switch inline-prompt active-text="启用" inactive-text="停用" v-model="form.status" />
			</el-form-item>

			<!-- <el-form-item label="上下线状态">
				<el-switch inline-prompt active-text="上线" inactive-text="离线" v-model="form.onOffStatus" />
			</el-form-item> -->

			<el-form-item label="设备故障状态">
				<el-switch inline-prompt active-text="启用" inactive-text="停用" v-model="form.okFailureStatus" />
			</el-form-item>

			<el-form-item label="直属杆塔" prop="poleId">
				<el-select v-model="stateData.provinceId" placeholder="省" size="small"
					style="width: 100px; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRegionList('省', $event)">
					<el-option v-for="item in stateData.province" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<el-select v-model="stateData.cityId" placeholder="市" size="small"
					style="width: 100px; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRegionList('市', $event)">
					<el-option v-for="item in stateData.city[stateData.provinceId]" :key="item.id" :label="item.name"
						:value="item.id" />
				</el-select>

				<el-select v-model="stateData.areaId" placeholder="区" size="small"
					style="width: 100px; margin-right: 10px; margin-bottom: 5px;"
					@change="myGetRegionList('区', $event)">
					<el-option v-for="item in stateData.area[stateData.cityId]" :key="item.id" :label="item.name"
						:value="item.id" />
				</el-select>

				<el-select v-model="stateData.gradeId" placeholder="等级" size="small"
					style="width: 100px; margin-right: 10px; margin-bottom: 5px;" @change="myGetRailLine($event)">
					<el-option v-for="item in stateData.grade" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<el-select v-model="stateData.lineId" placeholder="线路" size="small"
					style="width: 100px; margin-right: 10px; margin-bottom: 5px;" @change="myGetPole($event)">
					<el-option v-for="item in stateData.line[stateData.gradeId]" :key="item.id" :label="item.name"
						:value="item.id" />
				</el-select>

				<el-select v-model="stateData.poleId" placeholder="塔杆" size="small"
					style="width: 100px;margin-bottom: 5px;">
					<el-option v-for="item in stateData.pole[stateData.lineId]" :key="item.id" :label="item.name"
						:value="item.id" />
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
import { addDevice, getListOfTowerPoles, getRegionList, getVoltageLevel, getRailLine, getPole } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getRegion, } from '/@/api/visualLargeScreen/index.js';
export default {
	props: {
		/* towerPoles: {
			default() {
				return [];
			},
		}, */

		towerTress: {
			default: {
				default() {
					return [];
				},
			},
		},
	},

	setup(props, { emit }) {
		const ruleFormRef = ref(null);

		const stateData = reactive({
			province: [],
			city: {

			},
			area: {

			},
			grade: [], // 等级
			line: { // 线路

			},
			pole: {

			},
			provinceId: null,  // 省
			cityId: null,  // 市
			areaId: null,  // 区
			gradeId: null, // 等级
			lineId: null, // 线路
			poleId: null, // 塔杆
		});

		const state = reactive({
			dialogVisible: false,
			loading: false,
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
			lensType: undefined, // 镜头类别
			model: undefined, // 装置型号
			installDate: undefined, // 安装日期
			networkType: undefined, // 网络类型
			manufacturer: undefined, // 生产厂家
			customName: '', // 自定义名称
			code: '', // code
			protocol: 1,
		});

		const rules = reactive({
			/* name: [{ required: true, message: '必须输入设备名称', trigger: 'blur' }], */
			customName: [{ required: true, message: '必须输入自定义名称', trigger: 'blur' }],
			code: [{ required: true, message: '必须输入code', trigger: 'blur' }],
		});

		// 获取所有省
		async function myGetRegion() {
			const res = await getRegion(0);
			stateData.province = res.data.result;
		};

		// 获取省以下级别
		async function myGetRegionList(type, pid) {
			
			if (type === '省' && stateData.city[pid] || type === '市' && stateData.area[pid]) {
				return
			}
			if (type === '区') {
				
				await myGetVoltageLevel();
				return
			}
			const res = await getRegionList({
				page: 1,
				pageSize: 10000,
				pid,
			});


			if (type === '省' && !stateData.city[pid]) {

				stateData.city[pid] = res.data.result.items;
				stateData.cityId = null;

			} else if (type === '市' && !stateData.area[pid]) {
				stateData.area[pid] = res.data.result.items;

			}

			stateData.areaId = null;
			stateData.gradeId = null;
			stateData.lineId = null;
			stateData.poleId = null;

		};


		// 获取等级列表
		async function myGetVoltageLevel() {
			const res = await getVoltageLevel();
			stateData.grade = [...res.data.result];
			stateData.lineId = null;

			
		};


		// 获取线路
		async function myGetRailLine(id) {
			const res = await getRailLine({
				countyId: stateData.areaId, // 区县id
				voltageLevelId: id, // 电压等级
			});
			stateData.line[id] = res.data.result;
			stateData.poleId = null;
		};

		// 获取塔杆
		async function myGetPole(id) {
			const res = await getPole({
				lineId: id
			});
			stateData.pole[id] = res.data.result;
		};

		// 开启弹窗
		function open() {
			state.dialogVisible = true;
			myGetRegion();

		}

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;
			wipeData();
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
			stateData.poleId && (form.poleId = stateData.poleId)
			const bool = await ruleFormRef.validate();
			if (!bool) {
				return;
			}
			state.loading = true;
			try {
				await addDevice({
					//name: form.name,
					orderNo: form.orderNo,
					remark: form.remark,
					onOffStatus: form.status ? 1 : 2,
					okFailureStatus: form.status ? 1 : 2,
					status: form.status ? 1 : 2,
					poleId: form.poleId ? form.poleId : 0,
					imei: form.imei,
					phone: form.phone,
					type: form.type,
					lensType: form.lensType,
					model: form.model,
					installDate: form.installDate ? formatDate(form.installDate) : undefined,
					networkType: form.networkType,
					manufacturer: form.manufacturer,
					customName: form.customName,
					code: form.code,
					protocol: form.protocol,
				});
			} catch (err) {
				state.loading = false;
				return;
			}

			state.loading = false;
			ElMessage({
				message: '添加成功',
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

		// 清空数据
		function wipeData() {
			state.dialogVisible = false;
			state.loading = false;

			form.name = undefined;
			form.onOffStatus = false;
			form.okFailureStatus = false;
			form.remark = undefined;
			form.orderNo = undefined;
			form.poleId = undefined;
			form.status = undefined;
			form.imei = undefined;
			form.phone = undefined;
			form.type = undefined;
			form.lensType = undefined;
			form.model = undefined;
			form.installDate = undefined;
			form.networkType = undefined;
			form.manufacturer = undefined;
			form.customName = '';
			form.code = '';
			form.protocol = 1;
		}

		return {
			state,
			open,
			close,
			form,
			rules,
			ruleFormRef,
			submitForm,
			towerPole,
			stateData,
			myGetRegionList,
			myGetRailLine,
			myGetPole
		};
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
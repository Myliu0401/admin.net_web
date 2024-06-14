<template>
	<el-dialog title="添加通道" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%"
		:before-close="close">
		<el-form v-loading="state.loading" ref="ruleFormRef" :model="form" :rules="rules" label-width="150px">
			<!-- <el-form-item label="通道名称" prop="name">
				<el-input v-model="form.name" />
			</el-form-item> -->

			<el-form-item label="自定义名称" prop="customName">
				<el-input v-model="form.customName" />
			</el-form-item>

			<el-form-item label="直属设备">
				<span>{{ state.deviceName }}</span>
			</el-form-item>

			<el-form-item label="备注">
				<el-input v-model="form.remark" />
			</el-form-item>

			<el-form-item label="code" prop="code">
				<el-input v-model="form.code" />
			</el-form-item>

			<el-form-item label="hasPtz">
				<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="form.hasPtz" />
			</el-form-item>

			<el-form-item label="排序">
				<el-input v-model="form.orderNo" type="number" style="width: 150px" min="1" />
			</el-form-item>

			<el-form-item label="是否启用">
				<el-switch inline-prompt active-text="启用" inactive-text="停用" v-model="form.status" />
			</el-form-item>

			<!-- <el-form-item label="上下线状态">
				<el-switch inline-prompt active-text="上线" inactive-text="离线" v-model="form.onOffStatus" />
			</el-form-item> -->

			<el-form-item label="设备故障状态">
				<el-switch inline-prompt active-text="正常" inactive-text="故障" v-model="form.okFailureStatus" />
			</el-form-item>

			<el-form-item label="是否启用定时截图">
				<el-switch inline-prompt active-text="启用" inactive-text="禁用" v-model="form.enableSnapshot" />
			</el-form-item>

			<el-form-item label="截图时段" v-if="form.enableSnapshot">
				<div class="itemBox">
					<el-time-picker v-model="snapStartTime" placeholder="起始时间" style="width: 150px" />至
					<el-time-picker v-model="snapEndTime" placeholder="终止时间" style="width: 150px" />
				</div>
			</el-form-item>

			<el-form-item label="截图间隔" v-if="form.enableSnapshot">
				<el-input v-model="form.snapInterval" style="width: 100px" placeholder="分钟" type="number" />
			</el-form-item>

			<el-form-item class="dialog-footer">
				<el-button @click="state.dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitForm(ruleFormRef)">确 定</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>


<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted  } from 'vue';
import { addChannel } from '/@/api/deviceManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
	props: {
		deviceList: {
			default() {
				return [];
			},
		},
	},

	setup(props, { emit }) {
		const ruleFormRef = ref(null);

		const snapStartTime = ref(new Date().setHours(0, 0, 0, 0));  // 创建新的日期对象

		const snapEndTime = ref(new Date().setHours(23, 59, 59, 0)); // 结束时间

		const state = reactive({
			dialogVisible: false,
			loading: false,
			deviceName: undefined,
			deviceId: undefined,
		});

		const form = reactive({
			name: undefined, // 通道名称
			onOffStatus: true, // 上下线状态
			okFailureStatus: false, // 设备故障状态
			remark: undefined, // 备注
			orderNo: undefined, // 排序
			deviceId: undefined, // 直属设备id
			status: undefined, // 通用状态
			enableSnapshot: false, // 是否启用定时截图
			snapInterval: 5, // 定时截图的间隔时间，分钟数
			code: undefined,
			hasPtz: false,
			customName: undefined, // 自定义名称
		});

		const rules = reactive({
			/* name: [{ required: true, message: '必须输入设备名称', trigger: 'blur' }], */
			customName: [{ required: true, message: '必须输入自定义名称', trigger: 'blur' }],
			code: [{ required: true, message: '必须输入code编码', trigger: 'blur' }]
		});

		// 开启弹窗
		function open(item) {
			state.dialogVisible = true;
			state.deviceName = item.deviceName;
			state.deviceId = item.deviceId;
		}

		// 关闭弹窗
		function close() {
			state.dialogVisible = false;

			wipeData();
		}

		// 转换日期格式
		function formatTime(date) {
		    date = typeof(date) === 'number' ? new Date(date) : date;
			var hours = date.getHours().toString().padStart(2, '0');
			var minutes = date.getMinutes().toString().padStart(2, '0');
			var seconds = date.getSeconds().toString().padStart(2, '0');
			return hours + ':' + minutes + ':' + seconds;
		}

		async function submitForm(ruleFormRef) {
		
			const bool = await ruleFormRef.validate();
			
			if (!bool) {
				return;
			}
			
			state.loading = true;
			try {
				await addChannel({
					deviceId: state.deviceId,
					//name: form.name,
					orderNo: form.orderNo,
					remark: form.remark,
					status: form.status ? 1 : 2,
					onOffStatus: form.onOffStatus ? 1 : 2,
					okFailureStatus: form.okFailureStatus ? 1 : 2,
					enableSnapshot: form.enableSnapshot,
					snapStartTime: snapStartTime.value ? formatTime(snapStartTime.value) : undefined,
					snapEndTime: snapEndTime.value ? formatTime(snapEndTime.value) : undefined,
					snapInterval: form.snapInterval,
					code: form.code,
					hasPtz: form.hasPtz,
					customName: form.customName,
				});

			} catch (err) {
				console.log(err)
				state.loading = false;
				return;
			}

			state.loading = false;
			ElMessage({
				message: '添加成功',
				type: 'success',
			});
			close();
			window.deviceChannelList();
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
			form.deviceId = undefined;
			form.status = undefined;
			form.enableSnapshot = true;
			form.snapInterval = undefined;
			form.code = undefined;
			form.hasPtz = false;
			form.customName = undefined;
		}

		return { ruleFormRef, state, form, rules, open, close, submitForm, snapStartTime, snapEndTime };
	},
};
</script>

<style lang="scss" scoped>
.itemBox {
	display: flex;
	align-items: center;
}
</style>
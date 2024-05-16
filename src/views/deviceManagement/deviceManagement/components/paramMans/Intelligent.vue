<template>
	<div class="Intelligent">
		<div class="my-4 flex items-center text-sm">
			<el-radio-group v-model="state.type" class="ml-4">
				<el-radio value="1" size="small">智能分析参数查询</el-radio>
				<el-radio value="2" size="small">智能分析参数配置</el-radio>
				<!-- <el-radio value="3" size="small">智能分析类型查询</el-radio> -->
			</el-radio-group>
		</div>

		<div class="item" v-if="state.type == '1'">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px; margin-right: 20px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<span class="itemBox_title">预置位号</span>
				<el-input v-model="state.preset" placeholder="255：查询所有预置位" style="width: 120px" :min="0" :max="255" type="number" />
				<el-button type="primary" :loading="state.loading" style="margin-left: 10px" @click="myIntelligentAnalysisParameter">查询</el-button>
			</div>

			<el-table :data="state.lists" max-height="45vh" style="width: 100%; margin-top: 20px">
				<el-table-column type="expand" align="center">
					<template #default="props">
						<el-table :data="props.row.alarmTypes">
							<el-table-column label="类型" prop="type" align="center">
								<template #default="scope">
									<el-text class="mx-1" size="small">{{ types[scope.row.type] }}</el-text>
								</template>
							</el-table-column>
							<el-table-column label="告警阈值" prop="threshold" align="center" />
						</el-table>

						<el-table :data="props.row.alarmAreas">
							<el-table-column type="expand" align="center">
								<template #default="props">
									<el-table :data="props.row.points">
										<el-table-column label="x" prop="x" align="center" />
										<el-table-column label="y" prop="y" align="center" />
									</el-table>
								</template>
							</el-table-column>
							<el-table-column label="启用标志" prop="enable" align="center" />
						</el-table>
					</template>
				</el-table-column>
				<el-table-column prop="id" label="预置位号" align="center" />
				<el-table-column prop="enable" label="启用标志" align="center">
					<template #default="scope">
						<el-text class="mx-1" size="small">{{ scope.row.enable ? '启用' : '禁用' }}</el-text>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div class="item" v-if="state.type == '2'" style="height: 53vh; overflow: auto">
			<div class="itemBox" style="width: 100%">
				<div class="itemBox_title">设备通道</div>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px; margin-right: 20px" @change="changeType">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox" style="width: 100%">
				<div class="itemBox_title">启用标志</div>
				<el-switch v-model="state1.enable" size="small" active-text="启用" inactive-text="禁用" />
			</div>
			<div class="itemBox" style="width: 100%">
				<div class="itemBox_title">预置位号</div>
				<el-input v-model="state1.id" placeholder="从1开始，无预置位传255" type="number" :min="1" :max="255" />
			</div>
			<div class="itemBox" style="width: 100%">
				<div class="itemBox_title">告警类型</div>
				<div style="position: relative; top: 3px">
					<el-icon
						@click="deleteAlarmTypeItem"
						size="20"
						style="margin-right: 15px"
						:color="state1.analyse.alarmTypes.length == 1 ? '#ccc' : ''"
						:style="{ cursor: state1.analyse.alarmTypes.length == 1 ? 'no-drop' : 'pointer' }"
						><ele-RemoveFilled
					/></el-icon>
					<el-icon size="20" style="cursor: pointer" @click="addAlarmTypeItem"><ele-CirclePlusFilled /></el-icon>
				</div>
			</div>
			<div style="width: 100%; border-bottom: 1px solid #ccc; padding-bottom: 10px" v-for="(item, index) in state1.analyse.alarmTypes" :key="index">
				<div class="itemBox" style="width: 100%">
					<div class="itemBox_title">枚举类型</div>
					<el-radio-group v-model="item.type" class="ml-4">
						<el-radio v-for="(value, key) in types1" :value="key" size="small" :key="key">{{ value }}</el-radio>
					</el-radio-group>
				</div>
				<div class="itemBox" style="width: 100%">
					<div class="itemBox_title">告警阈值</div>
					<el-input v-model="item.threshold" placeholder="取值范围[1 - 100]，告警识别的置信度大于设置的阈值，才上报告警" type="number" :min="1" :max="100" />
				</div>
			</div>

			<div class="itemBox" style="width: 100%">
				<div class="itemBox_title">告警区域</div>
				<div style="position: relative; top: 3px">
					<el-icon
						@click="deleteAlarmAreasItem"
						size="20"
						style="margin-right: 15px"
						:color="state1.analyse.alarmAreas.length == 1 ? '#ccc' : ''"
						:style="{ cursor: state1.analyse.alarmAreas.length == 1 ? 'no-drop' : 'pointer' }"
						><ele-RemoveFilled
					/></el-icon>
					<el-icon size="20" style="cursor: pointer" @click="addAlarmAreasItem"><ele-CirclePlusFilled /></el-icon>
				</div>
			</div>
			<div v-for="(item, index) in state1.analyse.alarmAreas" :key="index" style="width: 100%; border-bottom: 1px solid #ccc; padding-bottom: 10px">
				<div class="itemBox">
					<div class="itemBox_title">启用标志</div>
					<el-switch v-model="item.enable" size="small" active-text="启用" inactive-text="禁用" />
				</div>
				<div class="itemBox">
					<div class="itemBox_title">告警坐标</div>
					<div style="position: relative; top: 3px">
						<el-icon
							@click="deletePointsItem(index)"
							size="20"
							style="margin-right: 15px"
							:color="item.points.length == 1 ? '#ccc' : ''"
							:style="{ cursor: item.points.length == 1 ? 'no-drop' : 'pointer' }"
							><ele-RemoveFilled
						/></el-icon>
						<el-icon size="20" style="cursor: pointer" @click="addPointsItem(index)"><ele-CirclePlusFilled /></el-icon>
					</div>
				</div>
				<div v-for="(item1, index1) in item.points" :key="index1" style="padding-bottom: 7px; border-bottom: 1px dotted #ccc">
					<div class="itemBox">
						<div class="itemBox_title">x坐标</div>
						<el-input v-model="item1.x" placeholder="x坐标" type="number" />
					</div>
					<div class="itemBox">
						<div class="itemBox_title">y坐标</div>
						<el-input v-model="item1.y" placeholder="y坐标" type="number" />
					</div>
				</div>
			</div>
			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px" @click="mySetIntelligentAnalysisParameter">设置</el-button>
		</div>

		<!-- <div class="item" v-if="state.type == '3'" style="height: 50vh; overflow: auto">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state2.channelId" placeholder="请选择" style="width: 150px; margin-right: 20px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<el-button type="primary" :loading="state2.loading" style="margin-left: 10px" @click="myIntelligentAnalysisTypes">查询</el-button>
			</div>

			<el-table :data="state2.lists" v-loading="state2.loading" border style="width: 100%; margin-top: 15px" max-height="47vh">
				<el-table-column label="类型" align="center">
					<template #default="scope">
						<el-text class="mx-1" size="small">{{ types[scope.row] }}</el-text>
					</template>
				</el-table-column>
			</el-table>
		</div> -->
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, intelligentAnalysisParameter, setIntelligentAnalysisParameter, intelligentAnalysisTypes } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			channelId: '',
			preset: '',
			lists: [],
			type: '1',
			loading: false,
		});

		const channels = ref([]);

		const types = ref({
			1: '吊车',
			2: '塔吊',
			3: '推土机',
			4: '泵车',
			5: '挖掘机',
			6: '公共汽车',
			7: '卡车',
			8: '汽车',
			9: '其他车辆',
			20: '人员',
			21: '其他人员',
			30: '塑料布',
			31: '风筝',
			32: '鸟',
			33: '其他异物',
			40: '山火',
			41: '烟雾',
			50: '导线',
			51: '杆塔',
			52: '绝缘子',
			53: '金具',
			54: '其他',
			60: '车辆违停',
			61: '车辆逆行',
			62: '车辆拥堵',
			63: '人员穿越',
		});

		const state1 = reactive({
			channelId: '',
			analyse: {
				enable: false,
				id: '',
				alarmTypes: [
					{
						type: '',
						threshold: '',
					},
				],
				alarmAreas: [
					{
						enable: false,
						points: [
							{
								x: '',
								y: '',
							},
						],
					},
				],
			},
			loading: false,
		});

		const state2 = reactive({
			channelId: '',
			lists: [],
			loading: false,
		});

		const types1 = ref([]);

		onBeforeMount(() => {
			myGetChannelList();
		});

		// 获取设备通道列表
		async function myGetChannelList() {
			const res = await getChannelList({
				page: 1,
				pageSize: 100000,
				id: props.deviceID,
			});
			channels.value = res.data.result;
		}

		// 智能分析参数查询
		async function myIntelligentAnalysisParameter() {
			if (!(state.channelId + '') || !(state.preset + '')) {
				ElMessage({
					message: '必须选择通道和预置位号',
					type: 'warning',
				});
				return;
			}
			state.loading = true;
			const res = await intelligentAnalysisParameter({
				channelId: state.channelId,
				preset: state.preset,
			});
			state.loading = false;
			state.lists = res.data.result.analyses;
		}

		// 添加alarmTypes
		function addAlarmTypeItem() {
			state1.analyse.alarmTypes.push({
				type: '',
				threshold: '',
			});
		}

		// 删除alarmTypes
		function deleteAlarmTypeItem() {
			if (state1.analyse.alarmTypes.length === 1) {
				return;
			}
			state1.analyse.alarmTypes.splice(state1.analyse.alarmTypes.length - 1, 1);
		}

		// 添加alarmAreas
		function addAlarmAreasItem() {
			state1.analyse.alarmAreas.push({
				enable: false,
				points: [
					{
						x: '',
						y: '',
					},
				],
			});
		}

		// 删除alarmAreas
		function deleteAlarmAreasItem() {
			if (state1.analyse.alarmAreas.length === 1) {
				return;
			}
			state1.analyse.alarmAreas.splice(state1.analyse.alarmAreas.length - 1, 1);
		}

		// 添加points
		function addPointsItem(index) {
			state1.analyse.alarmAreas[index].points.push({
				x: '',
				y: '',
			});
		}

		// 删除points
		function deletePointsItem(index) {
			if (state1.analyse.alarmAreas[index].points.length === 1) {
				return;
			}
			state1.analyse.alarmAreas[index].points.splice(state1.analyse.alarmAreas[index].points.length - 1, 1);
		}

		// 配置
		async function mySetIntelligentAnalysisParameter() {
			if (!state1.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state1.loading = true;
			const res = await setIntelligentAnalysisParameter({
				channelId: state1.channelId,
				analyse: state1.analyse,
			});
			state1.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		// 类型查询
		async function myIntelligentAnalysisTypes() {
			if (!state2.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state2.loading = true;
			const res = await intelligentAnalysisTypes({
				channelId: state2.channelId,
			});
			state2.loading = false;
			state2.lists = res.data.result.types;
		}

		function changeType() {
			myIntelligentAnalysisTypes();
		}

		// 获取类型
		async function myIntelligentAnalysisTypes() {
			const res = await intelligentAnalysisTypes({
				channelId: state1.channelId,
			});
			types1.value = res.data.result.types;
		}

		return {
			state,
			channels,
			myIntelligentAnalysisParameter,
			types,
			state1,
			addAlarmTypeItem,
			deleteAlarmTypeItem,
			addAlarmAreasItem,
			deleteAlarmAreasItem,
			addPointsItem,
			deletePointsItem,
			mySetIntelligentAnalysisParameter,
			state2,
			myIntelligentAnalysisTypes,
			changeType,
			types1,
		};
	},
};
</script>


<style lang="scss" scoped>
.Intelligent {
	width: 100%;
	height: 100%;
	display: flex;
	flex-wrap: wrap;
	.item {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 20px;

		&:nth-child(1) {
			border-right: 1px solid #ccc;
		}

		&:nth-child(2) {
		}

		&:nth-child(3) {
			border-top: 1px solid #ccc;
			border-right: 1px solid #ccc;
		}

		&:nth-child(4) {
			border-top: 1px solid #ccc;
		}

		.title {
			font-size: 17px;
		}

		.itemBox {
			display: flex;
			align-items: center;
			margin-top: 10px;
			.itemBox_title {
				font-size: 12px;
				white-space: pre;
				margin-right: 15px;
			}
		}
	}
}
</style>
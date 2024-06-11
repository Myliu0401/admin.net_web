<template>
	<div class="Linkage">
		<div class="my-4 flex items-center text-sm">
			<el-radio-group v-model="state.type" class="ml-4">
				<el-radio value="1" size="small">联动参数查询</el-radio>
				<el-radio value="2" size="small">联动参数配置</el-radio>
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
				<el-button type="primary" :loading="state.loading" style="margin-left: 10px" @click="myLinkageParameter">查询</el-button>
			</div>

			<el-table :data="state.lists" v-loading="state.loading" border style="width: 100%; margin-top: 15px" max-height="47vh">
				<el-table-column prop="type" label="类型" align="center">
					<template #default="scope">
						<el-text class="mx-1" size="small">{{ types[scope.row.type] }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="action" label="联动动作" align="center">
					<template #default="scope">
						<el-text class="mx-1" size="small">{{ actions[scope.row.action] }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="argument1" label="参数1" align="center" />
				<el-table-column prop="argument2" label="参数2" align="center" />
			</el-table>
		</div>

		<div class="item" v-if="state.type == '2'" style="height: 47vh; overflow: auto">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px; margin-right: 20px" @change="changeType">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<span class="itemBox_title">预置位号</span>
				<el-input v-model="state1.preset" placeholder="255：查询所有预置位" style="width: 120px" :min="0" :max="255" type="number" />
			</div>
			<div class="itemBox" style="width: 100%; margin-top: 10px">
				<span class="itemBox_title">联动参数的集合</span>
				<el-icon @click="deleteItem" size="20" style="margin-right: 15px" :color="state1.links.length == 1 ? '#ccc' : ''" :style="{ cursor: state1.links.length == 1 ? 'no-drop' : 'pointer' }"
					><ele-RemoveFilled
				/></el-icon>
				<el-icon size="20" style="cursor: pointer" @click="addItem"><ele-CirclePlusFilled /></el-icon>
			</div>
			<div style="width: 100%">
				<div style="width: 100%; padding-bottom: 7px; border-bottom: 1px solid #ccc" v-for="(item, index) in state1.links" :key="index">
					<div class="itemBox" style="width: 100%">
						<span class="itemBox_title">类型</span>
						<el-radio-group v-model="item.type" class="ml-4">
							<el-radio v-for="(value, key) in types1" :value="key" size="small" :key="key">{{ types[value] || value}}</el-radio>
						</el-radio-group>
					</div>

					<div class="itemBox" style="width: 100%">
						<span class="itemBox_title">动作</span>
						<el-radio-group v-model="item.action" class="ml-4">
							<el-radio v-for="(value, key) in actions" :value="key" size="small" :key="key">{{ value }}</el-radio>
						</el-radio-group>
					</div>

					<div class="itemBox" style="width: 100%">
						<span class="itemBox_title">参数1</span>
						<el-input v-model="item.argument1" placeholder="参数1" />
					</div>

					<div class="itemBox" style="width: 100%">
						<span class="itemBox_title">参数2</span>
						<el-input v-model="item.argument2" placeholder="参数1" />
					</div>
				</div>
			</div>

			<el-button type="primary" :loading="state1.loading" style="margin-top: 10px" @click="mySetLinkageParameter">设置</el-button>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, linkageParameter, setLinkageParameter, intelligentAnalysisTypes } from '/@/api/allocation/index.js';
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

		const actions = ref({
			0: '无联动，取消联动',
			1: '联动上传录像',
			2: '联动上传拍照',
			3: '联动I/O输出',
		});

		const state1 = reactive({
			channelId: '',
			preset: '',
			links: [
				{
					type: '',
					action: '',
					argument1: '',
					argument2: '',
				},
			],
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

		// 联动参数查询
		async function myLinkageParameter() {
			if (!state.channelId || !state.preset) {
				ElMessage({
					message: '必须选择通道和预置位号',
					type: 'warning',
				});
				return;
			}
			state.loading = true;
			const res = await linkageParameter({
				channelId: state.channelId,
				preset: state.preset,
			});
			state.loading = false;
			state.lists = res.data.result.links;
		}

		// 删除项
		function deleteItem() {
			if (state1.links.length === 1) {
				return;
			}
			state1.links.splice(state1.links.length - 1, 1);
		}

		// 添加项
		function addItem() {
			state1.links.push({
				type: '',
				action: '',
				argument1: '',
				argument2: '',
			});
		}

		// 联动参数配置
		async function mySetLinkageParameter() {
			if (!state1.channelId || !state1.preset) {
				ElMessage({
					message: '必须选择通道和预置位号',
					type: 'warning',
				});
				return;
			}
			state1.loading = true;
			const res = await setLinkageParameter({
				channelId: state1.channelId,
				preset: state1.preset == '' ? undefined : +state1.preset,
				links: state1.links.map((item) => {
					return {
						type: item.type == '' ? undefined : +item.type,
						action: item.action == '' ? undefined : +item.action,
						argument1: item.argument1 == '' ? undefined : +item.argument1,
						argument2: item.argument2 == '' ? undefined : +item.argument2,
					};
				}),
			});
			state1.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
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
			myLinkageParameter,
			types,
			types1,
			actions,
			state1,
			addItem,
			deleteItem,
			mySetLinkageParameter,
			changeType,
		};
	},
};
</script>


<style lang="scss" scoped>
.Linkage {
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
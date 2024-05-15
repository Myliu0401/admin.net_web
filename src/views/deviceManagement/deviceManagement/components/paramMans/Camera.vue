<template>
	<div class="Camera">
		<div class="my-4 flex items-center text-sm">
			<el-radio-group v-model="state.type" class="ml-4">
				<el-radio value="1" size="small">摄像机巡航参数查询</el-radio>
				<el-radio value="2" size="small">摄像机巡航参数设置</el-radio>
				<el-radio value="3" size="small">摄像机巡检参数查询</el-radio>
				<el-radio value="4" size="small">摄像机巡检参数设置</el-radio>
				<el-radio value="5" size="small">摄像机巡检策略查询</el-radio>
				<el-radio value="6" size="small">摄像机巡检策略设置</el-radio>
			</el-radio-group>
		</div>
		<div class="item" v-if="state.type == 1">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-button type="primary" style="margin-left: 15px" :loading="state.loading" @click="myCruiseParameter">查询</el-button>
			</div>

			<div style="width: 100%">
				<el-table :data="state.lists" v-loading="state.loading" :border="parentBorder" style="width: 100%; margin-top: 15px" max-height="50vh">
					<el-table-column type="expand">
						<template #default="props">
							<div m="4">
								<el-table :data="props.row.cruisePoint" :border="childBorder">
									<el-table-column label="巡航点序号" prop="id" />
									<el-table-column label="预置位号" prop="preset" />
									<el-table-column label="巡航停留时间" prop="dwellTime" />
									<el-table-column label="巡航速率" prop="cruiseSpeed" />
								</el-table>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="id" label="巡航组号" align="center" />
				</el-table>
			</div>
		</div>

		<div class="item" v-if="state.type == 2">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">操作类别</span>
				<el-radio-group v-model="state1.action" class="ml-4">
					<el-radio value="1" size="small">添加巡航点</el-radio>
					<el-radio value="2" size="small">删除巡航点</el-radio>
					<el-radio value="3" size="small">修改巡航点</el-radio>
					<el-radio value="4" size="small">删除巡航组</el-radio>
				</el-radio-group>
			</div>
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title" style="width: 80px">巡航组号</span>
				<el-input v-model="state1.groupId" placeholder="取值范围1-16" type="number" :min="1" :max="16" />
			</div>
			<template v-if="state1.action == '' || state1.action != 4">
				<div class="itemBox" style="width: 100%">
					<span class="itemBox_title" style="width: 80px">巡航点序号</span>
					<el-input v-model="state1.pointId" placeholder="取值范围1-32" type="number" :min="1" :max="32" />
				</div>
				<div class="itemBox" style="width: 100%">
					<span class="itemBox_title" style="width: 80px">预置位号</span>
					<el-input v-model="state1.preset" placeholder="取值范围1-254" type="number" :min="1" :max="254" />
				</div>
				<div class="itemBox" style="width: 100%">
					<span class="itemBox_title" style="width: 80px">巡航停留时间</span>
					<el-input v-model="state1.dwellTime" placeholder="取值范围3-255" type="number" :min="3" :max="255" />
				</div>
				<div class="itemBox" style="width: 100%">
					<span class="itemBox_title" style="width: 80px">巡航速率</span>
					<el-input v-model="state1.cruiseSpeed" placeholder="取值范围1-100,值越小，速率越慢，值越大，速率越快" type="number" :min="1" :max="100" />
				</div>
			</template>
			<el-button type="primary" style="margin-top: 15px" :loading="state1.loading" @click="mySetCruiseParameter">设置</el-button>
		</div>

		<div class="item" v-if="state.type == 3">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state2.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-button type="primary" style="margin-left: 15px" :loading="state2.loading" @click="myInspectParameter">查询</el-button>
			</div>
			<el-table :data="state2.lists" v-loading="state2.loading" border style="width: 100%; margin-top: 15px" max-height="50vh">
				<el-table-column prop="id" label="巡检组号" align="center">
					<template #default="scope">
						<el-text class="mx-1" size="small">{{ scope.row.id }}</el-text>
					</template>
				</el-table-column>
				<el-table-column prop="inspectIdCount" label="巡检点数量" align="center" >
					<template #default="scope">
						<el-text class="mx-1" size="small">{{ scope.row.inspectIdCount }}</el-text>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div class="item" v-if="state.type == 4">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state3.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">操作类别</span>
				<el-radio-group v-model="state3.action" class="ml-4">
					<el-radio value="1" size="small">添加巡航点</el-radio>
					<el-radio value="2" size="small">删除巡航点</el-radio>
					<el-radio value="3" size="small">修改巡航点</el-radio>
					<el-radio value="4" size="small">删除巡航组</el-radio>
				</el-radio-group>
			</div>
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title" style="width: 80px">巡检组号</span>
				<el-input v-model="state3.groupId" placeholder="取值范围1-4" type="number" :min="1" :max="4" />
			</div>
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title" style="width: 80px">巡检点序号</span>
				<el-input v-model="state3.pointId" placeholder="取值范围1-64" type="number" :min="1" :max="64" />
			</div>
			<el-button type="primary" style="margin-top: 15px" :loading="state3.loading" @click="mySetInspectParameter">设置</el-button>
		</div>

		<div class="item" v-if="state.type == 5">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state4.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-button type="primary" style="margin-left: 15px" :loading="state4.loading" @click="myInspectStrategyParameter">查询</el-button>
			</div>
			<el-table :data="state2.lists" v-loading="state4.loading" border style="width: 100%; margin-top: 15px" max-height="50vh">
				<el-table-column prop="id" label="检组号" align="center" />
				<el-table-column prop="enable" label="巡检使能" align="center" />
				<el-table-column prop="times" label="巡检次数" align="center" />
			</el-table>
		</div>

		<div class="item" v-if="state.type == 6">
			<div class="itemBox" style="width: 100%">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state5.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>

			<div class="" style="margin-top: 20px; width: 100%">
				<el-icon
					size="20"
					style="margin-right: 15px"
					:style="{ cursor: state5.strategys.length === 1 ? 'no-drop' : 'pointer' }"
					:color="state5.strategys.length === 1 ? '#ccc' : ''"
					@click="deleteItem"
					><ele-RemoveFilled
				/></el-icon>
				<el-icon size="20" style="cursor: pointer" @click="addItem"><ele-CirclePlusFilled /></el-icon>
			</div>
			<div style="width: 100%; height: 35vh; overflow: auto">
				<div v-for="(item, index) in state5.strategys" :key="index" style="border-bottom: 1px solid #ccc; padding-bottom: 10px">
					<div class="itemBox">
						<span class="itemBox_title" style="width: 70px">检组号</span>
						<el-input v-model="item.id" placeholder="巡检组号码，1-4" style="width: 100px" :min="1" :max="4" type="number" />
					</div>
					<div class="itemBox">
						<span class="itemBox_title" style="width: 70px">巡检次数</span>
						<el-input v-model="item.times" placeholder="巡检次数，1-16" style="width: 100px" :min="1" :max="16" type="number" />
					</div>
					<div class="itemBox">
						<span class="itemBox_title" style="width: 70px">巡检使能</span>
						<el-switch v-model="item.enable" size="small" active-text="开" inactive-text="关" />
					</div>
					<div class="itemBox">
						<span class="itemBox_title" style="width: 70px">时</span>
						<el-input v-model="item.start.hour" placeholder="时" style="width: 100px" :min="1" :max="24" type="number" />
					</div>
					<div class="itemBox">
						<span class="itemBox_title" style="width: 70px">分</span>
						<el-input v-model="item.start.minute" placeholder="分" style="width: 100px" :min="1" :max="60" type="number" />
					</div>
					<div class="itemBox">
						<span class="itemBox_title" style="width: 70px">秒</span>
						<el-input v-model="item.start.second" placeholder="秒" style="width: 100px" :min="1" :max="60" type="number" />
					</div>
				</div>
				<el-button type="primary" style="margin-top: 15px; margin-left: 50%" :loading="state5.loading" @click="mySetInspectStrategyParameter">设置</el-button>
			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, cruiseParameter, setCruiseParameter, inspectParameter, setInspectParameter, inspectStrategyParameter, setInspectStrategyParameter } from '/@/api/allocation/index.js';
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
			streamType: '',
			lists: [],
			type: '1',
			loading: false,
		});
		const parentBorder = ref(false);
		const childBorder = ref(false);

		const state1 = reactive({
			channelId: '',
			action: '',
			groupId: '',
			pointId: '',
			preset: '',
			dwellTime: '',
			cruiseSpeed: '',
			loading: false,
		});

		const state2 = reactive({
			channelId: '',
			lists: [],
			loading: false,
		});

		const state3 = reactive({
			channelId: '',
			loading: false,
			action: '',
			groupId: '',
			pointId: '',
		});

		const state4 = reactive({
			channelId: '',
			loading: false,
			lists: [],
		});

		const state5 = reactive({
			channelId: '',
			loading: false,
			strategys: [
				{
					id: '',
					enable: false,
					times: '',
					start: {
						hour: '',
						minute: '',
						second: '',
					},
				},
			],
		});

		const channels = ref([]);

		onBeforeMount(() => {
			myGetChannelList();
		});

		// 删除项
		function deleteItem() {
			if (state5.strategys.length === 1) {
				return;
			}
			state5.strategys.splice(state5.strategys.length - 1, 1);
		}

		// 添加项
		function addItem() {
			state5.strategys.push({
				id: '',
				enable: false,
				times: '',
				start: {
					hour: '',
					minute: '',
					second: '',
				},
			});
		}

		// 获取设备通道列表
		async function myGetChannelList() {
			const res = await getChannelList({
				page: 1,
				pageSize: 100000,
				id: props.deviceID,
			});
			channels.value = res.data.result;
		}

		// 查询
		async function myCruiseParameter() {
			if (!state.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state.loading = true;
			const res = await cruiseParameter({
				channelId: state.channelId,
			});
			state.loading = false;
			state.lists = res.data.result.cruiseGroup;
		}

		// 设置
		async function mySetCruiseParameter() {
			if (!state1.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state1.loading = true;
			const res = await setCruiseParameter({
				channelId: state1.channelId,
				action: state1.action == '' ? undefined : +state1.action,
				groupId: state1.groupId == '' ? undefined : +state1.groupId,
				pointId: state1.pointId == '' ? undefined : +state1.pointId,
				preset: state1.preset == '' ? undefined : +state1.preset,
				dwellTime: state1.dwellTime == '' ? undefined : +state1.dwellTime,
				cruiseSpeed: state1.cruiseSpeed == '' ? undefined : +state1.cruiseSpeed,
			});
			state1.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		// 巡检查询
		async function myInspectParameter() {
			if (!state2.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state2.loading = true;
			const res = await inspectParameter({ channelId: state2.channelId });
			state2.loading = false;
			state2.lists = res.data.result.inspectGroup;
		}

		//  巡检设置
		async function mySetInspectParameter() {
			if (!state3.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state2.loading = false;
			const res = await setInspectParameter({ channelId: state3.channelId, action: state3.action, groupId: state3.groupId, pointId: state3.pointId });
			state2.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		// 巡检策略查询
		async function myInspectStrategyParameter() {
			if (!state4.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			}
			state4.loading = true;
			const res = await inspectStrategyParameter({ channelId: state4.channelId });
			state4.loading = false;
			state4.lists = res.data.result.strategys;
		}

		// 巡检策略设置
		async function mySetInspectStrategyParameter() {
			state5.loading = true;
			const res = await setInspectStrategyParameter({
				channelId: state5.channelId,
				strategys: state5.strategys,
			});
			state5.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		return {
			state,
			channels,
			state3,
			state1,
			state2,
			state4,
			state5,
			myCruiseParameter,
			mySetCruiseParameter,
			parentBorder,
			childBorder,
			myInspectParameter,
			mySetInspectParameter,
			myInspectStrategyParameter,
			deleteItem,
			addItem,
			mySetInspectStrategyParameter,
		};
	},
};
</script>


<style lang="scss" scoped>
.Camera {
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
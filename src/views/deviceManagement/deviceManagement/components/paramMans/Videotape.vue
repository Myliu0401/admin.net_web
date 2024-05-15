<template>
	<div class="Videotape">
		<div class="my-4 flex items-center text-sm">
			<el-radio-group v-model="state.type" class="ml-4">
				<el-radio value="1" size="small">录像状态</el-radio>
				<el-radio value="2" size="small">录像策略查询</el-radio>
				<el-radio value="3" size="small">录像策略设置</el-radio>
			</el-radio-group>
		</div>
		<div class="item" v-if="state.type == 1">
			<span class="title">通道录像状态</span>
			<div class="itemBox">
				<span class="itemBox_title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">类型</span>
				<el-select v-model="state.streamType" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="itemBox">
				<span class="itemBox_title">录像状态</span>
				<el-switch style="width: 152px" v-model="state.status" size="small" active-text="开" inactive-text="关" />
			</div>
			<el-button type="primary" :loading="state.loading" style="margin-top: 10px" @click="myVideoRecordingStatusQuery">查询</el-button>
		</div>

		<div class="item" v-if="state.type == 2">
			<div style="width: 100%; display: flex; align-items: flex-start">
				<span style="font-size: 12px; margin-right: 10px">设备通道</span>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px; margin-right: 15px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<span style="font-size: 12px; margin-right: 10px">类型</span>
				<el-select v-model="state1.streamType" placeholder="请选择" style="width: 150px; margin-right: 15px">
					<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-button type="primary" :loading="state1.loading" @click="myRecordStrategyParameter">查询</el-button>
			</div>
			<el-table :data="state1.lists" v-loading="state1.loading" border style="width: 100%; margin-top: 15px" max-height="50vh">
				<el-table-column prop="id" label="id" align="center" />
				<el-table-column prop="action" label="动作类别" align="center" />
				<el-table-column  label="时" align="center" >
                    <template #default="scope">
						<el-text class="mx-1" size="small">{{ scope.row.start.hour }}</el-text>
					</template>
                </el-table-column>
				<el-table-column label="分" align="center" >
                    <template #default="scope">
						<el-text class="mx-1" size="small">{{ scope.row.start.minute }}</el-text>
					</template>
                </el-table-column>
				<el-table-column label="持续时间" align="center" >
                    <template #default="scope">
						<el-text class="mx-1" size="small">{{ scope.row.start.duration }}</el-text>
					</template>
                </el-table-column>
			</el-table>
		</div>

		<div class="item" v-if="state.type == 3">
			<div style="width: 100%; display: flex; align-items: flex-start">
				<span style="font-size: 12px; margin-right: 10px">设备通道</span>
				<el-select v-model="state2.channelId" placeholder="请选择" style="width: 150px; margin-right: 15px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>

				<span style="font-size: 12px; margin-right: 10px">类型</span>
				<el-select v-model="state2.streamType" placeholder="请选择" style="width: 150px; margin-right: 15px">
					<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>
			<div class="" style="width: 100%">
				<div class="" style="margin-top: 20px">
					<el-icon
						size="20"
						style="margin-right: 15px"
						:style="{ cursor: state2.strategys.length === 1 ? 'no-drop' : 'pointer' }"
						:color="state2.strategys.length === 1 ? '#ccc' : ''"
						@click="deleteItem"
						><ele-RemoveFilled
					/></el-icon>
					<el-icon size="20" style="cursor: pointer" @click="addItem"><ele-CirclePlusFilled /></el-icon>
				</div>
				<div style="height: 45vh; overflow: auto; padding-bottom: 20px">
					<div v-for="(item, index) in state2.strategys" :key="index" style="border-bottom: 1px solid #ccc; padding-bottom: 10px">
						<div class="itemBox">
							<span class="itemBox_title"> 动作类别 </span>
							<el-radio-group v-model="item.action" class="ml-4">
								<el-radio value="0" size="small">调用预置位</el-radio>
								<el-radio value="1" size="small">调用巡航</el-radio>
								<el-radio value="2" size="small">调用巡检</el-radio>
							</el-radio-group>
						</div>
						<div class="itemBox">
							<span class="itemBox_title"> id </span>
							<el-radio-group v-model="item.id" class="ml-4">
								<el-radio value="0" size="small">置位号</el-radio>
								<el-radio value="1" size="small">航组号</el-radio>
								<el-radio value="2" size="small">检组号</el-radio>
							</el-radio-group>
						</div>
						<div class="itemBox">
							<span class="itemBox_title"> 时 </span>
							<el-input v-model="item.start.hour" placeholder="时" style="width: 100px" :min="1" :max="24" type="number" />
						</div>
						<div class="itemBox">
							<span class="itemBox_title"> 分 </span>
							<el-input v-model="item.start.minute" placeholder="分" style="width: 100px" :min="1" :max="60" type="number" />
						</div>
						<div class="itemBox">
							<span class="itemBox_title"> 秒 </span>
							<el-input v-model="item.start.second" placeholder="秒" style="width: 100px" :min="1" :max="60" type="number" />
						</div>
						<div class="itemBox">
							<span class="itemBox_title"> 持续时间 </span>
							<el-input v-model="item.start.duration" placeholder="秒" style="width: 100px" :min="1" :max="60" type="number" />
						</div>
					</div>

                    <el-button type="primary" :loading="state2.loading" style="margin-top: 20px;" @click="mySetRecordStrategyParameter">配置</el-button>
				</div>


			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, videoRecordingStatusQuery, recordStrategyParameter, setRecordStrategyParameter } from '/@/api/allocation/index.js';
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
			status: false,
			type: '1',
			loading: false,
		});

		const state1 = reactive({
			channelId: '',
			streamType: '',
			lists: [],
			loading: false,
		});

		const state2 = reactive({
			channelId: '',
			streamType: '',
			strategys: [
				{
					action: '',
					id: '',
					start: {
						hour: '',
						minute: '',
						second: '',
					},
					duration: '',
				},
			],
			loading: false,
		});

		const channels = ref([]);
		const types = ref([
			{
				id: 0,
				name: 'Main',
			},
			{
				id: 1,
				name: 'Second',
			},
			{
				id: 2,
				name: 'Third',
			},
		]);

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

		// 通道录像状态查询
		async function myVideoRecordingStatusQuery() {
            if (!(state.channelId + '') || !(state.streamType + '')) {
				ElMessage({
					message: '必须选择通道和类型',
					type: 'warning',
				});
				return;
			}
			state.loading = true;
			const res = await videoRecordingStatusQuery({
				channelId: state.channelId,
				streamType: state.streamType,
			});
			state.loading = false;
			state.status = res.data.result;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		}

		// 录像策略查询
		async function myRecordStrategyParameter() {
            if (!(state1.channelId + '') || !(state1.streamType + '')) {
				ElMessage({
					message: '必须选择通道和类型',
					type: 'warning',
				});
				return;
			}
			state1.loading = true;
			const res = await recordStrategyParameter({
				channelId: state1.channelId,
				streamType: state1.streamType,
			});
			state1.loading = false;
			state1.lists = res.data.result.strategys;
			ElMessage({
				message: '查询成功',
				type: 'success',
			});
		};


        // 设置
        async function mySetRecordStrategyParameter(){
            if (!(state2.channelId + '') || !(state2.streamType + '')) {
				ElMessage({
					message: '必须选择通道和类型',
					type: 'warning',
				});
				return;
			}
            state2.loading = true;
            const res = await setRecordStrategyParameter({
				channelId: state2.channelId,
				streamType: state2.streamType,
                strategys: state2.strategys
			});
            state2.loading = false;
            ElMessage({
				message: '配置成功',
				type: 'success',
			});
        };

		// 删除
		function deleteItem() {
			if (state2.strategys.length === 1) {
				return;
			}
			state2.strategys.splice(state2.strategys.length - 1, 1);
		}

		// 添加
		function addItem() {
			state2.strategys.push({
				action: '',
				id: '',
				start: {
					hour: '',
					minute: '',
					second: '',
				},
				duration: '',
			});
		}

		return {
			state,
			channels,
			types,
			state1,
			state2,
			myVideoRecordingStatusQuery,
			myRecordStrategyParameter,
            mySetRecordStrategyParameter,
			deleteItem,
			addItem,
		};
	},
};
</script>


<style lang="scss" scoped>
.Videotape {
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
				min-width: 70px;
			}
		}
	}
}
</style>
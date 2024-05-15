<template>
	<div class="ShortVideo">
		<div class="my-4 flex items-center text-sm">
			<el-radio-group v-model="state.type1" class="ml-4">
				<el-radio value="1" size="small">拍摄</el-radio>
				<el-radio value="2" size="small">获取短视频</el-radio>
			</el-radio-group>
		</div>
		<div v-show="state.type1 == 1" class="itemOption" style="margin-top: 20px">
			<span class="title">设备通道</span>
			<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px; margin-right: 15px" @change="change">
				<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>

			<span class="title">类型</span>
			<el-select v-model="state.type" placeholder="请选择" style="width: 150px; margin-right: 15px" @change="change">
				<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>

			<span class="title">拍摄时长:秒</span>
			<el-input v-model="state.duration" style="width: 100px; margin-right: 15px" placeholder="单位：秒" />
			<el-button type="primary" :loading="state.loading" @click="myTakeShortVideo">拍摄</el-button>
		</div>

		<div v-show="state.type1 == 2">
			<div class="itemOption" style="margin-top: 15px">
				<span class="title">设备通道</span>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px; margin-right: 15px" @change="change">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-date-picker v-model="state1.timers" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="margin-right: 10px" />

				<el-tree-select v-model="state1.value" :data="state1.trees" filterable check-strictly :render-after-expand="false" style="width: 150px" />
				<el-button type="primary" style="margin-left: 10px" :loading="state.loading" @click="mySysShortVideo">查询</el-button>
			</div>

			<el-table :data="state.lists" v-loading="state1.loading" border style="width: 100%; margin-top: 15px" max-height="44vh">
				<el-table-column prop="id" label="短视频Id" align="center" />
				<el-table-column prop="fileSize" label="文件大小，单位字节" align="center" />
				<el-table-column prop="action" label="操作" align="center" width="100">
					<template #default="scope">
						<el-text class="mx-1" size="small" type="primary" style="cursor: pointer" @click="openPop(scope.row)">播放</el-text>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				v-model:currentPage="state1.page"
				v-model:page-size="state1.pageSize"
				:total="state1.total"
				:page-sizes="[10]"
				small
				size="small"
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</div>

		<!-- <div style="margin-top: 20px; height: 50vh;" v-loading="state.loading">
             <video controls style="width: 100%; height: 100%;" v-if="state.src"></video>
        </div> -->

	<el-dialog title="播放视频" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%" :before-close="closePop">
		<video controls style="width: 100%; height: 50vh;" v-if="state.src"></video>
	</el-dialog>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, takeShortVideo, sysShortVideo } from '/@/api/allocation/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getChannelTree } from '/@/api/imageManagement/index.js';
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
			duration: '',
			loading: false,
			src: '',
			lists: [],
			type1: '1',

			dialogVisible: false
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

		const state1 = reactive({
			channelId: '',
			timers: [],
			value: '',
			page: 1,
			pageSize: 10,
			loading: false,
			trees: [],
			lists: [],
			total: 0,
		});

		onBeforeMount(() => {
			myGetChannelList();

			getTree();
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

		// 获取拍摄视频
		async function myTakeShortVideo() {
			state.loading = true;
			let res = null;
			try {
				res = await takeShortVideo({
					channelId: state.channelId,
					streamType: state.type,
					duration: state.duration,
				});
			} catch (err) {
				state.loading = false;
				return;
			}

			state.loading = false;
			state.src = res.data.result;
			ElMessage({
				message: '拍摄成功',
				type: 'success',
			});
		}

		// 获取树形
		async function getTree() {
			const res = await getChannelTree();
			zhuanhuan(res.data.result);
			state1.trees = res.data.result;
		}

		function zhuanhuan(data = []) {
			for (let i = 0; i < data.length; i++) {
				data[i] = {
					...data[i],
					value: data[i].id,
					label: data[i].name,
				};

				if (data[i].children) {
					zhuanhuan(data[i].children);
				}
			}
		}

		async function mySysShortVideo() {
			if (!state1.timers.length || !state1.channelId) {
				ElMessage({
					message: '必须选择时间段和通道',
					type: 'warning',
				});
				return;
			}
			state1.loading = true;
			let obj = state1.value ? geItem(state1.trees, state1.value) : undefined;
			let res = null;
			try {
				res = await sysShortVideo({
					channelId: state1.channelId,
					page: state1.page,
					pageSize: state1.pageSize,
					startTime: state1.timers[0].toISOString(),
					endTime: state1.timers[1].toISOString(),
					treeNode: !obj
						? undefined
						: {
								id: obj.id,
								type: obj.type,
								extId: obj.extId,
						  },
				});
			} catch (err) {
				state1.loading = false;
				return;
			}

			state1.loading = false;
			state1.lists = res.data.result.items;
			state1.total = res.data.result.total;
		}

		function geItem(data = [], id) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id === id) {
					return data[i];
				} else if (data[i].children) {
					const item = geItem(data[i].children, id);
					if (item) {
						return item;
					}
				}
			}
		}

		function handleSizeChange(num) {
			state1.pageSize = num;
			mySysShortVideo();
		}

		function handleCurrentChange(index) {
			state1.pageSize = index;
			mySysShortVideo();
		};


		function openPop(item){
            state.src = item.filePath;
		};

		function closePop(){
			state1.dialogVisible = false; 
			state.src = null;
		}
		return { state, state1, channels, types, myTakeShortVideo, mySysShortVideo, handleSizeChange, handleCurrentChange, openPop, closePop };
	},
};
</script>


<style lang="scss" scoped>
.ShortVideo {
	.itemOption {
		.title {
			font-size: 13px;
			margin-right: 10px;
		}
	}
}
</style>
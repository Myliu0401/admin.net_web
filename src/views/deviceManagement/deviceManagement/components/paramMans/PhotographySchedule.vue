<template>
	<div class="photographySchedule">
		<div class="my-4 flex items-center text-sm">
			<el-radio-group v-model="state.type" class="ml-4">
				<el-radio value="1" size="small">拍照时间表查询</el-radio>
				<el-radio value="2" size="small">拍照时间表配置</el-radio>
			</el-radio-group>
		</div>

		<div v-if="state.type == '1'" style="margin-top: 15px">
			<div class="itemOption">
				<span class="title">设备通道</span>
				<el-select v-model="state.channelId" placeholder="请选择" style="width: 150px" @change="change">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>

			<el-table :data="state.lists" v-loading="state.loading" border style="width: 100%; margin-top: 15px" max-height="45vh">
				<el-table-column prop="hour" label="时" align="center" />
				<el-table-column prop="minute" label="分" align="center" />
				<el-table-column prop="preset" label="预置位号" align="center" />
			</el-table>
		</div>

		<div v-if="state.type == '2'" style="margin-top: 15px">
			<div class="itemOption">
				<span class="title">设备通道</span>
				<el-select v-model="state1.channelId" placeholder="请选择" style="width: 150px">
					<el-option v-for="item in channels" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</div>

			<div class="itemBox" style="display: flex; margin-top: 20px; margin-bottom: 20px;">
				<span class="itemBox_title">定时拍照设置的集合</span>
				<el-icon
					@click="deleteItem"
					size="20"
					style="margin-right: 15px; margin-left: 20px"
					:color="state1.photos.length == 1 ? '#ccc' : ''"
					:style="{ cursor: state1.photos.length == 1 ? 'no-drop' : 'pointer' }"
					><ele-RemoveFilled
				/></el-icon>
				<el-icon size="20" style="cursor: pointer" @click="addItem"><ele-CirclePlusFilled /></el-icon>
			</div>

			<div style=" height: 40vh; overflow: auto;">
				<div v-for="item,index in state1.photos" :key="index" style="padding: 10px 0px;  border-bottom: 1px solid #ccc;">
					<div class="itemBox" style="display: flex; align-items: center; margin-bottom: 10px;">
						<span class="itemBox_title" style="font-size: 13px; width: 70px;">时</span>
						<el-input v-model="item.hour" placeholder="时" style="width: 120px;" size="small" type="number" :min="1" :max="24" />
					</div>
					<div class="itemBox" style="display: flex; align-items: center; margin-bottom: 10px;">
						<span class="itemBox_title" style="font-size: 13px; width: 70px;">分</span>
						<el-input v-model="item.minute" placeholder="分"  style="width: 120px;" size="small" type="number" :min="1" :max="60" />
					</div>
					<div class="itemBox" style="display: flex; align-items: center; margin-bottom: 10px;">
						<span class="itemBox_title" style="font-size: 13px; width: 70px;">秒</span>
						<el-input v-model="item.preset" placeholder="秒" style="width: 120px;" size="small" type="number" :min="1" :max="60" />
					</div>
				</div>

				<div style="display: flex;justify-content: center;">
					<el-button type="primary" style="margin-top: 10px;" :loading="state1.loading" @click="mySetPhotoTimeTable">设置</el-button>
				</div>
				
			</div>
		</div>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelList, getPhotographySchedule, setPhotoTimeTable } from '/@/api/allocation/index.js';
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
			loading: false,
			type: '1',
			lists: [],
		});

		const state1 = reactive({
			loading: false,
			channelId: '',
			photos: [
				{
					hour: '',
					minute: '',
					preset: '',
				},
			],
		});

		const channels = ref([]);

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
			state.channelId = res.data.result[0].id;
			myGetPhotographySchedule();
		}

		// 切换通道
		function change(id) {
			myGetPhotographySchedule();
		}

		// 获取拍照时间表
		async function myGetPhotographySchedule() {
			state.loading = true;
			const res = await getPhotographySchedule({ channelId: state.channelId });
			state.loading = false;
			state.lists = res.data.result.photos;
		}

		// 删除项
		function deleteItem() {
			if (state1.photos.length === 1) {
				return;
			}
			state1.photos.splice(state1.photos.length - 1, 1);
		}

		// 添加项
		function addItem() {
			state1.photos.push({
				hour: '',
				minute: '',
				preset: '',
			});
		};


		// 设置
		async function mySetPhotoTimeTable(){
			if (!state1.channelId) {
				ElMessage({
					message: '必须选择通道',
					type: 'warning',
				});
				return;
			};
			state1.loading = true;
			const res = await setPhotoTimeTable({
				channelId: state1.channelId,
				photos: state1.photos
			});
			state1.loading = false;
			ElMessage({
				message: '设置成功',
				type: 'success',
			});
		}

		return { state, channels, change, state1, deleteItem, addItem, mySetPhotoTimeTable };
	},
};
</script>


<style lang="scss" scoped>
.photographySchedule {
	.itemOption {
		.title {
			font-size: 13px;
			margin-right: 10px;
		}
	}
}
</style>
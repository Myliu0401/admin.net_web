<template>
	<div class="videoRecordingManagement">
		<div class="videoRecordingManagement_leftNavs">
			<div class="searchArea">
				<el-input v-model="treeData.keyword" placeholder="搜索" suffix-icon="el-icon-search" @change="search"></el-input>
			</div>

			<div class="accordion">
				<el-tree :key="treeData.myKey" :data="treeData.myTrees" :props="treeData.defaultProps" :highlight-current="true" accordion @node-click="handleNodeClick">
					<template v-slot="{ node, data }">
						<p class="custom-tree-node" :title="data.code" style="width: 100%">
							{{ data.name }}
						</p>
					</template>
				</el-tree>
			</div>
		</div>

		<div class="mainContent">
			<div class="selectionArea">
				<el-date-picker
					style="margin-right: 10px; margin-top: 6px"
					size="small"
					v-model="listData.times"
					type="datetimerange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
				/>

				<el-button size="small" style="margin-right: 10px; margin-left: 0px; margin-top: 6px" @click="conditionSearch">搜索</el-button>
			</div>

			<div class="videoRecordingManagement_contentBox" :class="{ tableType: true }">
				<el-table :data="listData.lists" max-height="70vh" border style="width: 100%" v-loading="listData.loading">
					<el-table-column prop="id" label="告警id" width="70" align="center"> </el-table-column>
					<el-table-column prop="channelId" label="通道id" align="center"> </el-table-column>
					<el-table-column prop="preset" label="预置位" align="center"> </el-table-column>
					<el-table-column prop="alarmTime" label="告警时间" align="center"> </el-table-column>
					<el-table-column prop="type" label="类型" align="center">
						<template #default="scope">
							<el-text size="default" class="mx-1">{{ types[scope.row.type] }}</el-text>
						</template>
					</el-table-column>
					<el-table-column prop="credibility" label="告警置信度" align="center"> </el-table-column>
					<el-table-column label="图片">
						<template #default="scope"> 
							<img 		
						     	 style="width: 30px; height: 30px; border-radius: 4px; cursor: pointer;" 
								 :src="scope.row.src" 
								 @click="clickImg(scope.row)"
							/>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<el-pagination
				style="display: flex; justify-content: end; padding-right: 20px"
				v-model:currentPage="listData.page"
				v-model:page-size="listData.pageSize"
				:total="listData.totalPages"
				:page-sizes="[10]"
				small
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</div>

		<el-image
		    ref="imgBox"
			style="width: 0px; height: 0px; border-radius: 5px"
			:src="state.imgSrc"
			:zoom-rate="1.2"
			:max-scale="7"
			:z-index="24123111"
			:min-scale="0.2"
			:preview-src-list="[state.imgSrc]"
			:initial-index="4"
			fit="cover"
			:teleported="false"
		/>
	</div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import treeInfo from './composition/tree.js';
import listInfo from './composition/list.js';

const imgBox = ref(null);

const state = reactive({
	imgSrc: null
});

const { treeData, search, handleNodeClick } = treeInfo(() => {
	return { getPages, listData };
});
const { listData, getPages, conditionSearch, handleSizeChange, handleCurrentChange } = listInfo(treeData);


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

function clickImg(item){
	state.imgSrc = item.src;
	imgBox.value.$el.querySelector('img').click()
}

</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
<template>
	<div class="videoRecordingManagement">
		<div class="videoRecordingManagement_leftNavs">
			<div class="searchArea">
				<el-input
					v-model="treeData.keyword"
					placeholder="搜索"
					suffix-icon="el-icon-search"
					@change="search"
				></el-input>
			</div>

			<div class="accordion">
				<el-tree
					:key="treeData.myKey"
					:data="treeData.myTrees"
					:props="treeData.defaultProps"
					:highlight-current="true"
					accordion
					@node-click="handleNodeClick"
				>
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

				<el-button
					size="small"
					style="margin-right: 10px; margin-left: 0px; margin-top: 6px"
					@click="conditionSearch"
					>搜索</el-button
				>

				<el-button
					size="small"
					style="margin-right: 10px; margin-left: 0px; margin-top: 6px"
					@click="switchingTypes"
					><el-icon><ele-Sort /></el-icon>{{ modeSwitchText }}</el-button
				>
				<el-button
					size="small"
					style="margin-right: 10px; margin-left: 0px; margin-top: 6px"
					:icon="Camera"
					>手动抓拍</el-button
				>
			</div>

			<div
				class="videoRecordingManagement_contentBox"
				:class="{ tableType: state.conetntType === 'table' }"
			>
				<el-table
					v-if="state.conetntType === 'table'"
					:data="listData.lists"
					height="100%"
					border
					style="width: 100%"
					v-loading="listData.loading"
				>
					<el-table-column prop="code" label="通道编号" align="center" />
					<el-table-column prop="name" label="通道名称" align="center" />
					<el-table-column prop="snapTime" label="时间" align="center" />
					<el-table-column label="图片名称" align="center">
						<template #default="scope">
							<span>{{ getImgName(scope.row.filePath) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="图片" align="center" width="70px">
						<template #default="scope">
							<el-tooltip
								:content="`<img style='max-width: 800px; max-height: 800px;'
								src=${scope.row.src} />`"
								raw-content
							>
								<img
									style="width: 35px; height: 35px; border-radius: 4px; cursor: pointer"
									:src="scope.row.src"
								/>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
				<div
					v-else-if="state.conetntType === 'imgBoxs'"
					class="imgBoxs"
					ref="imgBoxDom"
					v-loading="listData.loading"
				>
					<el-empty v-if="!listData.lists.length" :description="listState" />

					<ul class="ul">
						<li class="li" v-for="item in listData.lists" :key="item.id">
							<div class="demo-image__preview">
								<el-image
									class="img"
									style="width: 100%; height: 10vw;"
									:src="item.src"
									:zoom-rate="1.2"
									:max-scale="7"
									:min-scale="0.2"
									:preview-src-list="[item.src]"
									:initial-index="0"
									fit="cover"
								/>
							</div>

							<p class="li_text">{{ item.snapTime }}</p>
							<p class="li_text">{{ item.name }}</p>
						</li>
						<li class="li" v-for="item in state.quantityPerRow" :key="item + ']'"></li>
					</ul>
				</div>
			</div>

			<el-pagination
				style="display: flex; justify-content: end; padding-right: 20px; margin-top: 20px"
				v-model:currentPage="listData.page"
				v-model:page-size="listData.pageSize"
				:total="listData.totalPages"
				:page-sizes="[10, 20, 50, 100]"
				small
				background
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total, sizes, prev, pager, next, jumper"
			/>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import treeInfo from './composition/tree.js';
import listInfo from './composition/list.js';
import { Camera } from '@element-plus/icons-vue'
const imgBoxDom = ref(null);

const state = reactive({
	times: [new Date(), new Date()],
	keyword: '',

	tableData: [],

	imgs: [],

	quantityPerRow: 0,

	conetntType: 'imgBoxs', // 内容类型

	ipurl: window.location.origin,
});

onBeforeMount(() => {
	window.addEventListener('resize', getQuantityPerRow);
});

onMounted(() => {
	setTimeout(getQuantityPerRow, 10);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', getQuantityPerRow);
});

const { treeData, search, handleNodeClick } = treeInfo(() => {
	return { getPages, listData, getQuantityPerRow };
});
const { listData, getPages, conditionSearch, handleSizeChange, handleCurrentChange } = listInfo(
	treeData,
	getQuantityPerRow
);

// 列表状态
const listState = computed(() => {
	if (listData.loading) {
		return '加载中';
	} else if (!treeData.passageway.id) {
		return '请选择通道';
	} else if (!listData.loading && treeData.passageway.id && !listData.lists.length) {
		return '暂无数据';
	}
	return '';
});

const modeSwitchText = computed(() => {
	if (state.conetntType === 'imgBoxs') {
		return '详情模式';
	} else {
		return '大图模式';
	}
});

function getImgName(filePath) {
	if (!filePath) {
		return;
	}
	let fileName = filePath.split('/').pop();

	return fileName;
}

// 获取每行的数量
function getQuantityPerRow() {
	if (!imgBoxDom.value || listData.lists.length <= 0) {
		return;
	}

	const width = imgBoxDom.value.offsetWidth;

	const liwidth = imgBoxDom.value.children[0].children[0].offsetWidth;

	state.quantityPerRow = listData.lists.length % Math.floor(width / liwidth);
	state.quantityPerRow = Math.floor(width / liwidth) - state.quantityPerRow;

	if (listData.lists.length <= Math.floor(width / liwidth)) {
		state.quantityPerRow = 0;
	}
}

// 切换类型
function switchingTypes() {
	state.conetntType = state.conetntType === 'imgBoxs' ? 'table' : 'imgBoxs';
}

function getImgSrc(filePath) {
	if (filePath) {
		return true;
	}
	return false;
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>

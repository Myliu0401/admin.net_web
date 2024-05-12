<template>
	<div class="photographySchedule">
		<div class="itemOption">
			<span class="title">类型</span>
			<el-select v-model="state.type" placeholder="请选择" style="width: 150px; margin-right: 15px">
				<el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>

			<span class="title">日期时间</span>
			<el-date-picker
				style="margin-right: 15px"
				v-model="state.items"
				type="datetimerange"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				format="YYYY-MM-DD HH:mm:ss"
				date-format="YYYY/MM/DD"
				time-format="hh:mm:ss"
			/>

			<el-button type="primary" @click="search">搜索</el-button>
		</div>

		<el-table :data="state.lists" v-loading="state.loading" border style="width: 100%; margin-top: 15px" max-height="50vh">
			<el-table-column prop="hour" label="时" align="center" />
			<el-table-column prop="minute" label="分" align="center" />
			<el-table-column prop="preset" label="预置位号" align="center" />
		</el-table>
	</div>
</template>



<script>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getListOfMainStation } from '/@/api/allocation/index.js';
export default {
	props: {
		deviceID: {
			default: '',
		},
	},
	setup(props, { emit }) {
		const state = reactive({
			loading: false,
            type: '',
			lists: [],
			items: [],
		});

		const types = ref([
			{
				id: 1,
				name: 'ImageFile',
			},
			{
				id: 2,
				name: 'WaveFile',
			},
			{
				id: 255,
				name: 'AllFile',
			},
		]);

		onBeforeMount(() => {});

		// 获取拍照时间表
		async function search() {
            state.loading = true;
            const res = await getListOfMainStation({
                deviceId: props.deviceId,
                type: state.type,
                startTime: state.items && state.items.length ? state.items[0].toISOString() : undefined,
                endTime:  state.items && state.items.length ? state.items[1].toISOString() : undefined,
            });
            state.loading = false;
            state.lists = res.data.result.useages;
		}

		return { state, types, search };
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
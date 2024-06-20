import { reactive, onBeforeMount, onBeforeUnmount } from 'vue';
import { getDeviceList } from '/@/api/deviceManagement/index.js';

export default function (state) {
	const listData = reactive({
		code: undefined, // 设备编号
		name: undefined, // 设备名称
		deviceCodeList: [], // 设备编号列表
		deviceList: [], // 表格列表
		loading: false, // 是否加载中

		page: 1, // 分页
		pageSize: 10, // 每页数量

		totalPages: null, // 总页数

		timerId: null,
	});

	onBeforeMount(() => {
		getMyDeviceList();
		getDeviceLists();
		updateList();
	});

	onBeforeUnmount(() => {
		clearTimeout(state.timerId);
	});

	// 获取设备列表
	async function getMyDeviceList() {
		listData.loading = true;
		const res = await getDeviceList({
			page: listData.page,
			pageSize: listData.pageSize,
			code: listData.code,
			name: listData.name,
			treeNode: {
				id: state.treeNode.id,
				type: state.treeNode.type,
				extId: state.treeNode.extId,
			},
		});
		listData.loading = false;
		listData.totalPages = res.data.result.total;
		listData.deviceList = res.data.result.items;
	}

	// 获取总设备数量
	async function getDeviceLists() {
		const res = await getDeviceList({
			page: 1,
			pageSize: 100000000,
		});
		listData.deviceCodeList = res.data.result.items.map((item) => {
			return {
				value: item.code,
				label: item.code,
			};
		});
	}

	// 搜索
	function search() {
		getMyDeviceList();
	}

	// 重置
	function reset() {
		listData.page = 1;
		listData.pageSize = 10;
		listData.code = undefined;
		listData.name = undefined;
		state.treeNode.id = undefined;
		state.treeNode.type = undefined;
		state.treeNode.extId = undefined;
		getMyDeviceList();
	}

	// 分页操作
	function setPagination(type) {
		if (listData.loading) {
			return;
		}
		if ((type === 'lastPage' && listData.page == 1) || (type === 'nextPage' && listData.page == listData.totalPages)) {
			return;
		}
		type === 'lastPage' ? listData.page-- : listData.page++;
		getMyDeviceList();
	}

	function handleSizeChange(num) {
		listData.pageSize = num;
		getMyDeviceList();
	}

	function handleCurrentChange(index) {
		listData.page = index;
		getMyDeviceList();
	}

	// 每15秒更新列表
	async function updateList() {
		let res = null;
		try {
			res = await getDeviceList({
				page: listData.page,
				pageSize: listData.pageSize,
				code: listData.code,
				name: listData.name,
				treeNode: {
					id: state.treeNode.id,
					type: state.treeNode.type,
					extId: state.treeNode.extId,
				},
			});
		} catch (err) {
			return;
		}

		listData.totalPages = res.data.result.total;
		listData.deviceList = res.data.result.items;

		state.timerId = setTimeout(() => {
			updateList();
		}, 15000);
	}

	return {
		listData,
		search,
		reset,
		setPagination,
		handleSizeChange,
		handleCurrentChange,
	};
}

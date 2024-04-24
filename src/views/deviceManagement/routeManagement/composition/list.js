

import { reactive, onBeforeMount } from 'vue';
import { getLineList } from '/@/api/deviceManagement/index.js';

export default function (state) {
    const listData = reactive({
        code: undefined, // 设备编号
        name: undefined, // 设备名称
        lineListCodes: [], // 线路编号列表
        lineList: [], // 线路列表
        loading: false, // 是否加载中

        page: 1, // 分页
        pageSize: 10, // 每页数量

        totalPages: undefined, // 总页数
    });


    onBeforeMount(() => {
        getMyLineList();
      
    });

    // 获取线路列表
    async function getMyLineList() {

        listData.loading = true;
        const res = await getLineList({
            page: listData.page,
            pageSize: listData.pageSize,
            code: listData.code,
            name: listData.name,
            voltageLevelId: state.voltageLevelId,
            countyId: state.countyId, 
            treeNode: {
                id: state.treeNode.id,
                type: state.treeNode.type,
                extId: state.treeNode.extId
            }
        });
        listData.loading = false;
        listData.totalPages = res.data.result.totalPages;
        listData.lineList = res.data.result.items;
    };



    // 搜索
    function search() {
        getMyLineList();
    };


    // 重置
    function reset() {
        listData.page = 1;
        listData.pageSize = 10;
        listData.code = undefined;
        listData.name = undefined;
        state.treeNode.id = undefined;
        state.treeNode.type = undefined;
        state.treeNode.extId = undefined;
        state.countyId = undefined;
        state.voltageLevelId = undefined;
        getMyLineList();
    };

    // 分页操作
    function setPagination(type) {
        if (listData.loading) {
            return
        };
        if (type === 'lastPage' && listData.page == 1 || type === 'nextPage' && listData.page == listData.totalPages) {
            return;
        };
        type === 'lastPage' ? listData.page-- : listData.page++;
        getMyLineList();
    };

    return {
        listData,
        search,
        reset,
        setPagination
    }
};
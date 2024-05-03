

import { reactive, onBeforeMount } from 'vue';
import { getListOfTowerPoles } from '/@/api/deviceManagement/index.js';

export default function (state) {
    const listData = reactive({
        code: null, // 设备编号
        name: null, // 设备名称
        deviceCodeList: [], // 设备编号列表
        deviceList: [], // 表格列表
        loading: false, // 是否加载中

        page: 1, // 分页
        pageSize: 10, // 每页数量

        totalPages: null, // 总页数
    });


    onBeforeMount(() => {
        getMyTowerPole();
    });

    // 获取塔杆列表
    async function getMyTowerPole() {

        listData.loading = true;
        const res = await getListOfTowerPoles({
            page: listData.page,
            pageSize: listData.pageSize,
            code: listData.code,
            name: listData.name,
            lineId: state.lineId,
            treeNode: {
                id: state.treeNode.id,
                type: state.treeNode.type,
                extId: state.treeNode.extId
            }
        });

        listData.loading = false;
        listData.totalPages = res.data.result.total;
        res.data.result.items = res.data.result.items.map((item)=>{
            return { ...item,  longitude:item.longitude / 1000000, latitude: item.latitude / 1000000 }
        });
        listData.deviceList = res.data.result.items;

        
    };


    // 搜索
    function search() {
        getMyTowerPole();
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
        state.lineId = undefined;
        getMyTowerPole();
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
        getMyTowerPole();
    };

    function handleSizeChange(num){
        listData.pageSize = num;
        getMyTowerPole();
    }


    function handleCurrentChange(index){
         
         listData.page = index
         getMyTowerPole()
    }

    return {
        listData,
        search,
        reset,
        setPagination,
        handleSizeChange,
        handleCurrentChange
    }
};
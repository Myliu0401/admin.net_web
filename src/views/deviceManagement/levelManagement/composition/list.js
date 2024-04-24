
import { reactive, onBeforeMount } from 'vue';
import { getVoltageList } from '/@/api/deviceManagement/index.js';

export default function () {

    const listData = reactive({
        // 电压列表
        voltageList: [],

        loading: false, // 加载
        totalPages: null,
        page: 1,
        pageSize: 10
    });

    onBeforeMount(async ()=>{
        getVolList();
    });

    // 获取电压列表
    async function getVolList(){
        listData.loading = true;
        const res = await getVoltageList({
            page: listData.page,
            pageSize: listData.pageSize
        });
        listData.loading = false;
        listData.totalPages = res.data.result.totalPages;
        listData.voltageList = res.data.result.items;
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
        getVolList();
    };

    return {
        listData,
        getVolList,
        setPagination
    }

};
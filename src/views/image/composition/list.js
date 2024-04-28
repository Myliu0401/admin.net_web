

import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMySnapshotPage } from '/@/api/imageManagement/index.js';


export default function (treeData) {
    const listData = reactive({
        lists: [],
        loading: false,
        times: [new Date(), new Date()],
        page: 1,
        pageSize: 10,
    });


    onBeforeMount(() => {
        getPages();
    });


    // 获取列表
    async function getPages() {
        if (!treeData.passageway.id) {
            return
        }
        listData.loading = true;
        const res = await getMySnapshotPage({
            page: listData.page,
            pageSize: listData.pageSize,
            treeNode: { id: treeData.passageway.id, type: treeData.passageway.type, extId: treeData.passageway.extId },
            startTime: '2024-04-26T18:16:49.917Z',//listData.times ? formatDate(listData.times[0]) : undefined,
            endTime: '2024-04-26T18:16:59.917Z'//listData.times ? formatDate(listData.times[1]) : undefined,
        });
        listData.loading = false;

        console.log(res.data.result)
    };


    function formatDate(date) {
        var year = date.getFullYear();
        var month = (1 + date.getMonth()).toString().padStart(2, '0'); // 月份是从0开始的，所以加1，并使用padStart确保两位数字  
        var day = date.getDate().toString().padStart(2, '0'); // 使用padStart确保两位数字  
        return year + '-' + month + '-' + day;
    };


    // 条件搜索
    function conditionSearch(){

    };


    return { listData, getPages, conditionSearch }
};
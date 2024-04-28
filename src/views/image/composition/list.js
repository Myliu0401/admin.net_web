

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
            startTime: listData.times ? formatDate(listData.times[0]) : undefined,
            endTime: listData.times ? formatDate(listData.times[1]) : undefined,
        });
        listData.loading = false;

        console.log(res.data.result)
    };


    function formatDate(date) {
        const now = new Date(+date);
       return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };


    // 条件搜索
    function conditionSearch(){
        listData.page = 1;
        listData.pageSize = 10;
        getPages();
    };


    return { listData, getPages, conditionSearch }
};
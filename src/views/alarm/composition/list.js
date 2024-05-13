

import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getAlarm } from '/@/api/alarm/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export default function (treeData) {
    const listData = reactive({
        lists: [],
        loading: false,
        times: [new Date(Date.now() - (24 * 60 * 60 * 1000)), new Date()],
        page: 1,
        pageSize: 10,
        totalPages: 0, 
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
        const res = await getAlarm({
            page: listData.page,
            pageSize: listData.pageSize,
            treeNode: { id: treeData.passageway.id, type: treeData.passageway.type, extId: treeData.passageway.extId },
            startTime: listData.times ? formatDate(listData.times[0]) : undefined,
            endTime: listData.times ? formatDate(listData.times[1]) : undefined,
        });
        listData.loading = false;
        listData.totalPages = res.data.result.total;
        listData.lists = res.data.result.items;

        
    };


    function formatDate(date) {
        const now = new Date(+date);
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };


    // 条件搜索
    function conditionSearch() {
        if (!treeData.passageway.id) {
            ElMessage({
				message: '请选择通道',
				type: 'warning',
			});
            return
        }
        listData.page = 1;
        listData.pageSize = 12;
        getPages();
    };


    function handleSizeChange(num){
        listData.pageSize = num;
        getPages();
    }


    function handleCurrentChange(index){
         listData.page = index
         getPages()
    }


    return { listData, getPages, conditionSearch, handleSizeChange, handleCurrentChange }
};
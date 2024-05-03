

import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMyRecordings } from '/@/api/recordingManagement/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export default function (treeData, getQuantityPerRow) {
    const listData = reactive({
        lists: [],
        allLists: [],
        loading: false,
        times: [new Date(Date.now() - (24 * 60 * 60 * 1000)), new Date()],
        page: 1,
        totalPages: 0, // 总页数
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
        const res = await getMyRecordings({
            treeNode: { id: treeData.passageway.id, type: treeData.passageway.type, extId: treeData.passageway.extId },
            startTime: listData.times ? formatDate(listData.times[0]) : undefined,
            endTime: listData.times ? formatDate(listData.times[1]) : undefined,
        });
        listData.loading = false;

        const items = res.data.result.map((item) => {
            return { ...item, now: Date.parse(item.startTime) }
        }).sort((a, b) => {
            return a.now - b.now
        });


        listData.allLists = items;
        listData.totalPages = items.length;
        processPaging(listData.page, listData.pageSize);
        
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
        listData.pageSize = 10;
        listData.allLists = [];
        listData.lists = [];
        getPages();
    };

    function processPaging(index, num) {
        listData.lists = listData.allLists.slice((index - 1) * num, index * (num))

        setTimeout(()=>{getQuantityPerRow()}, 20)
    }


    /* 
       // 处理分页
       function processPaging(type){
           if(type === 'lastPage' && listData.page === 1 || type === 'nextPage' && listData.page === listData.totle){
             return
           }        
       } 
       
    */

    function handleSizeChange(num) {
        listData.pageSize = num;
        processPaging(listData.page, listData.pageSize);
    }


    function handleCurrentChange(index) {
        listData.page = index
        processPaging(listData.page, listData.pageSize)
    }


    return { listData, getPages, conditionSearch, processPaging, handleSizeChange, handleCurrentChange }
};
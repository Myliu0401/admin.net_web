

import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMyRecordings } from '/@/api/recordingManagement/index.js';


export default function (treeData) {
    const listData = reactive({
        lists: [],
        allLists: [],
        loading: false,
        times: [new Date(), new Date()],
        page: 1,
        totle: 1, // 总页数
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
            startTime: '2024-04-28T16:58:33.891Z',//listData.times ? formatDate(listData.times[0]) : undefined,
            endTime: '2024-04-28T16:58:33.891Z',//listData.times ? formatDate(listData.times[1]) : undefined,
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
        listData.allLists = [];
        listData.lists = [];
        getPages();
    };


    // 处理分页
    function processPaging(type){
        if(type === 'lastPage' && listData.page === 1 || type === 'nextPage' && listData.page === listData.totle){
          return
        }

        
    }


    return { listData, getPages, conditionSearch, processPaging }
};


import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMySnapshotPage } from '/@/api/imageManagement/index.js';


export default function () {
    const listData = reactive({
        lists: [],
        loading: false,
        page: 1,
        pageSize: 10,
    });


    onBeforeMount(() => {
        getPages();
    });


    async function getPages() {
        listData.loading = true;
        const res = await getMySnapshotPage({
            page: listData.page,
            pageSize: listData.pageSize
        });
        listData.loading = false;

        console.log(res.data)
    };


    return { listData }
};
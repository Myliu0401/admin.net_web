
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMyUserList } from '/@/api/authority/index.js';

export default function () {
    const listData = reactive({
        keyword: undefined,
        page: 1,
        pageSize: 10,
        totalPages: undefined, // 总页数
        lists: [],
        loading: false
    });


    onBeforeMount(() => {
        getUserList();
    });

    // 分页操作
    function setPagination(type) {
        if (listData.loading) {
            return
        };
        if (type === 'lastPage' && listData.page == 1 || type === 'nextPage' && listData.page == listData.totalPages) {
            return;
        };
        type === 'lastPage' ? listData.page-- : listData.page++;
        getUserList();
    };


    // 获取用户列表
    async function getUserList() {
        listData.loading = true;
        const res = await getMyUserList({
            page: listData.page,
            pageSize: listData.pageSize,
            realName: listData.keyword
        });
        listData.loading = false;
        listData.lists = res.data.result.items;
        listData.totalPages = res.data.result.totalPages;

    };


    function search(){
         listData.page = 1;
         listData.pageSize = 10;
         getUserList();
    };


    return { listData, setPagination, search };


};
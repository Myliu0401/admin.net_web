<template>
    <div class="imageManagement">
        <div class="selectionArea">
            <el-date-picker style="margin-right: 10px; margin-top: 6px" size="small" v-model="state.times"
                type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />

            <el-input size="small" suffix-icon="el-icon-search"
                style="width: 200px; margin-right: 10px; margin-top: 6px" v-model="state.keyword"
                placeholder="请输入搜索内容" />

            <el-button size="small" style="margin-right: 10px; margin-left: 0px; margin-top: 6px">搜索</el-button>

            <el-button size="small" style="margin-right: 10px; margin-left: 0px; margin-top: 6px"><el-icon><ele-Download /></el-icon>导出</el-button>

            <el-button size="small" style="margin-right: 10px; margin-left: 0px; margin-top: 6px"
                @click="switchingTypes"><el-icon><ele-Sort /></el-icon>文本切换</el-button>
        </div>

        <div class="contentMain" :class="{ tableType: state.conetntType === 'table' }">

            <el-table v-if="state.conetntType === 'table'" :data="state.tableData" height="100%" border style="width: 100%;">
                <el-table-column prop="date" label="日期" width="180"> </el-table-column>
                <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
                <el-table-column prop="address" label="地址"> </el-table-column>
            </el-table>

            <div v-else-if="state.conetntType === 'imgBoxs'" class="imgBoxs" ref="imgBoxDom">
                <ul class="ul">
                    <li class="li" v-for="(item, index) in state.imgs" :key="index">
                        <div class="li_content">
                            <img class="img" :src="item.src" />
                        </div>
                        <p class="li_text">{{ item.date }}</p>
                    </li>
                    <li class="li" v-for="item in state.quantityPerRow" :key="item + ']'"></li>
                </ul>
            </div>
        </div>

        <div class="contentPage">
            <button class="button">上一页</button>
            <div class="info">1/2</div>
            <button class="button">下一页</button>
        </div>
    </div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';

const imgBoxDom = ref(null);

const state = reactive({
    times: '',
    keyword: '',
    tableData: [
        {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
        {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
        },
    ],
    imgs: [
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
        {
            id: 1,
            src: 'https://pic.rmb.bdstatic.com/bjh/914b8c0f9814b14c5fedeec7ec6615df5813.jpeg',
            date: '2023-09-10 12:00:15',
        },
    ],
    quantityPerRow: 0,

    conetntType: 'imgBoxs', // 内容类型
});

onBeforeMount(() => {
    window.addEventListener('resize', getQuantityPerRow);
});

onMounted(() => {
    getQuantityPerRow();
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', getQuantityPerRow);
});


// 获取每行的数量
function getQuantityPerRow() {
    if (!imgBoxDom || state.imgs.length <= 0) {
        return;
    };


    const width = imgBoxDom.value.offsetWidth;

    const liwidth = imgBoxDom.value.children[0].children[0].offsetWidth;

    state.quantityPerRow = state.imgs.length % Math.floor(width / liwidth);
    state.quantityPerRow = Math.floor(width / liwidth) - state.quantityPerRow;


    if (state.imgs.length <= Math.floor(width / liwidth)) {
        state.quantityPerRow = 0;
    }

};


// 切换类型
function switchingTypes() {
    state.conetntType = state.conetntType === 'imgBoxs' ? 'table' : 'imgBoxs';
};
</script>


<style lang="scss" scoped>
@import './index.scss';
</style>
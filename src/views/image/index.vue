<template>
    <div class="videoRecordingManagement">
        <div class="videoRecordingManagement_leftNavs">
            <div class="searchArea">
                <el-input v-model="treeData.keyword" placeholder="搜索" suffix-icon="el-icon-search"
                    @change="search"></el-input>

            </div>

            <div class="accordion">
                <el-tree :key="treeData.myKey" :data="treeData.myTrees" :props="treeData.defaultProps" :highlight-current="true" accordion
                    @node-click="handleNodeClick" />

            </div>
        </div>

        <div class="mainContent">
            <div class="selectionArea">
                <el-date-picker style="margin-right: 10px; margin-top: 6px" size="small" v-model="listData.times"
                    type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"/>

                <el-button size="small" style="margin-right: 10px; margin-left: 0px; margin-top: 6px">搜索</el-button>

                <el-button size="small"
                    style="margin-right: 10px; margin-left: 0px; margin-top: 6px"><el-icon><ele-Download /></el-icon>导出</el-button>

                <el-button size="small" style="margin-right: 10px; margin-left: 0px; margin-top: 6px"
                    @click="switchingTypes"><el-icon><ele-Sort /></el-icon>文本切换</el-button>
            </div>


            <div class="videoRecordingManagement_contentBox" :class="{ tableType: state.conetntType === 'table' }">
                <el-table v-if="state.conetntType === 'table'" :data="state.tableData" height="100%" border
                    style="width: 100%;">
                    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
                    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
                    <el-table-column prop="address" label="地址"> </el-table-column>
                </el-table>
                <div v-else-if="state.conetntType === 'imgBoxs'" class="imgBoxs" ref="imgBoxDom">

                    <el-empty :description="listState" />

                   <!--  <ul class="ul">
                        <li class="li" v-for="(item, index) in state.imgs" :key="index">
                            <div class="li_content">
                                <img class="img" src="../../assets/videoRecordingManagement/bofan.png" />
                            </div>
                            <p class="li_text">{{ item.date }}</p>
                        </li>
                        <li class="li" v-for="item in state.quantityPerRow" :key="item + ']'"></li>
                    </ul> -->
                </div>
            </div>

            <div class="contentPage">
                <button class="button">上一页</button>
                <div class="info">1/2</div>
                <button class="button">下一页</button>
            </div>
        </div>



    </div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted, computed } from 'vue';
import treeInfo from './composition/tree.js';
import listInfo from './composition/list.js';

const imgBoxDom = ref(null);

const state = reactive({
   
   
    times: [new Date(), new Date()],
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
    setTimeout(getQuantityPerRow, 10);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', getQuantityPerRow);
});

const { treeData, search, handleNodeClick } = treeInfo(()=>{ return { getPages, listData } });
const { listData, getPages } = listInfo(treeData);

// 列表状态
const listState = computed(()=>{
    if(listData.loading){
        return '加载中'
    }else if(!treeData.passageway.id){
        return '请选择通道'
    }else if(!listData.loading && treeData.passageway.id && !listData.lists.length){
        return '暂无数据';
    }
});

function change(e){
    console.log(state.times)
};

// 获取每行的数量
function getQuantityPerRow() {
    if (!imgBoxDom.value || state.imgs.length <= 0) {
        return;
    }

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

<style lang="scss">
@import './index.scss';
</style>
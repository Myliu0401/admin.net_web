<template>
    <div class="deviceManagement">
        <div class="leftNavigation">
            <div class="searchArea">
                <el-input v-model="state.keyword" placeholder="搜索" suffix-icon="el-icon-search"
                    @change="search"></el-input>

            </div>
            <div class="accordion">
                <el-tree :data="state.data" :props="defaultProps" :highlight-current="true" accordion
                    @node-click="handleNodeClick" />

            </div>


        </div>

        <div class="contentMain">
            <div class="contentMain_searchArea">
                <el-select v-model="state.equipmentNumber" clearable placeholder="设备编号" size="small"
                    style="width: 150px; min-width: 150px; margin-right: 10px;">
                    <el-option v-for="item in state.deviceList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input v-model="state.keyword1" suffix-icon="el-icon-search" placeholder="请输入搜索内容内容" size="small"
                    style="margin-right: 10px; max-width: 200px;"></el-input>
                
                    <el-button plain size="small">搜索</el-button>
                
                    <el-button plain size="small">批量管理</el-button>
                
                    <el-button plain size="small" icon="el-icon-plus" @click="wakeUpPopUp">添加设备</el-button>
            </div>

            <div class="cotentMain_table">
                <el-table :data="state.tableData" height="max-height: 100%" :border="true" empty-text="暂无数据"
                    style="width: 100%" v-loading="state.loading">
                    <el-table-column prop="date" label="日期" width="180" :align="'center'">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="180" :align="'center'">
                    </el-table-column>
                    <el-table-column prop="address" label="地址" :align="'center'">
                    </el-table-column>
                    <el-table-column label="操作" width="70" :align="'center'">
                        <template slot-scope="scope">
                            <i class="el-icon-edit" @click="wakeUpPopUp"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>


            <div class="contentPage">
                <button class="button">上一页</button>
                <div class="info">1/2</div>
                <button class="button">下一页</button>
            </div>
        </div>


        <el-dialog title="修改" v-model="state.dialogVisible" :close-on-click-modal="false" width="50%"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="state.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="state.dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>


<script setup>
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';

const state = reactive(
    {
        keyword: null,
        data: [
            {
                label: '一级 1',
                children: [
                    {
                        label: '二级 1-1',
                        children: [
                            {
                                label: '三级 1-1-1',
                            },
                        ],
                    },
                ],
            },
            {
                label: '一级 2',
                children: [
                    {
                        label: '二级 2-1',
                        children: [
                            {
                                label: '三级 2-1-1',
                            },
                        ],
                    },
                    {
                        label: '二级 2-2',
                        children: [
                            {
                                label: '三级 2-2-1',
                            },
                        ],
                    },
                ],
            },
            {
                label: '一级 3',
                children: [
                    {
                        label: '二级 3-1',
                        children: [
                            {
                                label: '三级 3-1-1',
                            },
                        ],
                    },
                    {
                        label: '二级 3-2',
                        children: [
                            {
                                label: '三级 3-2-1',
                            },
                        ],
                    },
                ],
            },
        ],
        defaultProps: {
            children: 'children',
            label: 'label',
        },

        equipmentNumber: null, // 设备编号
        keyword1: '', // 关键字
        deviceList: [
            {
                value: '选项1',
                label: '黄金糕',
            },
        ], // 设备列表

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
        ],

        loading: false, // 加载

        dialogVisible: false, // 弹框
    }
);


function handleNodeClick(data) {
    console.log(data);
};

function search() {
    console.log('=');
};

// 关闭弹窗
function handleClose() {
    state.dialogVisible = false;
};

// 唤醒弹窗
function wakeUpPopUp() {
    state.dialogVisible = true;
};

</script>



<style lang="scss" scoped>
@import './index.scss';
</style>

<style lang="scss">
@import './index.scss';
</style>
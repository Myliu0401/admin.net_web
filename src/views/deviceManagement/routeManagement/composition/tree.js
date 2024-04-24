

import { reactive, onBeforeMount } from 'vue';
import { getEquipmentTreeStructure, getLineTree } from '/@/api/deviceManagement/index.js';


export default function () {
    
    const leftData = reactive({
        trees: [],
        myTrees: [],
        keyword: null,
        defaultProps: {
            children: 'children',
            label: 'label',
        },
    });


    onBeforeMount(async () => {
        const res = await getLineTree({
            showDeviceNode: true,
            showUnmoutNode: true
        });
        convertKeyValues(res.data.result);
        leftData.trees = res.data.result;
        getSpecificTreeShape(leftData.keyword);
    });

    // 转换属性名
    function convertKeyValues(datas) {
        for (let item of datas) {
            item.label = item.name;
            if (item.children) {
                convertKeyValues(item.children);
            };
        };
    };


    // 获取指定树
    function getSpecificTreeShape() {
        if (!leftData.keyword) {
            leftData.myTrees = leftData.trees;
            return
        };

        leftData.myTrees = filterTreeData(leftData.trees, leftData.keyword);
    };

    // 根据关键字过滤树形数据
    function filterTreeData(treeData, keyword) {
        return treeData.filter(node => {
            // 检查当前节点是否包含关键字
            const isMatched = node.label.includes(keyword);
            // 如果当前节点包含关键字，则保留该节点
            if (isMatched) {
                return true;
            }
            // 如果当前节点不包含关键字，则递归过滤子节点
            if (node.children) {
                const filteredChildren = filterTreeData(node.children, keyword);
                // 如果子节点中有匹配的节点，则保留当前节点
                if (filteredChildren.length > 0) {
                    return true;
                }
            }
            // 否则不保留当前节点
            return false;
        });
    };



    return {
        leftData,
        getSpecificTreeShape
    }
};
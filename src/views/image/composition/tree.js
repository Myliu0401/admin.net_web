
import { reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getChannelTree } from '/@/api/imageManagement/index.js';


export default function (callback) {
    const treeData = reactive({
        data: [],
        myTrees: [],
        myKey: 1,
        defaultProps: {
            children: 'children',
            label: 'name',
            isLeaf: 'leaf',
            class: (data, node) => {
                return data.currentNodeId;
            }
        },
        passageway: {}, // 选中的通道
    });

    onBeforeMount(async () => {
        await getTree();
        search();
    });

    // 获取树形结构
    async function getTree() {
        const res = await getChannelTree();
        treeData.data = res.data.result;
        tianjia(treeData.data);
    };

    // 点击节点时触发
    function handleNodeClick(a, b, c, d) {

        const bo1 = a.children === null;
        const bo3 = treeData.passageway.currentNodeId !== a.currentNodeId;
        const currentNodeId = treeData.passageway.currentNodeId;

        if (bo1 && bo3) {
            treeData.passageway = a;
            const { listData, getPages } = callback();
            listData.page = 1;
            getPages();
        };

        setTimeout(()=>{addAClassToANode(currentNodeId)});

    };

    // 给选择的节点添加class
    function addAClassToANode(currentNodeId) {
        if (!treeData.passageway.currentNodeId) {
            return;
        };


        // 删除
        const node1 = document.querySelector(`.${currentNodeId}`);
        node1 && node1.classList.remove('active');

        
        // 添加
        const node = document.querySelector(`.${treeData.passageway.currentNodeId}`);
        node && !node.classList.contains('active') && node.classList.add('active');


        
    };


    // 添加属性
    function tianjia(data = []) {
        for (let i = 0; i < data.length; i++) {
            data[i].currentNodeId = 'A' + Math.random().toString(36).slice(4);
            if (!data[i].children || !data[i].children.length) {
                data[i].leaf = true;
            } else if (data[i].children.length) {
                tianjia(data[i].children);
            }
        }
    };

    // 搜索节点时触发
    function search() {
        treeData.myKey++;
        if (!treeData.keyword) {
            treeData.myTrees = treeData.data;
            return
        }

        treeData.myTrees = filterTreeData(treeData.data, treeData.keyword);
    };


    // 根据关键字过滤树形数据
    function filterTreeData(treeData, keyword) {
        
        return treeData.filter(node => {
            // 检查当前节点是否包含关键字
            const isMatched = node.name.includes(keyword);
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

    return { treeData, search, handleNodeClick };
};
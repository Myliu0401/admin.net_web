import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { getMyTreeNodes } from '/@/api/realTimeVideo/index.js';


export default function (state, multiGridVideo) {
    const treeData = reactive({
        keyword: '',  // 关键字
        data: [],
        myTrees: [],
        defaultProps: {
            children: 'children',
            label: 'name',
            isLeaf: 'leaf',
            class: (data, node) => {
                return data.currentNodeId;
            }
        },
        myKey: 1,
        passageway: [], // 选中的通道

    });

    // 生命周期
    onBeforeMount(async () => {
        await getTreeNodes();
        search();
    });

    // 获取树形节点
    async function getTreeNodes() {
        const res = await getMyTreeNodes({ showUnmoutNode: true });
        treeData.data = res.data.result;
        tianjia(treeData.data);
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

    // 渲染树形
    function loadNode(node, resolve) {
        if (node.level === 0) {
            resolve(treeData.myTrees);
        } else if (node.data.children) {
            resolve(node.data.children);
        } else {
            resolve([]);
        }
    };

    // 点击节点时触发
    function handleNodeClick(a, b, c, d) {

        const bo1 = a.children === null ;
        const bo2 = !treeData.passageway.map((item) => { return item.currentNodeId }).includes(a.currentNodeId);
        const bo3 = treeData.passageway.length < zhuanhuan();


        if (bo1 && bo2 && bo3) {
            treeData.passageway.push(a);
            new multiGridVideo.value.createVideoInstance(a.currentNodeId, a.id);
        };

        setTimeout(addAClassToANode);

    };

    function zhuanhuan() {
        switch (state.currentGrid) {
            case '1x1':
                return 1;
            case '2x2':
                return 4;
            case '3x3':
                return 9;
        }
    };


    function cleanUp(currentNodeId) {
        const index = treeData.passageway.findIndex((item) => {
            return item.currentNodeId == currentNodeId;
        });

        treeData.passageway.splice(index, 1);

        const node = document.querySelector(`.${currentNodeId}`);
        node && node.classList.remove('active');

        //console.log(treeData.passageway, node)

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

    // 给选择的节点添加class
    function addAClassToANode() {
        if (!treeData.passageway.length) {
            return;
        };


        // 添加
        for (let i = 0; i < treeData.passageway.length; i++) {
            const node = document.querySelector(`.${treeData.passageway[i].currentNodeId}`);
            node && !node.classList.contains('active') && node.classList.add('active')
        };
    };

    return {
        treeData,
        loadNode,
        handleNodeClick,
        search,
        cleanUp
    }
};
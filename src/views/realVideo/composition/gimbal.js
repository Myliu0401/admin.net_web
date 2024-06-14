import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { myPanTiltControl } from '/@/api/realTimeVideo/index.js';
import { ElMessage, ElMessageBox } from 'element-plus';

export default function (treeData, multiGridVideo) {

    const state = reactive({
        pressAndHold: false, // 是否按住
    });

    const gimbalData = reactive({
        speed: 127, // 移动速度
        Up: undefined, // 上
        UpLeft: undefined, // 左上
        UpRight: undefined, // 右上
        Down: undefined, // 下
        DownLeft: undefined, // 左下
        DownRight: undefined, // 右下
        Left: undefined, // 左
        Right: undefined, // 右
        Focus1: undefined, // 聚焦+
        Focus2: undefined, // 聚焦-
        Zoom1: undefined, // 变倍+
        Zoom2: undefined, // 变倍-
        Iris1: undefined, // 光圈+
        Iris2: undefined, // 光圈-
    });


    // 点击
    async function clickGimbal(type) {
        let key = null;
        let value = null;

        const id = multiGridVideo.value.currentId();

        if(!id){
            ElMessage({
                message: '请先选择通道',
                type: 'warning',
            });

           return false
        };

        switch (type) {
            case 'Up': key = 'Up'; value = 1;
                break;
            case 'UpLeft': key = 'UpLeft'; value = 2;
                break;
            case 'UpRight': key = 'UpRight'; value = 3;
                break;
            case 'Down': key = 'Down'; value = 4;
                break;
            case 'DownLeft': key = 'DownLeft'; value = 5;
                break;
            case 'DownRight': key = 'DownRight'; value = 6;
                break;
            case 'Left': key = 'Left'; value = 7;
                break;
            case 'Right': key = 'Right'; value = 8;
                break;
            case 'Focus1': key = 'Focus1'; value = 9;
                break;
            case 'Focus2': key = 'Focus1'; value = 10;
                break;
            case 'Zoom1': key = 'Zoom1'; value = 11;
                break;
            case 'Zoom2': key = 'Zoom2'; value = 12;
                break;
            case 'Iris1': key = 'Iris1'; value = 13;
                break;
            case 'Iris2': key = 'Iris2'; value = 14;
                break;
            case 'Stop': key = 'Stop'; value = 0;
        };

        await myPanTiltControl({
            id: id,
            cmd: value,
            speed: gimbalData.speed
        });

        ElMessage({
			message: '成功',
			type: 'success',
		});

        return true;
    };

    async function contentMousedown(type, bool = false){
        if(bool && !state.pressAndHold){
           return
        }
        bool || window.addEventListener('mouseup', mouseup);
        bool || (state.pressAndHold = true);
        const boolean = await clickGimbal(type);
        if(!boolean){
            return
        }
        contentMousedown(type, true);
    };


    function mouseup(){
        clickGimbal('Stop');
        state.pressAndHold = false;
        window.removeEventListener('mouseup', mouseup);
    };


    return { gimbalData, clickGimbal, contentMousedown };
};
import { defineAsyncComponent, reactive, ref, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';

export default function (state, container) {

    const example = ref(null); // jessibuca实例

    const directOptions = reactive({
        videoBuffer: 1, // 最大缓冲时长
        decoder: null, // worker地址
        forceNoOffscreen: true, // 是否不使用离屏模式（提升渲染能力）
        hiddenAutoPause: null, // 是否开启当页面的'visibilityState'变为'hidden'的时候，自动暂停播放。
        hasAudio: null, // 是否有音频，如果设置false，则不对音频数据解码，提升性能。
        rotate: null, // 设置旋转角度，只支持，0(默认) ，180，270 三个值。
        isResize: true, // 当为true的时候：视频画面做等比缩放后,高或宽对齐canvas区域,画面不被拉伸,但有黑边。 当为false的时候：视频画面完全填充canvas区域,画面会被拉伸。
        isFullResize: null, // 当为true的时候：视频画面做等比缩放后,完全填充canvas区域,画面不被拉伸,没有黑边,但画面显示不全
        isFlv: null, // 当为true的时候：ws协议不检验是否以.flv为依据，进行协议解析。
        debug: false, // 是否开启控制台调试打印
        timeout: 10, // 设置超时时长, 单位秒
        heartTimeout: null, // 设置超时时长, 单位秒
        heartTimeoutReplay: null, // 是否开启心跳超时之后自动再播放
        heartTimeoutReplayTimes: null, //  heartTimeoutReplay 重试次数
        loadingTimeout: null, // 设置超时时长, 单位秒
        loadingTimeoutReplay: null, // 是否开启loading超时之后自动再播放
        loadingTimeoutReplayTimes: null, // heartTimeoutReplay 重试次数
        supportDblclickFullscreen: false, // 是否支持屏幕的双击事件，触发全屏，取消全屏事件。
        showBandwidth: true, // 是否显示网速
        operateBtns: null, // 配置操作按钮 
        keepScreenOn: null, // 开启屏幕常亮，在手机浏览器上, canvas标签渲染视频并不会像video标签那样保持屏幕常
        isNotMute: true, // 是否开启声音，默认是关闭声音播放的
        loadingText: '正在加载中...', // 加载过程中文案。
        background: null, // 背景图片。
        useMSE: true, // 是否开启MediaSource硬解码
        useWCS: false, // 是否开启Webcodecs硬解码
        wcsUseVideoRender: null, // webcodecs硬解码是否通过video标签渲染
        autoWasm: null, // 在使用MSE或者Webcodecs 播放H265的时候，是否自动降级到wasm模式。
        hotKey: null, // 是否开启键盘快捷键
        wasmDecodeErrorReplay: null, // 是否开启解码失败重新播放
        controlAutoHide: true, // 底部控制台是否自动隐藏
        recordType: null, // 默认录制的视频格式
        useWebFullScreen: null, // 是否使用web全屏(旋转90度)（只会在移动端生效）。
    });

    const directData = reactive({
        smoothState: null, // 流畅状态
    });

    // 重置
    function reset() {
        directOptions.videoBuffer = 1;
        directOptions.decoder = null;
        directOptions.forceNoOffscreen = true;
        directOptions.hiddenAutoPause = null;
        directOptions.hasAudio = null;
        directOptions.rotate = null;
        directOptions.isResize = true;
        directOptions.isFullResize = null;
        directOptions.isFlv = null;
        directOptions.debug = false;
        directOptions.timeout = null;
        directOptions.heartTimeout = null;
        directOptions.heartTimeoutReplay = null;
        directOptions.heartTimeoutReplayTimes = null;
        directOptions.loadingTimeout = null;
        directOptions.loadingTimeoutReplay = null;
        directOptions.loadingTimeoutReplayTimes = null;
        directOptions.supportDblclickFullscreen = false;
        directOptions.showBandwidth = null;
        directOptions.operateBtns = null;
        directOptions.keepScreenOn = null;
        directOptions.isNotMute = true;
        directOptions.loadingText = '正在加载中...';
        directOptions.background = null;
        directOptions.useMSE = true;
        directOptions.useWCS = false;
        directOptions.wcsUseVideoRender = null;
        directOptions.autoWasm = null;
        directOptions.hotKey = null;
        directOptions.wasmDecodeErrorReplay = null;
        directOptions.controlAutoHide = true;
        directOptions.recordType = null;
        directOptions.useWebFullScreen = null;

    };

    // 调节音量
    function adjustingVolume(value) {
        console.log(value)
        if (!example.value) {
            return;
        };
        example.value.setVolume(value / 100);
    };

    // 暂停播放
    async function pause() {
        if (!example.value) {
            return;
        };
        return example.value.pause();
    };

    // 关闭视频,不释放底层资源
    function close() {
        if (!example.value) {
            return;
        };
        example.value.close();
    };

    // 关闭视频，释放底层资源
    function destroy() {
        if (!example.value) {
            return;
        };
        example.value.destroy();
    };

    // 清理画布为黑色背景
    function clearView() {
        if (!example.value) {
            return;
        };
        example.value.clearView();
    };

    // 播放视频
    async function play(url = undefined, options = {}) {
        if (!example.value) {
            return;
        };
        return example.value.play(url, options);
    };

    // 重新调整视图大小
    function resize() {
        if (!example.value) {
            return;
        };
        return example.value.resize();
    };


    // 全屏(取消全屏)播放视频
    function setFullscreen(bool) {
        if (!example.value) {
            return;
        };
        example.value.setFullscreen(bool);
    };


    // 截图
    function screenshot(filename = 'shipin', format = 'jpeg', quality = 1, type = 'download') {
        let text = '';
        if (!example.value) {
            text = '请先创建实例';

        } else if (!isPlaying()) {
            text = '请先创建实例';
        };
        if (text) {
            ElMessage({
                message: text,
                type: 'warning',
            });
            return;
        }
        example.value.screenshot(filename, format, quality, type);
    };

    // 录制视频
    function startRecord(fileName = 'luzhi', fileType = 'mp4') {
        if (!example.value) {
            return;
        };
        example.value.startRecord(fileName, fileType);
    };

    // 暂停录制并下载
    function stopRecordAndSave() {
        if (!example.value) {
            return;
        };
        example.value.stopRecordAndSave();
    };

    // 返回是否正在播放中状态
    function isPlaying() {
        if (!example.value) {
            return;
        };
        return example.value.isPlaying();
    };

    // 返回是否静音
    function isMute() {
        if (!example.value) {
            return;
        };
        return example.value.isMute();
    };

    // 返回是否正在录制
    function isRecording() {
        if (!example.value) {
            return;
        };
        let bool = null;
        try {
            bool = example.value.isRecording();
        } catch (err) {
            bool = false;
        };

        return bool;

    };

    // 创建
    function createDirect() {

        example.value = new window.Jessibuca({
            container: container.value,
            videoBuffer: directOptions.videoBuffer,
            isResize: directOptions.isResize,
            useMSE: directOptions.useMSE,
            useWCS: directOptions.useWCS,
            loadingText: directOptions.loadingText,
            debug: directOptions.debug,
            supportDblclickFullscreen: directOptions.supportDblclickFullscreen,
            showBandwidth: directOptions.showBandwidth,
            forceNoOffscreen: directOptions.forceNoOffscreen,
            isNotMute: directOptions.isNotMute,
            timeout: directOptions.timeout,
            controlAutoHide: directOptions.controlAutoHide
        });

        // 网速的流畅度
        example.value.on('performance', (performance) => {
            if (performance === 2) {
                directData.smoothState = "非常流畅";
            } else if (performance === 1) {
                directData.smoothState = "流畅";
            } else {
                directData.smoothState = '卡顿';
            }
        });

        // 播放过程中是否异常
        example.value.on("delayTimeout", () => {
            console.log('timeout')
        });

        // 录制是否结束
        example.value.on('recordEnd', () => {
            state.isRecording = false;
        });
    };

    return {
        directOptions,
        example,
        reset,
        adjustingVolume,
        pause,
        close,
        destroy,
        clearView,
        play,
        resize,
        setFullscreen,
        screenshot,
        startRecord,
        stopRecordAndSave,
        isPlaying,
        isMute,
        isRecording,
        createDirect,
        directData
    };
};
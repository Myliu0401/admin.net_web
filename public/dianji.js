const broadcastStatusClick = async () => {
	state.broadcastRtc = new ZLMRTCClient.Endpoint({
            debug: true, // 是否打印日志
            zlmsdpUrl: 'https://8.134.249.156:20006/index/api/webrtc?app=broadcast&stream=34020000001320004006&type=push', //流地址
            simulecast: false,
            useCamera: false,
            audioEnable: true,
            videoEnable: false,
            recvOnly: false,
          });

	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_NOT_SUPPORT, (e) => {// 获取到了本地流
		console.error('不支持webrtc', e)
	});

	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR, (e) => {// ICE 协商出错
		console.error('ICE 协商出错')
	});

	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, (e) => {// offer anwser 交换失败
		console.error('offer anwser 交换失败', e)
	});
	state.broadcastRtc.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (e) => {// offer anwser 交换失败
		console.log('状态改变', e)
	});
	state.broadcastRtc.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED, (e) => {// offer anwser 交换失败
		console.log('捕获流失败', e)
	});
};
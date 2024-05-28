开启广播：

player = new ZLMRTCClient.Endpoint(
                {
                  debug: true, // 是否打印日志
                  zlmsdpUrl: 'https://8.134.249.156:20006/index/api/webrtc?app=broadcast&stream=34020000001320004006&type=push', //流地址
                  simulecast: false,
                  useCamera: false,
                  audioEnable: true,
                  videoEnable: false,
                  recvOnly: false,
                  usedatachannel: false,
                }
            );
    
            player.on(ZLMRTCClient.Events.WEBRTC_ICE_CANDIDATE_ERROR,function(e)
            {// ICE 协商出错
                console.log('ICE 协商出错')
            });
    
            player.on(ZLMRTCClient.Events.WEBRTC_ON_REMOTE_STREAMS,function(e)
            {//获取到了远端流，可以播放
                console.log('播放成功',e.streams)
            });
    
            player.on(ZLMRTCClient.Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED,function(e)
            {// offer anwser 交换失败
                console.log('offer anwser 交换失败',e)
                stop();
            });
    
            player.on(ZLMRTCClient.Events.WEBRTC_ON_LOCAL_STREAM,function(s)
            {// 获取到了本地流
    
              document.getElementById('selfVideo').srcObject=s;
              document.getElementById('selfVideo').muted = true;
              
                //console.log('offer anwser 交换失败',e)
            });

            player.on(ZLMRTCClient.Events.CAPTURE_STREAM_FAILED,function(s)
            {// 获取本地流失败
    
              console.log('获取本地流失败')
            });

            player.on(ZLMRTCClient.Events.WEBRTC_ON_CONNECTION_STATE_CHANGE,function(state)
            {// RTC 状态变化 ,详情参考 https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
              console.log('当前状态==>',state)
            });

            player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_OPEN,function(event)
            {
              console.log('rtc datachannel 打开 :',event)
            });

            player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_MSG,function(event)
            {
              console.log('rtc datachannel 消息 :',event.data)
              document.getElementById('msgrecv').value = event.data
            });
            player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_ERR,function(event)
            {
              console.log('rtc datachannel 错误 :',event)
            });
            player.on(ZLMRTCClient.Events.WEBRTC_ON_DATA_CHANNEL_CLOSE,function(event)
            {
              console.log('rtc datachannel 关闭 :',event)
            });













关闭广播：
player.close();
player = null;
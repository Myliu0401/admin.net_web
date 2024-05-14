import request from '/@/utils/request';

// 查询装置时间
export function queryDeviceTime(data = {}){
    return request({
        url: '/api/sysNanWangDevice/time',
        method: 'post',
        data
     });
};


// 装置重启
export function deviceRestart(data = {}){
    return request({
        url: '/api/sysNanWangDevice/reboot',
        method: 'post',
        data
     });
};


// 发送短信
export function sendSMS(data = {}){
    return request({
        url: '/api/sysNanWangDevice/sendConfirmSms',
        method: 'post',
        data
     });
};


// 设置装置密码
export function setDevicePassword(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setPassword',
        method: 'post',
        data
     });
};


// 查询主站信息
export function queryMainSiteInfo(data = {}){
    return request({
        url: '/api/sysNanWangDevice/serverNetAddressPhoneNumber',
        method: 'post',
        data
     });
};


// 设置主站信息
export function setMasterStationInfo(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setServerNetAddressPhoneNumber',
        method: 'post',
        data
     });
};


// 查询装置配置
export function queryDeviceConfig(data = {}){
    return request({
        url: '/api/sysNanWangDevice/config',
        method: 'post',
        data
     });
};

// 设置装置配置
export function setDeviceConfig(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setFunctionConfig',
        method: 'post',
        data
     });
};

// 唤醒短信
export function wakeUpSMS(data = {}){
    return request({
        url: '/api/sysNanWangDevice/wakeUp',
        method: 'post',
        data
     });
};


// 获取设备通道列表
export function getChannelList(data = {}){
    return request({
        url: '/api/sysChannel/list',
        method: 'post',
        data
     });
};


// 获取拍照时间表
export function getPhotographySchedule(data = {}){
    return request({
        url: '/api/sysNanWangDevice/photoTimeTable',
        method: 'post',
        data
     });
};


// 主站下发参数配置
export function mainStationIssues(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setConfig',
        method: 'post',
        data
     });
};


// 获取主站装置文件列表
export function getListOfMainStation(data = {}){
    return request({
        url: '/api/sysNanWangDevice/deviceFileList',
        method: 'post',
        data
     });
};



// 拍摄短视频
export function takeShortVideo(data = {}){
    return request({
        url: '/api/sysNanWangDevice/takeShortVideo',
        method: 'post',
        data
     });
};


// 查询视频采集参数
export function videoCapture(data = {}){
    return request({
        url: '/api/sysNanWangDevice/videoCaptureParameter',
        method: 'post',
        data
     });
};


// 视频采集参数配置
export function setVideoCapture(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setVideoCaptureParameter',
        method: 'post',
        data
     });
};



// OSD参数查询
export function osdParam(data = {}){
    return request({
        url: '/api/sysNanWangDevice/osdParameter',
        method: 'post',
        data
     });
};


// OSD参数设置
export function setOsdParam(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setOsdParameter',
        method: 'post',
        data
     });
};


// 通道录像状态查询
export function videoRecordingStatusQuery(data = {}){
    return request({
        url: '/api/sysNanWangDevice/recordStatus',
        method: 'post',
        data
     });
};


// 录像策略参数查询
export function recordStrategyParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/recordStrategyParameter',
        method: 'post',
        data
     });
};


// 录像策略参数配置
export function setRecordStrategyParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setRecordStrategyParameter',
        method: 'post',
        data
     });
};

// 摄像机巡航参数查询
export function cruiseParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/cruiseParameter',
        method: 'post',
        data
     });
};

// 摄像机巡航参数设置
export function setCruiseParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setCruiseParameter',
        method: 'post',
        data
     });
};

// 摄像机巡检参数查询
export function inspectParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/inspectParameter',
        method: 'post',
        data
     });
};

// 摄像机巡检参数设置
export function setInspectParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setInspectParameter',
        method: 'post',
        data
     });
};

// 摄像机巡检策略查询
export function inspectStrategyParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/inspectStrategyParameter',
        method: 'post',
        data
     });
};


// 摄像机巡检策略配置
export function setInspectStrategyParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setInspectStrategyParameter',
        method: 'post',
        data
     });
};


// 智能分析参数查询
export function intelligentAnalysisParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/intelligentAnalysisParameter',
        method: 'post',
        data
     });
};

// 智能分析参数配置
export function setIntelligentAnalysisParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setIntelligentAnalysisParameter',
        method: 'post',
        data
     });
};

// 智能分析类型查询
export function intelligentAnalysisTypes(data = {}){
    return request({
        url: '/api/sysNanWangDevice/intelligentAnalysisType',
        method: 'post',
        data
     });
};


// 联动参数查询
export function linkageParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/linkageParameter',
        method: 'post',
        data
     });
};


// 联动参数配置
export function setLinkageParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setLinkageParameter',
        method: 'post',
        data
     });
};


// 重启设备
export function rebootDevice(data = {}){
    return request({
        url: '/api/sysGb28181Device/reboot',
        method: 'post',
        data
     });
};

// 强制关键帧
export function forceKeyframes(data = {}){
    return request({
        url: '/api/sysGb28181Device/forceIFrame',
        method: 'post',
        data
     });
};


// 开始录像
export function startRecording(data = {}){
    return request({
        url: '/api/sysGb28181Device/startRecord',
        method: 'post',
        data
     });
};


// 结束录像
export function endRecording(data = {}){
    return request({
        url: '/api/sysGb28181Device/stopRecord',
        method: 'post',
        data
     });
};


// 拉框缩放
export function dragZoom(data = {}){
    return request({
        url: '/api/sysChannel/dragZoom',
        method: 'post',
        data
     });
};


// 图像采集配置
export function setImageCollectionParameter(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setImageCollectionParameter',
        method: 'post',
        data
     });
};


// 拍照时间表设置
export function setPhotoTimeTable(data = {}){
    return request({
        url: '/api/sysNanWangDevice/setPhotoTimeTable',
        method: 'post',
        data
     });
};
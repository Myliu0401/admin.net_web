import request from '/@/utils/request';

// 获取设备状态数量
export function getOfDeviceStatuses(){
    return request({
        url: '/api/sysDevice/totalNumber',
        method: 'get'
    });
};


// 获取最新数据
export function getTheLatestAlarms(){
    return request({
        url: '/api/sysDevice/latestAlarm',
        method: 'get'
    });
};


// 获取线路塔杆总数
export function getTotalNumberOfLineTowers(){
    return request({
        url: '/api/sysTrackPole/totalNumber',
        method: 'get'
    });
};
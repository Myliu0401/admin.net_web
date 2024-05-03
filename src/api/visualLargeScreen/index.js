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


// 获取塔杆总数
export function getTotalNumberOfLineTowers(){
    return request({
        url: '/api/sysPole/totalNumber',
        method: 'get'
    });
};

// 获取线路总数
export function getTotalNumberOfLines(){
    return request({
        url: '/api/sysRailLine/totalNumber',
        method: 'get'
    });
};


// 获取塔杆数量
export function getCount(data = {}){
    return request({
        url: '/api/sysPole/count',
        method: 'post',
        data
    });
};


// 获取行政区
export function getRegion(id){
    return request({
        url: `/api/sysRegion/list?id=${id}`,
        method: 'get',
       
    });
};

// 获取所有省份的塔杆数量
export function getAllProle(data = {}){
    return request({
        url: '/api/sysPole/countForAllProvince',
        method: 'post',
        data
    });
}

// 获取最新图片
export function getLatestPictures(data = {}){
    return request({
        url: '/api/sysSnapshot/latest',
        method: 'post',
        data
    });
}


// 播放视频
export function getChannelVideo(data = {}){
    return request({
        url: '/api/sysChannel/realPlay',
        method: 'post',
        data
    });
}


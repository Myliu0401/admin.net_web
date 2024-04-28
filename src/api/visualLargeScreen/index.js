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
        url: '/api/sysRegion/list',
        method: 'get',
        data: { id  }
    });
};

// 获取所有身份的塔杆数量
export function getAllProle(data = {}){
    return request({
        url: '/api/sysPole/countForAllProvince',
        method: 'post',
        data
    });
}
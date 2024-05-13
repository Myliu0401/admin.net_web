import request from '/@/utils/request';

// 获取告警分页列表
export function getAlarm(data = {}){
    return request({
        url: '/api/sysAlarm/page',
        method: 'post',
        data
     });
};
import request from '/@/utils/request';


// 获取录像列表
export function getMyRecordings(data = {}){
     return request({
        url: '/api/sysRecord/list',
        method: 'post',
        data
     });
};

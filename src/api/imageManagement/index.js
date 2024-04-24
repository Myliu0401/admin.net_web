import request from '/@/utils/request';


// 获取图片管理列表
export function getMySnapshotPage(data = {}){
     return request({
        url: '/api/sysSnapshot/page',
        method: 'post',
        data
     });
};

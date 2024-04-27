import request from '/@/utils/request';


// 获取用户列表
export function getMyUserList(data = {}){
     return request({
        url: '/api/sysUser/page',
        method: 'post',
        data
     });
};


// 获取已授权设备列表
export function getMyAuthorizedDevices(data = {}){
    return request({
        url: '/api/sysPermission/list',
        method: 'post',
        data
     });
};

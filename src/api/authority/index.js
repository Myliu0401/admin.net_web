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

// 添加设备授权
export function addDevicesAuthorization(data = {}){
   return request({
      url: '/api/sysPermission/add',
      method: 'post',
      data
   });
};

// 解绑设备授权
export function unbindAuthorization(data = {}){
   return request({
      url: '/api/sysPermission/delete',
      method: 'post',
      data
   });
};

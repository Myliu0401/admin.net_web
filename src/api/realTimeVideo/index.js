import request from '/@/utils/request';


// 获取云控制
export function getMyCloudControl(){
     return request({
        url: '/api/sysDevice/channelRealPlay',
        method: 'post'
     });
};


// 获取树形节点
export function getMyTreeNodes(data = {}){
   return request({
      url: '/api/sysChannel/tree',
      method: 'post',
      data
   });
};

// 获取实时播放的url
export function getMyPlaybackURL(data = {}){
   return request({
      url: '/api/sysChannel/realPlay',
      method: 'post',
      data
   });
};

//  云台控制
export function myPanTiltControl(data = {}){
   return request({
      url: '/api/sysChannel/ptzCtrl',
      method: 'post',
      data
   });
};
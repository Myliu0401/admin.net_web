import request from '/@/utils/request';


// 获取设备树形结构
export function getEquipmentTreeStructure(){
     return request({
        url: '/api/sysDevice/tree',
        method: 'post'
     });
};


// 获取设备列表
export function getDeviceList(data = {}){
    return request({
        url: '/api/sysDevice/page',
        method: 'post',
        data
     });
};

// 获取塔杆列表
export function getListOfTowerPoles(data){
   return request({
      url: '/api/sysPole/page',
      method: 'post',
      data
   });
};


// 删除塔杆
export function deleteTowerPole(data = {}){
   return request({
      url: '/api/sysPole/delete',
      method: 'post',
      data
   });
};

// 获取直属线路
export function getRailLines(data = {}){
   return request({
      url: '/api/sysRailLine/page',
      method: 'post',
      data
   });
};


// 更新塔杆
export function updateTowerPoles(data = {}){
   return request({
      url: '/api/sysPole/update',
      method: 'post',
      data
   });
};

// 添加塔杆
export function addToerPoles(data = {}){
   return request({
      url: '/api/sysPole/add',
      method: 'post',
      data
   });
};


// 获取电压列表
export function getVoltageList(data = {}){
   return request({
      url: '/api/sysVoltageLevel/page',
      method: 'post',
      data
   });
};


// 删除电压
export function deleteLevel(data = {}){
   return request({
      url: '/api/sysVoltageLevel/delete',
      method: 'post',
      data
   });
};

// 添加电压
export function addLevel(data = {}){
   return request({
      url: '/api/sysVoltageLevel/add',
      method: 'post',
      data
   });
};

// 修改电压
export function setLevel(data = {}){
   return request({
      url: '/api/sysVoltageLevel/update',
      method: 'post',
      data
   });
};


// 获取线路列表
export function getLineList(data = {}){
   return request({
      url: '/api/sysRailLine/page',
      method: 'post',
      data
   });
};

// 获取行政区列表
export function getRegionList(data = {}){
   return request({
      url: '/api/sysRegion/page',
      method: 'post',
      data
   });
};


// 添加线路
export function addLine(data = {}){
   return request({
      url: '/api/sysRailLine/add',
      method: 'post',
      data
   });
};


// 修改线路
export function setLine(data = {}){
   return request({
      url: '/api/sysRailLine/update',
      method: 'post',
      data
   });
};

// 删除线路
export function deleteLine(data = {}){
   return request({
      url: '/api/sysRailLine/delete',
      method: 'post',
      data
   });
};



// 添加设备
export function addDevice(data = {}){
   return request({
      url: '/api/sysDevice/add',
      method: 'post',
      data
   });
};

// 获取设备树形结构
export function getDeviceTree(data = {}){
   return request({
      url: '/api/sysDevice/tree',
      method: 'post',
      headers: {
         'Content-Type': 'application/json'
       },
      data
   });
};


// 获取塔杆树形结构
export function getPoleTree(data = {}){
   return request({
      url: '/api/sysPole/tree',
      method: 'post',
      headers: {
         'Content-Type': 'application/json'
       },
      data
   });
};

// 获取线路树形结构
export function getLineTree(data = {}){
   return request({
      url: '/api/sysRailLine/tree',
      method: 'post',
      headers: {
         'Content-Type': 'application/json'
       },
      data
   });
};


// 获取设备通道列表
export function getMyChannelList(data = {}){
   return request({
      url: '/api/sysChannel/channelList',
      method: 'post',
      data
   });
};


// 添加通道
export function addChannel(data = {}){
   return request({
      url: '/api/sysChannel/addChannel',
      method: 'post',
      data
   });
};


// 修改通道
export function setChannel(data = {}){
   return request({
      url: '/api/sysChannel/updateChannel',
      method: 'post',
      data
   });
};


// 删除通道
export function delelteMyChannel(data = {}){
   return request({
      url: '/api/sysChannel/deleteChannel',
      method: 'post',
      data
   });
};

// 删除设备
export function deleteDevice(data = {}){
   return request({
      url: '/api/sysDevice/delete',
      method: 'post',
      data
   });
};


// 修改设备
export function setDevice(data = {}){
   return request({
      url: '/api/sysDevice/update',
      method: 'post',
      data
   });
};


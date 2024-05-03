import request from '/@/utils/request';


// 获取录像列表
export function getMyRecordings(data = {}){
     return request({
        url: '/api/sysRecord/list',
        method: 'post',
        data
     });
};


// 获取播放文件
export function getRecordSrc(data = {}){
   return request({
      url: '/api/sysRecord/playback',
      method: 'post',
      data
   });
}

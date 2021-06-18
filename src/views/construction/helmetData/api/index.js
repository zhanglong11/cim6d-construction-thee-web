import http, { iots } from '@/utils/axios'
const { post, get } = iots

export default {
  //获取设备和用户信息列表
  getSafeCapDeviceList: data => {
    return post(`/safeCap/getSafeCapDeviceList`, data)
  },
  //新建安全帽
  getSafeCapDeviceAdd: data => {
    return post(`/safeCap/addSafeCapDevice`, data)
  },
  //-编辑安全帽
  getSafeCapDeviceUpdate: data => {
    return post(`/safeCap/updateSafeCapDevice`, data)
  },
  //获取报警信息列表
  getSosList: data => {
    return post(`/safeCap/getSosList`, data)
  },
  //测试假接口
  getPlanList: data => {
    return http.post('cim6d/system/project/list', data)
  },
  //获取围栏列表
  getFenceList: data => {
    return post('/safeCap/getFenceList', data)
  },
  //分页查询安全帽信息列表
  getSafeCapDeviceList: data => {
    return post('/safeCap/getSafeCapDeviceList', data)
  },
  //新建电子围栏
  getaddFence: data => {
    return post('/safeCap/addFence', data)
  },
  //电子围栏-更新
  getUpdateFence: data => {
    return post('/safeCap/updateFence', data)
  },
  //电子围栏-删除
  getdelFence: data => {
    return post('/safeCap/delFence', data)
  },
  //安全帽管理-详情
  getSafeCapDeviceDetail: id => {
    return get(`/safeCap/getSafeCapDeviceDetail/${id}`)
  },
  //安全帽管理-删除
  getdelSafeCapDevice: data => {
    return post('/safeCap/delSafeCapDevice', data)
  },
  //电子围栏-详情
  getFenceDetail: id => {
    return get(`/safeCap/getFenceDetail/${id}`)
  }
}

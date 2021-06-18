import axios from '@/utils/axios'

export default {
  //列表
  list: param =>
    axios.material.post(`/equipment/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //添加
  add: param =>
    axios.material.post(`/equipment/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //更新
  update: param =>
    axios.material.post(`/equipment/update`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //删除
  delete: id => axios.material.get(`/equipment/delete/${id}`),

  //详情
  detail: id => axios.material.get(`/equipment/get/${id}`),

  //code
  // code: param => axios.material.post(`/equipment/createQrcode`, param, { responseType: 'blob' }),
  code: id => axios.material.get(`equipment/createQrcode/${id}`, { responseType: 'blob' }),

  // 二维码页面详情接口
  infoQrcodeDetail: id => axios.material.get(`/noToken/equipment/infoQrcode/${id}`),

  importEquipment: param => axios.material.post(`/equipment/importEquipment`, param)
}

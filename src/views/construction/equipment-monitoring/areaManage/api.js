import axios, { iot } from '@/utils/axios'
const { post, get } = iot
export default {
  //列表
  list: param => post(`monitor/area/list`, param),

  //添加
  add: param => post(`monitor/area/add`, param),

  //更新
  update: param => post(`monitor/area/update`, param),

  //删除
  delete: id => get(`monitor/area/delete/${id}`),

  //详情
  detail: id => get(`monitor/area/get/${id}`),

  //关联
  link: data => post(`/equipment/problem/bim/bind`, data),

  //取消关联
  unLink: id => get(`/equipment/problem/bim/unbind/${id}`),

  //查看关联
  watchLink: id => get(`/equipment/problem/bim/get/${id}`)
}

import http, { iot } from '@/utils/axios'
const { post, get } = iot
export default {
  //列表
  list: param => post(`/device/list`, param),

  //关联
  link: data => post(`/device/bim/bind`, data),

  //取消关联
  unLink: id => get(`/device/bim/unbind/${id}`),

  //查看关联
  watchLink: id => get(`/device/bim/get/${id}`)
}

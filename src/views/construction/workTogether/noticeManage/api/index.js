import http from '@/utils/axios'
export default {
  //列表
  receiveList: data => http.post(`/message/record/receive/list`, data),

  //列表
  sendList: data => http.post(`/message/record/send/list`, data),

  //添加
  add: data => http.post(`/message/record/person/add`, data),

  //详情
  detail: id => http.get(`/message/record/get/${id}`),

  //已读
  read: data => http.post(`/message/record/batchRead`, data)
}

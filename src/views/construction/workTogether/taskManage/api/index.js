import http from '@/utils/axios'
export default {
  //列表
  list: data => http.post(`/task/list`, data),

  //添加
  add: data => http.post(`/task/add`, data),

  //编辑
  update: data => http.post(`/task/update`, data),

  //取消
  remove: id => http.get(`task/update/cancelFlag/${id}`),

  //详情
  detail: id => http.get(`/task/get/${id}`),

  //催办
  urge: data => http.post(`/task/update/urgedFlag`, data),

  //编辑
  result: data => http.post(`/task/update/taskResult`, data)
}

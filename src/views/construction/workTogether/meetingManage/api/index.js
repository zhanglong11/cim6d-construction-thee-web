import http from '@/utils/axios'
export default {
  //列表
  list: data =>
    http.post(`/meeting/list`, {
      ...data,
      projectId: localStorage.getItem('projectId')
    }),

  //添加
  add: data =>
    http.post(`/meeting/add`, {
      ...data,
      projectId: localStorage.getItem('projectId')
    }),

  //编辑
  update: data =>
    http.post(`/meeting/update`, {
      ...data,
      projectId: localStorage.getItem('projectId')
    }),

  //取消
  remove: data => http.post(`/meeting/batchDelete`, data),

  //详情
  detail: id => http.get(`/meeting/get/${id}`)
}

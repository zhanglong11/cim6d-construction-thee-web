import http from '@/utils/axios'

export default {
  list: data => http.construction.post('/schedule/task/list', data),

  bimList: data => http.construction.post('/schedule/task/simulateTime', data),

  //获取模型进度
  getModelProgress: data => http.construction.post(`/schedule/bim/cycle/list`, data)
}

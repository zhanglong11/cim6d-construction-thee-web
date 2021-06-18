import http from '@/utils/axios'
export default {
  //列表
  getList: data => {
    return http.construction.post(`/pigeonhole/pageList`, data)
  },
  getDetail: id => {
    return http.construction.get(`/pigeonhole/detail/${id}`)
  }
}

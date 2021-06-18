// 施工日志Api
import { construction } from '@/utils/axios'
const { post, get } = construction
export default {
  //日志列表
  getLogList: data => {
    return post(`/dailydiary/list`, data)
  },

  //日志详情
  getLogDetail: id => {
    return get(`/dailydiary/get/${id}`)
  },

  //新建日志
  add: param =>
    construction.post(`/dailydiary/add`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}

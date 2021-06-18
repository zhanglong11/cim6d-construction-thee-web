import http from '@/utils/axios'
export const messageApi = {
  // 获取消息分类列表 @author zhangshilong
  getCommonMessageList: () => {
    return http.system({
      url: '/message/category/getCommonMessageList',
      method: 'get'
    })
  },
  // 查询未读数量 @author yangjiaqi
  getUnreadMessage: () => {
    return http.system({
      url: '/message/record/unread/count',
      method: 'get'
    })
  }
}

import { system } from '@/utils/axios'

// 微信推送消息列表 @author yangjiaqi
export function getWeChatMessageList(body) {
  return system.post('message/record/wxSendMessage/list', body)
}

// 微信推送消息接收情况 @author yangjiaqi
export function getReceiverList(messageId) {
  return system.get(`message/record/wxMessage/receiverList/${messageId}`)
}

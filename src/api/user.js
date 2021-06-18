/*
 * @Description:
 * @Version:
 * @Autor:
 * @Date: 2020-02-10 10:26:01
 * @LastEditTime: 2020-03-06 15:04:59
 */
import request from '@/utils/axios'

export function login(data) {
  return request.post('/login', data, {})
}

// 获取用户项目列表
export function getProjectList() {
  return request.get('cim6d/system/user/project/list')
}
// 获取用户信息
export function getUserInfo() {
  return request.get('cim6d/system/user/current/get')
}

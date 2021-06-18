import { construction } from '@/utils/axios'

// 图纸列表
export function getDrawingsList(data) {
  return construction.post(`/drawings/list`, data)
}

// 新增图纸
export function addDrawings(data) {
  return construction.post(`/drawings/add`, data)
}

// 编辑图纸
export function updateDrawings(data) {
  return construction.post(`/drawings/update`, data)
}

// 获取图纸详情
export function getDrawingsDetail(id) {
  return construction.get(`/drawings/get/${id}`)
}

// 删除图纸
export function removeDrawing(id) {
  return construction.get(`/drawings/delete/${id}`)
}

import { labourSafety } from '@/utils/axios'
const { post, get } = labourSafety

const projectId = localStorage.getItem('projectId')
export default {
  /*安全培训*/
  // 安全培训列表
  getLabourSafetyTrainingList: data => {
    return post(`/training/list`, data)
  },
  // 删除安全培训
  deleteLabourSafetyTraining: ids => {
    return get(`/training/delete/${ids}`)
  },
  // 安全培训详情
  getLabourSafetyTrainingDetail: id => {
    return get(`/training/get/${id}`)
  },
  // 安全培训新增
  addLabourSafetyTraining: data => {
    return post(`/training/add`, data)
  },
  // 安全培训编辑
  updateLabourSafetyTraining: data => {
    return post(`/training/update`, data)
  }
}

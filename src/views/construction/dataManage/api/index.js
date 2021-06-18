import axios from '@/utils/axios'

export default {
  /*项目资料*/
  // 列表
  getProjectDataList: data => axios.construction.post(`/project/document/list`, data),

  // 新增
  // addProjectData: data => axios.construction.post(`/document/save`, data),

  // 更新
  // updateProjectData: data => axios.construction.post(`/document/update`, data),

  // 保存
  saveProjectData: data => axios.construction.post(`/project/document/save`, data),

  // 详情
  getProjectDataDetail: id => axios.construction.get(`/project/document/get/${id}`),

  // 删除
  deleteProjectData: id => axios.construction.get(`/project/document/delete/${id}`),

  /*验收规范*/
  // 列表
  getCheckSpecificList: data => axios.construction.post(`/quality/checkSpecific/pageList`, data),

  // 新增
  addCheckSpecific: data => axios.construction.post(`/quality/checkSpecific/add`, data),

  // 更新
  updateCheckSpecific: data => axios.construction.post(`/quality/checkSpecific/update`, data),

  // 详情
  getCheckSpecificDetail: id => axios.construction.get(`/quality/checkSpecific/get/${id}`),

  // 删除
  deleteCheckSpecific: id => axios.construction.get(`/quality/checkSpecific/delete/${id}`),

  /*安全管理制度*/
  // 列表
  getManageRegimeList: data => axios.construction.post(`/manageRegime/list`, data),

  // 新增
  addManageRegime: data => axios.construction.post(`/manageRegime/add`, data),

  // 编辑
  updateManageRegime: data => axios.construction.post(`/manageRegime/update`, data),

  // 详情
  getManageRegimeDetail: id => axios.construction.get(`/manageRegime/get/${id}`),

  // 删除
  deleteManageRegime: id => axios.construction.get(`/manageRegime/delete/${id}`),
  // 安全教育视频
  getEducationList: data => axios.construction.post(`/safetyEducationVideo/list`, data),
  getEducationAdd: data => axios.construction.post(`/safetyEducationVideo/add`, data),
  getEducationUpdate: data => axios.construction.post(`/safetyEducationVideo/update`, data),
  getEducationDetail: id => axios.construction.get(`/safetyEducationVideo/get/${id}`),
  getEducationDelete: id => axios.construction.get(`/safetyEducationVideo/delete/${id}`)
}

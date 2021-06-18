import axios from '@/utils/axios'

export default {
  /*监理规划登记*/
  // 列表
  getPlanRegistrationList: data => axios.construction.post(`/supervisorPlanRegistration/list`, data),

  // 新增
  // addPlanRegistration: data => axios.construction.post(`/supervisorPlanRegistration/add`, data),

  // 更新
  // updatePlanRegistration: data => axios.construction.post(`/supervisorPlanRegistration/update`, data),

  // 保存
  savePlanRegistration: data => axios.construction.post(`/supervisorPlanRegistration/save`, data),

  // 保存并提交
  saveAndSubmitRegistration: data => axios.construction.post(`/supervisorPlanRegistration/saveAndSubmit`, data),

  // 详情
  getPlanRegistrationDetail: id => axios.construction.get(`/supervisorPlanRegistration/get/${id}`),

  // 删除
  deletePlanRegistration: id => axios.construction.get(`/supervisorPlanRegistration/update/deleteFlag/${id}`),

  /*监理实施细则*/
  // 列表
  getImplementRulesList: data => axios.construction.post(`/supervisorEnforcementRegulation/list`, data),

  // 新增
  // addImplementRules: data => axios.construction.post(`/supervisorEnforcementRegulation/add`, data),

  // 更新
  // updateImplementRules: data => axios.construction.post(`/supervisorEnforcementRegulation/update`, data),

  // 保存
  saveImplementRules: data => axios.construction.post(`/supervisorEnforcementRegulation/save`, data),

  // 保存并提交
  saveAndSubmitImplementRules: data => axios.construction.post(`/supervisorEnforcementRegulation/saveAndSubmit`, data),

  // 详情
  getImplementRulesDetail: id => axios.construction.get(`/supervisorEnforcementRegulation/get/${id}`),

  // 删除
  deleteImplementRules: id => axios.construction.get(`/supervisorEnforcementRegulation/update/deleteFlag/${id}`)
}

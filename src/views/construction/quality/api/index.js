/*
质量管理的api
 */
import http from '@/utils/axios'
export default {
  //保存检查计划
  savePlan: data => {
    return http.construction.post('/inspectPlan/save', data)
  },
  //保存并启用检查计划
  saveAndStartPlan: data => {
    return http.construction.post('/inspectPlan/saveAndEnable', data)
  },
  // 获取检查计划列表
  getPlanList: data => {
    return http.construction.post('/inspectPlan/list', data)
  },
  //获取计划详情
  getPlanDetail: id => {
    return http.construction.get(`/inspectPlan/get/${id}`, {})
  },
  //删除计划
  deletePlanById: data => {
    return http.construction.post(`/inspectPlan/batchDelete`, data)
  },
  //停用计划
  stopPlanById: id => {
    return http.construction.get(`/inspectPlan/disable/${id}`, {})
  },
  //启用计划
  startPlanById: id => {
    return http.construction.get(`/inspectPlan/enable/${id}`, {})
  },
  //根据检查id获取问题详细列表
  getIssueListByInspectId: id => {
    return http.construction.get(`/inspectPlan/inspectProblem/listAll/${id}`, {})
  },
  //添加检查情况
  addIssueInspectList: data => {
    return http.construction.post('/inspectPlan/inspectProblem/add', data)
  },
  //获取问题列表
  getIssueList: data => {
    return http.construction.post('/inspectProblem/list', data)
  },
  //获取问题详情
  getIssueDetailById: id => {
    return http.construction.get(`/inspectProblem/get/${id}`, {})
  },
  //保存问题
  saveIssue: data => {
    return http.construction.post('/inspectProblem/save', data)
  },
  //保存并下达问题
  saveAddReleaseIssue: data => {
    return http.construction.post('/inspectProblem/saveAndRelease', data)
  },
  //删除问题
  deleteIssueById: data => {
    return http.construction.post('/inspectProblem/batchDelete', data)
  },
  //问题下达
  releaseIssueById: id => {
    return http.construction.get(`/inspectProblem/release/${id}`, {})
  },
  //整改保存
  handleRectify: data => {
    return http.construction.post('/inspectProblem/rectify', data)
  },
  //复查保存
  handleReview: data => {
    return http.construction.post('/inspectProblem/review', data)
  },
  //验收申请列表
  getInspectionList: data => {
    return http.construction.post('qualityAcceptanceApply/list', data)
  },
  //验收申请详情
  getInspectionInfo: id => {
    return http.construction.get(`qualityAcceptanceApply/get/${id}`, {})
  },
  //验收申请保存
  getInspectionSave: data => {
    return http.construction.post('qualityAcceptanceApply/save', data)
  },
  //验收申请保存并提交
  getInspectionSaveAndSubmit: data => {
    return http.construction.post('qualityAcceptanceApply/saveAndSubmit', data)
  },
  //验收申请删除
  deleteInspectionById: data => {
    return http.construction.post(`qualityAcceptanceApply/batchDelete`, data)
  },

  //关联
  link: data => http.construction.post(`/quality/problem/bim/bind`, data),

  //取消关联
  unLink: id => http.construction.get(`/quality/problem/bim/unbind/${id}`),

  //查看关联
  watchLink: id => http.construction.get(`/quality/problem/bim/get/${id}`),

  //新工程质量通知单
  //提交工程质量通知单
  //删除
  getQualityProblemDelete: data => http.construction.post(`/qualityProblem/batchDelete`, data),
  //列表
  getQualityProblem: data => http.construction.post(`/qualityProblem/list`, data),
  //提交
  getEngineersaveAndSubmit: data => http.construction.post(`/engineeringQualityNotice/saveAndSubmit`, data),
  //详情
  getEngineeringDetail: id => http.construction.get(`/engineeringQualityNotice/get/${id}`),
  //草稿
  getEngineerSave: data => http.construction.post(`/engineeringQualityNotice/save`, data),
  //修改
  getEngineerUpdate: data => http.construction.post(`/engineeringQualityNotice/update`, data),
  //修改并提交
  getEngineerUpdateAndSub: data => http.construction.post(`/engineeringQualityNotice/updateAndSubmit`, data),
  //下载
  getEngineeringQualityNoticeDown: id => {
    return http.construction.get(`/engineeringQualityNotice/download/${id}`, { responseType: 'blob' })
  },

  //工程业务联系单
  //提交
  getBusinesssaveAndSubmit: data => http.construction.post(`/engineeringBusinessContact/saveAndSubmit`, data),
  //详情
  getBusinessDetail: id => http.construction.get(`/engineeringBusinessContact/get/${id}`),
  //草稿
  getBusinessSave: data => http.construction.post(`/engineeringBusinessContact/save`, data),
  //修改
  getBusinessUpdate: data => http.construction.post(`/engineeringBusinessContact/update`, data),
  getBusinessUpdateAndSubmit: data => http.construction.post(`/engineeringBusinessContact/updateAndSubmit`, data),
  //下载
  getEngineeringBusinessContactDown: id =>
    http.construction.get(`/engineeringBusinessContact/download/${id}`, { responseType: 'blob' }),

  //工作业务联系
  //提交
  getworkAndSubmit: data => http.construction.post(`/workBusinessContact/saveAndSubmit`, data),
  //详情
  getworkDetail: id => http.construction.get(`/workBusinessContact/get/${id}`),
  //草稿
  getworksSave: data => http.construction.post(`/workBusinessContact/save`, data),
  //修改
  getworksUpdate: data => http.construction.post(`/workBusinessContact/update`, data),
  getworksUpdateAndSub: data => http.construction.post(`/workBusinessContact/updateAndSubmit`, data),
  //下载
  getworkBusinessDown: id => http.construction.get(`/workBusinessContact/download/${id}`, { responseType: 'blob' }),

  //获取质量问题类型 1工程质量通知单 2工程业务联系单 3工作业务联系单
  getqualityTypekDetail: id => http.construction.get(`/qualityProblem/getType/${id}`)
}

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
  //特殊作业
  //获取特殊作业申请列表
  getSpecialList: data => {
    return http.construction.post('/safetySpecialOperationApply/list', data)
  },
  //保存特种作业申请
  addSpecial: data => {
    return http.construction.post('/safetySpecialOperationApply/save', data)
  },
  //保存并提交特种作业申请
  submitSpecial: data => {
    return http.construction.post('/safetySpecialOperationApply/submitAndAudit', data)
  },
  //获取特种作业申请详情
  getSpecialDetail: id => {
    return http.construction.get(`/safetySpecialOperationApply/get/${id}`, {})
  },
  //删除特种作业申请
  deleteSpecialById: data => {
    return http.construction.post(`/safetySpecialOperationApply/delete`, data)
  },
  //危险源
  //危险源列表
  getDangerList: data => {
    return http.construction.post(`/dangersource/list`, data)
  },
  //添加危险源
  addDanger: data => {
    return http.construction.post(`/dangersource/add`, data)
  },
  //更新危险源
  updateDanger: data => {
    return http.construction.post(`/dangersource/update`, data)
  },
  //删除危险源
  deleteDanger: data => {
    return http.construction.post(`/dangersource/batchDelete`, data)
  },
  //获取详情
  getDangerDetail: id => {
    return http.construction.get(`/dangersource/get/${id}`, {})
  },
  //危险源整改复查列表
  getDangerInspectList: data => {
    return http.construction.post(`/inspectDangerSource/list`, data)
  },
  //危险源检查详情
  getDangerInspectDetail: id => {
    return http.construction.get(`/inspectDangerSource/get/${id}`, {})
  },
  //危险源整改保存
  handleDangerRectify: data => {
    return http.construction.post('/inspectDangerSource/rectify', data)
  },
  //危险源复查保存
  handleDangerReview: data => {
    return http.construction.post('/inspectDangerSource/review', data)
  },
  //获取所有危险源
  getAllDangerList: data => {
    return http.construction.post(`/dangersource/listAll`, data)
  },
  //获取所有位置
  getPositionList: id => {
    return http.construction.get(`/inspectDangerSource/getPlace/${id}`, {})
  },
  //添加危险源检查
  addDangerInspect: data => {
    return http.construction.post(`/inspectDangerSource/add`, data)
  },

  //关联
  link: data => http.construction.post(`/safety/problem/bim/bind`, data),

  //取消关联
  unLink: id => http.construction.get(`/safety/problem/bim/unbind/${id}`),

  //查看关联
  watchLink: id => http.construction.get(`/safety/problem/bim/get/${id}`),

  //新安全文明接口
  //安全隐患
  //删除
  getsafetyHiddenDelete: data => {
    return http.construction.post(`/safetyProblem/batchDelete`, data)
  },
  //列表
  getsafetyHiddenList: data => {
    return http.construction.post(`/safetyProblem/list`, data)
  },
  getsafetyHiddenSave: data => {
    return http.construction.post(`/safetyHiddenDangerCheckRecord/save`, data)
  },
  getsafetyHiddenUpdate: data => {
    return http.construction.post(`/safetyHiddenDangerCheckRecord/update`, data)
  },
  getsafetyHiddenDetail: id => {
    return http.construction.get(`/safetyHiddenDangerCheckRecord/get/${id}`)
  },
  //查询时间范围内的安全隐患检查明细记录
  getsafetyHiddenTimeAnd: data => {
    return http.construction.post(`/safetyHiddenDangerCheckRecord/selectHiddenDangerCheckRecordDetails`, data)
  },
  //下载隐患
  getSafetyHiddenDwon: id => {
    return http.construction.get(`/safetyHiddenDangerCheckRecord/download/${id}`, { responseType: 'blob' })
  },
  //周安全检查回复表
  //草稿
  getReplySave: data => {
    return http.construction.post(`/safetyWeekCheckReply/save`, data)
  },
  getReplySubmit: data => {
    return http.construction.post(`/safetyWeekCheckReply/saveAndSubmit`, data)
  },
  getReplyUpdate: data => {
    return http.construction.post(`/safetyWeekCheckReply/update`, data)
  },
  getReplyUpdateAndSubmit: data => {
    return http.construction.post(`/safetyWeekCheckReply/updateAndSubmit`, data)
  },
  getReplyDetail: id => {
    return http.construction.get(`/safetyWeekCheckReply/get/${id}`)
  },
  //下载-周安全检查回复
  getWeekCheckDown: id => {
    return http.construction.get(`/safetyWeekCheckReply/download/${id}`, { responseType: 'blob' })
  },
  //下载-周安全检查回复表格
  getWeekCheckDownForm: id => {
    return http.construction.get(`/safetyWeekCheckReply/downloadForm/${id}`, { responseType: 'blob' })
  },
  //安全月度联合检查回复表
  //草稿
  getcheckSave: data => {
    return http.construction.post(`/safetyMonthCheckReply/save`, data)
  },
  getcheckSubmit: data => {
    return http.construction.post(`/safetyMonthCheckReply/saveAndSubmit`, data)
  },
  getcheckUpdate: data => {
    return http.construction.post(`/safetyMonthCheckReply/update`, data)
  },
  getcheckUpdateAndSubmit: data => {
    return http.construction.post(`/safetyMonthCheckReply/updateAndSubmit`, data)
  },
  getcheckDetail: id => {
    return http.construction.get(`/safetyMonthCheckReply/get/${id}`)
  },
  //下载-安全月度联合检查回复
  getSafetyMonthDwon: id => {
    return http.construction.get(`/safetyMonthCheckReply/download/${id}`, { responseType: 'blob' })
  },
  //下载-安全月度联合检查回复
  getSafetyMonthDwonFrom: id => {
    return http.construction.get(`/safetyMonthCheckReply/downloadForm/${id}`, { responseType: 'blob' })
  },
  //质量安全整改回复单
  //草稿
  getrectifySave: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/save`, data)
  },
  getrectifySubmit: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/saveAndSubmit`, data)
  },
  getrectifyUpdate: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/update`, data)
  },
  getrectifyUpdateAndSubmit: data => {
    return http.construction.post(`/qualitySafetyRectificationReply/updateAndSubmit`, data)
  },
  getrectifyDetail: id => {
    return http.construction.get(`/qualitySafetyRectificationReply/get/${id}`)
  },
  //下载-安全整改回复
  getQualitySafetyDown: id => {
    return http.construction.get(`/qualitySafetyRectificationReply/download/${id}`, { responseType: 'blob' })
  },
  //获取安全问题类型
  getsafetyTypekDetail: id => {
    return http.construction.get(`/safetyProblem/getType/${id}`)
  }
}

import axios from '@/utils/axios'
export default {
  //进度列表
  progressList: param =>
    axios.schedule.post(`task/analysis/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //质量列表
  qualityList: param =>
    axios.epcPPP.post(`/quality/bimIssueList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //安全列表
  safeList: param =>
    axios.epcPPP.post(`/safetyIssue/bimIssueList`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //当前模型列表
  bimTree: () => axios.epcPPP.post(`/projectBim/${localStorage.getItem('projectId')}/bimTree`, {}),

  //模型进度
  getProgressModel: param =>
    axios.construction.post(`schedule/bim/cycle/list`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //质量模型
  getQualityModel: param =>
    axios.epcPPP.post(`/quality/issue/getQualityIssueGuid`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    }),

  //安全模型
  getSafeModel: param =>
    axios.epcPPP.post(`/safetyIssue/getSafetyIssueGuid`, {
      projectId: localStorage.getItem('projectId'),
      ...param
    })
}

import axios from '@/utils/axios'

export default {
  /*我的工作*/
  getIndexWorkViewList: data => axios.construction.post(`/index/work/view`, data),

  /*进度管理*/
  getScheduleTaskPanel: () => axios.construction.get(`/schedule/task/panel`),

  //获取项目详情
  getProjectDetail: id => axios.system.get(`/cim6d/system/project/get/${id}`)
}

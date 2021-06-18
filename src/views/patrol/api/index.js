import { construction } from '@/utils/axios'
const { post, get } = construction

export default {
  // 巡更小组列表
  getPatrolGroupList: data => {
    return post(`/patrol/group/list`, data)
  },
  // 新增巡更小组
  addPatrolGroup: data => {
    return post(`/patrol/group/add`, data)
  },
  // 修改巡更小组
  updatePatrolGroup: data => {
    return post(`/patrol/group/update`, data)
  },
  // 删除巡更小组
  deletePatrolGroup: patrolGroupId => {
    return get(`/patrol/group/delete/${patrolGroupId}`)
  },

  // 巡更路线列表
  getPatrolRouteList: data => {
    return post(`/patrol/route/list`, data)
  },
  // 新增巡更路线
  addPatrolRoute: data => {
    return post(`/patrol/route/add`, data)
  },
  // 修改巡更路线
  updatePatrolRoute: data => {
    return post(`/patrol/route/update`, data)
  },
  // 巡更路线详情
  getPatrolRouteDetail: patrolRouteId => {
    return get(`/patrol/route/get/${patrolRouteId}`)
  },
  // 巡更路线删除
  deletePatrolRoute: patrolRouteId => {
    return get(`/patrol/route/delete/${patrolRouteId}`)
  },

  // 巡更计划列表
  getPatrolPlanList: data => {
    return post(`/patrol/list`, data)
  },
  // 新增巡更计划
  addPatrolPlan: data => {
    return post(`/patrol/add`, data)
  },
  // 修改巡更计划
  updatePatrolPlan: data => {
    return post(`/patrol/update`, data)
  },
  // 删除巡更计划
  deletePatrolPlan: patrolId => {
    return get(`/patrol/delete/${patrolId}`)
  },
  // 上传报告
  uploadPatrolReport: data => {
    return post(`/patrol/uploadReport`, data)
  },
  // 巡更计划详情
  getPatrolDetail: patrolId => {
    return get(`/patrol/get/${patrolId}`)
  },
  //巡更打卡
  getClockList: data => {
    return post(`/patrolClockIn/list`, data)
  },
  getClockDetail: id => {
    return get(`/patrolClockIn/get/${id}`)
  }
}

// 施工路由管理
import homeRouter from './home/router' // 首页路由
import { suppliesRouter } from './suppliesEquipment/router' // 物资与设备管理
// import { workflowRouter } from './workflow/router' // 工作流
import { equipmentMonitoringRouter } from './equipment-monitoring/router' // 设备监控路由
import { iotRouter } from './iot/router' // 环境监控
// import { healthyRouter } from './healthy/router' // 健康管理
// import { modelRouter } from './model/router' // BIM模型管理
import { labourRouter } from './labourManage/router' // 劳务管理
// import { noticeRouter } from './notice/router' // 公告路由
import { dataManageRouter } from './dataManage/router' // 资料管理路由
import { qualityRouter } from './quality/router' // 质量管理路由
import { safetyRouter } from './safety/router' // 安全管理路由
import workTogether from './workTogether/router' // 工作协同路由
import modelManage from './modelManage/router' // BIM模型管理路由
import { constructionLogRouter } from './constructionLog/router' // 施工日志路由
import { appraisalRouter } from './appraisal/router' // 考勤设置
import { engineeringAmountManageRouter } from './engineeringAmountManage/router' // 工程量
import { helmetManageRouter } from './helmetData/router' // 安全帽
export const constructionRouter = [
  ...homeRouter, // 首页
  ...suppliesRouter, // 物资与设备管理
  // ...workflowRouter, // 工作流
  ...equipmentMonitoringRouter, // 设备监控路由
  ...iotRouter, // 环境监控
  ...labourRouter, // 劳务管理
  ...workTogether, //工作协同
  modelManage, // BIM模型管理路由
  ...dataManageRouter, // 资料管理路由
  ...qualityRouter, //质量管理路由
  ...safetyRouter, //安全管理路由
  ...require('./schedule/router').default, // 进度管理
  ...constructionLogRouter, // 施工日志路由
  ...appraisalRouter,
  ...engineeringAmountManageRouter,
  ...helmetManageRouter
]

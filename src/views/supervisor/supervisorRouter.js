// 监理路由管理
import { supervisorPlanRouter } from './supervisorPlan/router'
import { supervisionRecordRouter } from './supervisorRecord/router' // 监理规划管理

export const supervisorRouter = [
  ...supervisorPlanRouter, // 监理规划管理
  ...supervisionRecordRouter //监理现场记录
]

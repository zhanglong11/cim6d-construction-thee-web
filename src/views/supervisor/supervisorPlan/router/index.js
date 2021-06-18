// 监理规划管理路由
import Layout from '@/layout'
import shell from '@/utils/shell'

export const supervisorPlanRouter = [
  {
    path: '/supervisionPlan',
    alwaysShow: true,
    component: Layout,
    redirect: '/supervisionPlan/planRegistrationList',
    name: 'SupervisionPlan',
    meta: { title: '监理规划管理', icon: 'el-icon-coordinate' },
    children: [
      // 监理规划登记
      {
        path: 'planRegistrationList',
        name: 'PlanRegistrationList',
        component: () => import('../planRegistration/list'),
        meta: { title: '监理规划登记' }
      },
      // 监理规划登记审核页
      {
        path: 'planRegistrationApproval/:id',
        name: 'PlanRegistrationApproval',
        hidden: true,
        component: () => import('../planRegistration/approvalPlanRegistration'),
        meta: { title: '监理规划审核', activeMenu: '/supervisionPlan/planRegistrationList' }
      },
      // 监理实施细则
      {
        path: 'implementRulesList',
        name: 'ImplementRulesList',
        component: () => import('../implementRules/list'),
        meta: { title: '监理实施细则' }
      },
      // 监理实施细则审核页
      {
        path: 'implementRulesApproval/:id',
        name: 'ImplementRulesApproval',
        hidden: true,
        component: () => import('../implementRules/approvalImplementRules'),
        meta: { title: '监理实施细则审核', activeMenu: '/supervisionPlan/implementRulesList' }
      }
    ]
  }
]

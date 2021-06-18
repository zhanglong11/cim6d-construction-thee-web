/* 质量路由 */
import Layout from '@/layout'
/**
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中,支持/src/icons/svg格式和element-ui icon两种形式
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */
export const safetyRouter = [
  {
    path: '/safety',
    component: Layout,
    redirect: '/safety/safetyPlanList',
    name: 'Safety',
    meta: { title: '安全管理', icon: 'el-icon-umbrella' },
    children: [
      {
        path: 'safetyPlanList',
        name: 'SafetyPlanList',
        component: () => import('../planList'),
        meta: { title: '安全检查计划' }
      },
      {
        path: 'safetyPlanDetail',
        name: 'SafetyPlanDetail',
        hidden: true,
        component: () => import('../safetyPlanDetail'),
        meta: { title: '安全检查计划详情', activeMenu: '/safety/safetyPlanList' }
      },
      {
        path: 'safetyIssueList',
        name: 'SafetyIssueList',
        component: () => import('../issueList'),
        meta: { title: '安全文明问题' }
      },
      {
        path: 'safetyIssueDetail',
        name: 'SafetyIssueDetail',
        hidden: true,
        component: () => import('../safetyIssueDetail'),
        meta: { title: '安全文明问题详情', activeMenu: '/safety/safetyIssueList' }
      },
      {
        path: 'safetySpecialList',
        name: 'SafetySpecialList',
        component: () => import('../special'),
        meta: { title: '特种作业施工申请' }
      },
      {
        path: 'safetySpecialDetail',
        name: 'SafetySpecialDetail',
        hidden: true,
        component: () => import('../specialDetail'),
        meta: { title: '特种作业施工申请详情', activeMenu: '/safety/safetySpecialList' }
      },
      {
        path: 'safetyDangerList',
        name: 'SafetyDangerList',
        component: () => import('../danger'),
        meta: { title: '危险源台账' }
      },
      {
        path: 'safetyDangerDetail',
        name: 'SafetyDangerDetail',
        hidden: true,
        component: () => import('../dangerDetail'),
        meta: { title: '危险源详情', activeMenu: '/safety/safetyDangerList' }
      },
      {
        path: 'safetyDangerCheckRectifyList',
        name: 'SafetyDangerCheckRectifyList',
        component: () => import('../dangerCheckList'),
        meta: { title: '危险源检查与整改记录' }
      },
      {
        path: 'safetyDangerCheckRectifyDetail',
        name: 'SafetyDangerCheckRectifyDetail',
        hidden: true,
        component: () => import('../dangerCheckDetail'),
        meta: { title: '危险源检查与整改记录详情', activeMenu: '/safety/safetyDangerCheckRectifyList' }
      },
      {
        path: 'safetyDangerAroundInspect',
        name: 'SafetyDangerAroundInspect',
        hidden: true,
        component: () => import('../dangerAroundInspect'),
        meta: { title: '危险源巡查', activeMenu: '/safety/safetyDangerCheckRectifyList' }
      },
      {
        path: 'safeLink',
        name: 'SafeLink',
        component: () => import('../safeLink'),
        meta: { title: '安全问题关联BIM模型' }
      },
      {
        path: 'safetyCultureList',
        name: 'SafetyCultureList',
        component: () => import('../safetyCulture'),
        meta: { title: '安全问题表单' }
      },
      {
        path: 'perilAdd',
        name: 'PerilAdd',
        hidden: true,
        component: () => import('../safetyCulture/perilAdd'),
        meta: { title: '新建《中交天航2a标段安全隐患检查记录》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'perilEdit',
        name: 'PerilEdit',
        hidden: true,
        component: () => import('../safetyCulture/perilAdd'),
        meta: { title: '修改《中交天航2a标段安全隐患检查记录》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'perilDetail',
        name: 'PerilDetail',
        hidden: true,
        component: () => import('../safetyCulture/periDetail'),
        meta: { title: '《中交天航2a标段安全隐患检查记录》详情', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'replyAdd',
        name: 'ReplyAdd',
        hidden: true,
        component: () => import('../safetyCulture/replyAdd'),
        meta: { title: '新建《周安全检查回复表》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'replyDetail',
        name: 'ReplyDetail',
        hidden: true,
        component: () => import('../safetyCulture/replyDetail'),
        meta: { title: '《周安全检查回复表》详情', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'replyEdit',
        name: 'ReplyEdit',
        hidden: true,
        component: () => import('../safetyCulture/replyAdd'),
        meta: { title: '修改《周安全检查回复表》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'checkAdd',
        name: 'CheckAdd',
        hidden: true,
        component: () => import('../safetyCulture/checkAdd'),
        meta: { title: '新建《安全月度联合检查回复表》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'checkEdit',
        name: 'CheckEdit',
        hidden: true,
        component: () => import('../safetyCulture/checkAdd'),
        meta: { title: '修改《安全月度联合检查回复表》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'checkDetail',
        name: 'CheckDetail',
        hidden: true,
        component: () => import('../safetyCulture/checkDetail'),
        meta: { title: '《安全月度联合检查回复表》详情', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'rectifyAdd',
        name: 'RectifyAdd',
        hidden: true,
        component: () => import('../safetyCulture/rectifyAdd'),
        meta: { title: '新建《质量安全整改回复单》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'rectifyEdit',
        name: 'RectifyEdit',
        hidden: true,
        component: () => import('../safetyCulture/rectifyAdd'),
        meta: { title: '修改《质量安全整改回复单》', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'rectifyDetail',
        name: 'RectifyDetail',
        hidden: true,
        component: () => import('../safetyCulture/rectifyDetail'),
        meta: { title: '《质量安全整改回复单》详情', activeMenu: '/safety/safetyCultureList' }
      },
      {
        path: 'safetyDetail',
        name: 'SafetyDetail',
        hidden: true,
        component: () => import('../safetyCulture/Detail'),
        meta: { title: '详情', activeMenu: '/safety/safetyCultureList' }
      }
    ]
  }
]

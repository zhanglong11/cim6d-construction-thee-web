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
export const qualityRouter = [
  {
    path: '/quality',
    component: Layout,
    redirect: '/quality/qualityPlanList',
    name: 'Quality',
    meta: { title: '质量管理', icon: 'el-icon-postcard' },
    children: [
      {
        path: 'qualityPlanList',
        name: 'QualityPlanList',
        component: () => import('../planList'),
        meta: { title: '质量检查计划' }
      },
      {
        path: 'qualityPlanDetail',
        name: 'QualityPlanDetail',
        hidden: true,
        component: () => import('../qualityPlanDetail'),
        meta: { title: '质量检查计划详情', activeMenu: '/quality/qualityPlanList' }
      },
      {
        path: 'qualityIssueList',
        name: 'QualityIssueList',
        component: () => import('../issueList'),
        meta: { title: '质量问题' }
      },
      {
        path: 'qualityIssueDetail',
        name: 'QualityIssueDetail',
        hidden: true,
        component: () => import('../qualityIssueDetail'),
        meta: { title: '质量问题详情', activeMenu: '/quality/qualityIssueList' }
      },
      {
        path: 'qualityInspectionList',
        name: 'QualityInspectionList',
        component: () => import('../inspectionList'),
        meta: { title: '验收申请' }
      },
      {
        path: 'qualityInspectionDetail',
        name: 'QualityInspectionDetail',
        hidden: true,
        component: () => import('../inspectDetail'),
        meta: { title: '验收申请详情', activeMenu: '/quality/qualityInspectionList' }
      },
      {
        path: 'qualityLink',
        name: 'QualityLink',
        component: () => import('../qualityLink'),
        meta: { title: '质量问题关联BIM模型' }
      },
      {
        path: 'qualityProblem',
        name: 'QualityProblem',
        component: () => import('../problem'),
        meta: { title: '质量问题表单' }
      },
      {
        path: 'qualityAdd',
        name: 'QualityAdd',
        hidden: true,
        component: () => import('../problem/qualityEdit.vue'),
        meta: { title: '新建《工程质量通知单》', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'qualityEdit',
        name: 'QualityEdit',
        hidden: true,
        component: () => import('../problem/qualityEdit'),
        meta: { title: '修改《工程质量通知单》', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'qualityDetail',
        name: 'QualityDetail',
        hidden: true,
        component: () => import('../problem/qualityDetail'),
        meta: { title: '《工程质量通知单》详情', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'projectAdd',
        name: 'ProjectAdd',
        hidden: true,
        component: () => import('../problem/projectEdit'),
        meta: { title: '新建《工程业务联系单》', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'projectEdit',
        name: 'ProjectEdit',
        hidden: true,
        component: () => import('../problem/projectEdit'),
        meta: { title: '修改《工程业务联系单》', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'projectDetail',
        name: 'ProjectDetail',
        hidden: true,
        component: () => import('../problem/projectDetail'),
        meta: { title: '《工程业务联系单》详情', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'workDetail',
        name: 'WorkDetail',
        hidden: true,
        component: () => import('../problem/workDetail'),
        meta: { title: '《工作业务联系单》详情', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'workAdd',
        name: 'WorkAdd',
        hidden: true,
        component: () => import('../problem/workEdit'),
        meta: { title: '新建《工作业务联系单》', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'workEdit',
        name: 'WorkEdit',
        hidden: true,
        component: () => import('../problem/workEdit'),
        meta: { title: '修改《工作业务联系单》', activeMenu: '/quality/qualityProblem' }
      },
      {
        path: 'problemDetail',
        name: 'ProblemDetail',
        hidden: true,
        component: () => import('../problem/Detail'),
        meta: { title: '详情', activeMenu: '/quality/qualityProblem' }
      }
    ]
  }
]

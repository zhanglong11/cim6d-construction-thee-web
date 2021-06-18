// BIM模型管理路由
import Layout from '@/layout/index'

export const appraisalRouter = [
  {
    path: '/appraisal',
    name: 'Appraisal',
    component: Layout,
    meta: { title: '考勤设置', icon: 'el-icon-files' },
    children: [
      {
        path: 'appraisalManage',
        name: 'AppraisalManage',
        component: () => import('../appraisalManage'),
        meta: { title: '考勤组管理' }
      },
      {
        path: 'appraisalAdd',
        name: 'AppraisalAdd',
        hidden: true,
        component: () => import('../appraisalManage/Edit.vue'),
        meta: { title: '新建考勤组', activeMenu: '/appraisal/appraisalManage' }
      },
      {
        path: 'appraisalEdit/:id',
        name: 'AppraisalEdit',
        hidden: true,
        component: () => import('../appraisalManage/Edit.vue'),
        meta: { title: '编辑考勤组', activeMenu: '/appraisal/appraisalManage' }
      },
      {
        path: 'appraisalDetail/:id',
        name: 'AppraisalDetail',
        hidden: true,
        component: () => import('../appraisalManage/Detail.vue'),
        meta: { title: '考勤组详情', activeMenu: '/appraisal/appraisalManage' }
      },
      {
        path: 'monthlyManage',
        name: 'MonthlyManage',
        component: () => import('../monthly'),
        meta: { title: '月度汇总' }
      },
      {
        path: 'everyManage',
        name: 'EveryManage',
        component: () => import('../everyday'),
        meta: { title: '每日统计' }
      }
    ]
  }
]

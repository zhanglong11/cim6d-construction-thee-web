// 监理规划管理路由
import Layout from '@/layout'
import shell from '@/utils/shell'

export const supervisionRecordRouter = [
  {
    path: '/supervisionRecord',
    alwaysShow: true,
    component: Layout,
    redirect: '/supervisionRecord/LogList',
    name: 'SupervisionRecord',
    meta: { title: '监理现场记录', icon: 'el-icon-document' },
    children: [
      // 监理日志
      {
        path: 'supervisionRecordLog',
        name: 'SupervisionRecordLog',
        component: () => import('../log/list'),
        meta: { title: '监理日志' }
      },
      // 监理周报
      {
        path: 'supervisionRecordWeekly',
        name: 'SupervisionRecordWeekly',
        component: () => import('../weekly/list'),
        meta: { title: '监理周报' }
      },
      //  监理月报
      {
        path: 'supervisionRecordMonthly',
        name: 'SupervisionRecordMonthly',
        component: () => import('../monthly/list'),
        meta: { title: '监理月报' }
      },
      //旁站记录
      {
        path: 'supervisionRecordRecord',
        name: 'SupervisionRecordRecord',
        component: () => import('../record/list'),
        meta: { title: '旁站记录' }
      }
    ]
  }
]

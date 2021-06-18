import Layout from '@/layout/index'

export default [
  {
    path: '/schedule',
    name: 'Schedule',
    redirect: '/schedule/main/plan',
    component: Layout,
    meta: { title: '进度管理', icon: 'el-icon-date' },
    children: [
      {
        path: 'view',
        name: 'ScheduleView',
        component: () => import('./view'),
        meta: { title: '进度查看' },
        children: []
      },
      {
        path: 'view/add',
        name: 'ScheduleAdd',
        component: () => import('./view/Add'),
        meta: { title: '新增进度文件' },
        hidden: true
      },
      {
        path: 'view/edit/:id',
        name: 'ScheduleEdit',
        component: () => import('./view/Add'),
        meta: { title: '更新进度文件' },
        hidden: true
      },
      {
        path: 'bimRelated',
        name: 'ScheduleBimRelated',
        component: () => import('./bimLink'),
        meta: { title: '进度关联BIM模型' }
      },
      {
        path: 'analyze',
        name: 'ScheduleAnalyze',
        component: () => import('./analyze/index'),
        meta: { title: '进度分析' }
      }
    ]
  }
]

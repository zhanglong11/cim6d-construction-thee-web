// 智能巡更路由
import Layout from '@/layout'
export const patrolRouter = [
  {
    path: '/patrol',
    name: 'Patrol',
    alwaysShow: true,
    component: Layout,
    redirect: '/patrol/patrolPlan',
    meta: { title: '智能巡更管理', icon: 'el-icon-help' },
    children: [
      {
        path: 'patrolPlan',
        name: 'PatrolPlan',
        component: () => import('../patrolPlan'),
        meta: { title: '巡更计划管理' }
      },
      {
        path: 'patrolPath',
        name: 'PatrolPath',
        component: () => import('../patrolPath'),
        meta: { title: '巡更路线管理' }
      },
      {
        path: 'patrolPlathAdd',
        name: 'PatrolPlathAdd',
        component: () => import('../patrolPath/patrolPlathAdd'),
        hidden: true,
        meta: { title: '新增巡更路线', activeMenu: '/patrol/patrolPath' }
      },
      {
        path: 'patrolPlathEdit/:id',
        name: 'PatrolPlathEdit',
        component: () => import('../patrolPath/patrolPlathEdit'),
        hidden: true,
        meta: { title: '编辑巡更路线', activeMenu: '/patrol/patrolPath' }
      },
      {
        path: 'patrolPlathDetail/:id',
        name: 'PatrolPlathDetail',
        component: () => import('../patrolPath/patrolPlathDetail'),
        hidden: true,
        meta: { title: '查看巡更路线', activeMenu: '/patrol/patrolPath' }
      },
      {
        path: 'patrolGroup',
        name: 'PatrolGroup',
        component: () => import('../patrolGroup'),
        meta: { title: '巡更小组管理' }
      },
      {
        path: 'patrolClock',
        name: 'PatrolClock',
        component: () => import('../patrolClock'),
        meta: { title: '巡更打卡管理' }
      },
      {
        path: 'clockDetail/:id',
        name: 'ClockDetail',
        component: () => import('../patrolClock/clockDetail'),
        hidden: true,
        meta: { title: '巡更打卡详情', activeMenu: '/patrol/patrolClock' }
      }
    ]
  }
]

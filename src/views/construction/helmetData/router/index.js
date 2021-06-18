// 安全帽管理路由
import Layout from '@/layout'

export const helmetManageRouter = [
  {
    path: '/helmetData',
    component: Layout,
    name: 'HelmetData',
    meta: { title: '智能安全帽管理', icon: 'el-icon-postcard' },
    children: [
      //安全帽
      {
        path: 'helmetManageList',
        name: 'HelmetManageList',
        component: () => import('../helmetManage'),
        meta: { title: '安全帽管理' }
      },
      {
        path: 'fenceManageList',
        name: 'FenceManageList',
        component: () => import('../fenceManage'),
        meta: { title: '电子围栏' }
      },
      {
        path: 'fenceAdd',
        name: 'FenceAdd',
        hidden: true,
        component: () => import('../fenceManage/addFence.vue'),
        meta: { title: '新建电子围栏', activeMenu: '/helmetData/fenceManageList' }
      },
      {
        path: 'fenceEdit',
        name: 'FenceEdit',
        hidden: true,
        component: () => import('../fenceManage/addFence.vue'),
        meta: { title: '编辑电子围栏', activeMenu: '/helmetData/fenceManageList' }
      },
      {
        path: 'fenceDetail',
        name: 'FenceDetail',
        hidden: true,
        component: () => import('../fenceManage/Detail.vue'),
        meta: { title: '电子围栏详情', activeMenu: '/helmetData/fenceManageList' }
      },
      {
        path: 'alarmManageList',
        name: 'AlarmManageList',
        component: () => import('../alarmManage'),
        meta: { title: '报警记录' }
      },
      {
        path: 'alarmManageDetail',
        name: 'AlarmManageDetail',
        hidden: true,
        component: () => import('../alarmManage/detailHelmetDetail.vue'),
        meta: { title: '报警记录详情', activeMenu: '/helmetData/alarmManageList' }
      }
    ]
  }
]

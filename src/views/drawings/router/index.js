// 图纸管理路由
import Layout from '@/layout'
export const drawingsRouter = [
  {
    path: '/drawings',
    name: 'Drawings',
    alwaysShow: true,
    component: Layout,
    redirect: '/drawings/drawingsManage',
    meta: { title: '图纸管理', icon: 'el-icon-picture-outline' },
    children: [
      {
        path: 'drawingsManage',
        name: 'DrawingsManage',
        component: () => import('../drawingsManage'),
        meta: { title: '图纸管理' }
      },
      {
        path: 'drawingsAdd',
        name: 'DrawingsAdd',
        component: () => import('../drawingsManage/DrawingsAdd2'),
        hidden: true,
        meta: { title: '新增图纸', activeMenu: '/drawings/drawingsManage' }
      },
      {
        path: 'drawingsEdit/:id',
        name: 'DrawingsEdit',
        component: () => import('../drawingsManage/DrawingsEdit2'),
        hidden: true,
        meta: { title: '编辑图纸', activeMenu: '/drawings/drawingsManage' }
      },
      {
        path: 'drawingsDetail/:id',
        name: 'DrawingsDetail',
        component: () => import('../drawingsManage/DrawingsDetail2'),
        hidden: true,
        meta: { title: '查看图纸', activeMenu: '/drawings/drawingsManage' }
      }
    ]
  }
]

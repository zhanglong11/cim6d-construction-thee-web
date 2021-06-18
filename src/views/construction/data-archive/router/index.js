import Layout from '@/layout'
export const dataArchive = [
  {
    path: '/data-archive',
    alwaysShow: true,
    component: Layout,
    redirect: '/data-archive/data-archive-list',
    name: 'DataArchive',
    meta: { title: '资料归档', icon: 'el-icon-video-camera' },
    children: [
      {
        path: 'data-archive-list',
        name: 'DataArchiveList',
        component: () => import('../index'),
        meta: { title: '归档' }
      },
      {
        path: 'data-archive-detail/:id',
        name: 'DataArchiveDetail',
        hidden: true,
        component: () => import('../detail'),
        meta: { title: '归档详情', activeMenu: '/data-archive/data-archive-list' }
      }
    ]
  }
]

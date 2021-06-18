import Layout from '@/layout'

export default {
  path: '/modelManage',
  name: 'ModelManage',
  redirect: '/modelManage/model',
  component: Layout,
  alwaysShow: true,
  meta: { title: 'BIM模型管理', icon: 'el-icon-office-building' },
  children: [
    {
      path: 'model',
      name: 'BimModelWatch',
      component: () => import('../index'),
      meta: { title: 'BIM模型查看' }
    },
    {
      path: 'manage',
      name: 'BimModelManage',
      component: () => import('../manage'),
      meta: { title: '模型管理' }
    }
  ]
}

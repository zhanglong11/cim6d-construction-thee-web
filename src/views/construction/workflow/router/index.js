// 工作流路由
import Layout from '@/layout/index'
export const workflowRouter = [
  {
    name: 'WorkFlow',
    path: '/workflow',
    meta: { title: '工作流', icon: 'el-icon-data-line' },
    component: Layout,
    redirect: '/workflow/model',
    children: [
      {
        path: 'model',
        name: 'WorkflowModel',
        meta: { title: '工作流', icon: 'el-icon-data-line' },
        component: () => import('../model')
      },
      {
        path: 'model/:id',
        name: 'WorkflowModelEdit',
        meta: { title: '模型管理', hiddenLayout: false, activeMenu: '/workflow/model' },
        hidden: true,
        component: () => import('../model/$id')
      }
    ]
  }
]

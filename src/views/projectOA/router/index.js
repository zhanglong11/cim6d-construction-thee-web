// OA管理首页路由
import Layout from '@/layout'
import shell from '@/utils/shell'

export default [
  {
    path: '/ProjectOA',
    component: Layout,
    redirect: '/ProjectOA/home?tabIndex=first',
    name: 'ProjectOA',
    meta: { title: 'OA管理', icon: 'el-icon-document' },
    children: [
      {
        path: 'home',
        name: 'ProjectOAHome',
        component: () => import('../home'),
        meta: { title: 'OA管理', keepAlive: false }
      },
      {
        path: 'customFormAdd',
        name: 'ProjectOACustomFormAdd',
        hidden: true,
        component: () => import('../home/addCustomForm'),
        meta: { title: '新建自定义表单' }
      },
      {
        path: 'customFormEdit',
        name: 'ProjectOACustomFormEdit',
        hidden: true,
        component: () => import('../home/addCustomForm'),
        meta: { title: '编辑自定义表单' }
      },
      {
        path: 'fixedFormEdit/:id',
        name: 'ProjectOAFixedFormEdit',
        hidden: true,
        component: () => import('../home/editFixedForm'),
        meta: { title: '编辑固定表单' }
      },
      {
        path: 'customFormDetail',
        name: 'ProjectOACustomFormDetail',
        hidden: true,
        component: () => import('../home/customDetail'),
        meta: { title: '自定义表单详情' }
      },
      {
        path: 'customFormAdd',
        name: 'ProjectOACustomAdd',
        hidden: true,
        component: () => import('../home/customAdd'),
        meta: { title: '新建自定义表单' }
      }
      /*{
        path: 'form-fill-detail/:id',
        name: 'FormFillDetail',
        hidden: true,
        component: () => import('../components/FormFillDetail'),
        meta: { title: '表单填报详情' }
      }*/
    ]
  }
]

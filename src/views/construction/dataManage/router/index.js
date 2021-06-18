// 资料管理路由
import Layout from '@/layout'
import shell from '@/utils/shell'

export const dataManageRouter = [
  {
    path: '/dataManage',
    alwaysShow: true,
    component: Layout,
    redirect: '/dataManage/qualityData/qualityDataList',
    name: 'DataManage',
    meta: { title: '资料管理', icon: 'el-icon-folder' },
    children: [
      // 质量资料
      {
        path: 'acceptanceSpecificationList',
        name: 'AcceptanceSpecificationList',
        component: () => import('../qualityData/acceptanceSpecification/list'),
        meta: { title: '质量验收规范' }
      },
      {
        path: 'acceptanceSpecificationAdd',
        name: 'AcceptanceSpecificationAdd',
        hidden: true,
        component: () => import('../qualityData/acceptanceSpecification/add'),
        meta: { title: '新建验收规范', activeMenu: '/dataManage/qualityData/acceptanceSpecificationList' }
      },
      {
        path: 'acceptanceSpecificationEdit/:id',
        name: 'AcceptanceSpecificationEdit',
        hidden: true,
        component: () => import('../qualityData/acceptanceSpecification/add'),
        meta: { title: '编辑验收规范', activeMenu: '/dataManage/qualityData/acceptanceSpecificationList' }
      },
      {
        path: 'acceptanceSpecificationDetail/:id',
        name: 'AcceptanceSpecificationDetail',
        hidden: true,
        component: () => import('../qualityData/acceptanceSpecification/detail'),
        meta: { title: '验收规范详情', activeMenu: '/dataManage/qualityData/acceptanceSpecificationList' }
      },
      // 安全资料
      {
        path: 'safeRegimeList',
        name: 'SafeRegimeList',
        component: () => import('../safeData/safeRegime/list'),
        meta: { title: '安全资料管理' }
      },
      {
        path: 'safeRegimeAdd',
        name: 'SafeRegimeAdd',
        hidden: true,
        component: () => import('../safeData/safeRegime/add'),
        meta: { title: '新建安全资料', activeMenu: '/dataManage/safeData/safeRegimeList' }
      },
      {
        path: 'safeRegimeEdit',
        name: 'SafeRegimeEdit',
        hidden: true,
        component: () => import('../safeData/safeRegime/add'),
        meta: { title: '编辑安全资料', activeMenu: '/dataManage/safeData/safeRegimeList' }
      },
      {
        path: 'safeRegimeDetail',
        name: 'SafeRegimeDetail',
        hidden: true,
        component: () => import('../safeData/safeRegime/detail'),
        meta: { title: '安全资料详情', activeMenu: '/dataManage/safeData/safeRegimeList' }
      },
      // 项目资料
      // {
      //   path: 'projectDataList',
      //   name: 'ProjectDataList',
      //   component: () => import('../projectData/list'),
      //   meta: { title: '项目资料' }
      // },
      // {
      //   path: 'projectDataAdd',
      //   name: 'ProjectDataAdd',
      //   hidden: true,
      //   component: () => import('../projectData/add'),
      //   meta: { title: '新建项目资料', activeMenu: '/dataManage/projectDataList' }
      // },
      // {
      //   path: 'projectDataEdit',
      //   name: 'ProjectDataEdit',
      //   hidden: true,
      //   component: () => import('../projectData/add'),
      //   meta: { title: '编辑项目资料', activeMenu: '/dataManage/projectDataList' }
      // },
      // {
      //   path: 'projectDataDetail',
      //   name: 'ProjectDataDetail',
      //   hidden: true,
      //   component: () => import('../projectData/detail'),
      //   meta: { title: '项目资料详情', activeMenu: '/dataManage/projectDataList' }
      // },
      //安全教育视频
      {
        path: 'educationManage',
        name: 'EducationManage',
        component: () => import('../educationManage'),
        meta: { title: '安全教育视频' }
      },
      {
        path: 'projectFile',
        name: 'ProjectFile',
        component: () => import('../projectFile'),
        meta: { title: '项目资料' }
      },
      {
        path: 'drawingsFile',
        name: 'DrawingsFile',
        component: () => import('../drawingsFile'),
        meta: { title: '图纸管理' }
      }
    ]
  }
]

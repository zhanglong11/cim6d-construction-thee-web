// 劳务管理路由
import Layout from '@/layout'
/**
 *
 * hidden: true                   如果设置为true，则项目将不会显示在侧边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果不始终设置Show，则当项具有多个子路由时，
 *                                它将成为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为no redirect，则breadcrumb中不会重定向
 * name:'router-name'             名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'             图标显示在侧栏中,支持/src/icons/svg格式和element-ui icon两种形式
    breadcrumb: false            如果设置为false，则该项将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

export const labourRouter = [
  {
    path: '/labourManage',
    component: Layout,
    name: 'Labour',
    meta: { title: '劳务管理', icon: 'el-icon-user' },
    children: [
      {
        path: 'companyData',
        name: 'LabourCompanyList',
        component: () => import('../companyData'),
        meta: { title: '劳务公司管理' }
      },
      {
        path: 'peopleData',
        name: 'LabourPeopleList',
        component: () => import('../peopleData'),
        meta: { title: '劳务人员管理' }
      },
      {
        path: 'peopleplay',
        name: 'LabourPlayList',
        component: () => import('../playData'),
        meta: { title: '劳务人员工资支付管理' }
      },
      {
        path: 'attenceData',
        name: 'LabourAttenceList',
        component: () => import('../attenceData'),
        meta: { title: '考勤管理' }
      },
      {
        path: 'playData/DownPlay',
        component: () => import('../playData/DownPlay'),
        hidden: true,
        meta: { title: '工资支付单模板', activeMenu: '/labourManage/playData' }
      },
      {
        path: 'peopleData/components/MyCheck',
        name: 'LabourPeopleListAttences',
        component: () => import('../peopleData/components/MyCheck'),
        hidden: true,
        meta: { title: '查看考勤', activeMenu: '/labourManage/peopleData' }
      },

      {
        path: 'workType/new',
        component: () => import('../workType/edit'),
        hidden: true,
        meta: { title: '新建工种', activeMenu: '/labourManage/workType' }
      },
      {
        path: 'workType/:id',
        component: () => import('../workType/edit'),
        hidden: true,
        meta: { title: '编辑工种', activeMenu: '/labourManage/workType' }
      },
      // {
      //   path: 'companyDate/new',
      //   name: 'LabourAdd',
      //   component: () => import('../companyDate/edit'),
      //   hidden: true,
      //   meta: { title: '新建劳务公司信息', activeMenu: '/labourManage/companyDate' }
      // },
      // {
      //   path: 'companyDate/:id',
      //   name: 'LabourEdit',
      //   component: () => import('../companyDate/edit'),
      //   hidden: true,
      //   meta: { title: '编辑劳务公司信息', activeMenu: '/labourManage/companyDate' }
      // },
      // {
      //   path: 'group',
      //   name: 'LabourGroup',
      //   component: () => import('../group'),
      //   meta: { title: '班组管理' }
      // },
      {
        path: 'group/new',
        component: () => import('../group/edit'),
        name: 'LabourGroupAdd',
        hidden: true,
        meta: { title: '新建班组', activeMenu: '/labourManage/group' }
      },
      {
        path: 'group/:id',
        component: () => import('../group/edit'),
        name: 'LabourGroupEdit',
        hidden: true,
        meta: { title: '修改班组信息', activeMenu: '/labourManage/group' }
      },
      // {
      //   path: 'worker',
      //   name: 'LabourWorker',
      //   component: () => import('../worker'),
      //   meta: { title: '工人信息' }
      // },
      {
        path: 'worker/new',
        component: () => import('../worker/edit'),
        name: 'LabourWorkerAdd',
        hidden: true,
        meta: { title: '新增人员信息 - 基本信息（1/2）', activeMenu: '/labourManage/worker' }
      },
      {
        path: 'worker/:id',
        name: 'LabourWorkerEdit',
        component: () => import('../worker/edit'),
        hidden: true,
        meta: { title: '编辑人员信息 - 基本信息（1/2）', activeMenu: '/labourManage/worker' }
      },
      {
        path: 'worker/:id/detail',
        component: () => import('../worker/detail'),
        name: 'LabourWorkerPersonal',
        hidden: true,
        meta: { title: '工人详情', activeMenu: '/labourManage/worker' }
      },
      {
        path: 'worker/:id/record',
        component: () => import('../worker/detail'),
        name: 'LabourWorkerRecord',
        hidden: true,
        meta: { title: '工人详情', activeMenu: '/labourManage/worker' }
      },
      // {
      //   path: 'safety',
      //   name: 'LabourSafety',
      //   component: () => import('../safety'),
      //   meta: { title: '安全培训' }
      // },
      {
        path: 'safety/new',
        name: 'LabourSafetyAdd',
        component: () => import('../safety/edit'),
        hidden: true,
        meta: { title: '新建安全培训', activeMenu: '/labourManage/safety' }
      },
      {
        path: 'safety/:id',
        name: 'LabourSafetyEdit',
        component: () => import('../safety/edit'),
        hidden: true,
        meta: { title: '编辑安全培训', activeMenu: '/labourManage/safety' }
      },
      {
        path: 'safety/:id/detail',
        name: 'LabourSafetyDetail',
        component: () => import('../safety/edit'),
        hidden: true,
        meta: { title: '安全培训详情', type: 'view', activeMenu: '/labourManage/safety' }
      }
    ]
  }
]

export default [
  // {
  //   path: '/company/role',
  //   name: 'SystemRole',
  //   component: () => import('./role/index'),
  //   meta: { title: '角色权限', icon: 'el-icon-wind-power' }
  // },
  {
    path: '/company',
    redirect: '/company/project',
    hidden: true
  },
  {
    path: '/company/project',
    name: 'CompanyProject',
    component: () => import('./project'),
    meta: {
      title: '项目管理',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/project/:id/edit',
    name: 'SystemCompanyProjectEdit',
    hidden: true,
    component: () => import('../project/project-add'),
    meta: { title: '项目编辑', hiddenSidebar: true }
  },
  {
    path: '/company/manage',
    name: 'CompanyManage',
    component: () => import('./manage'),
    meta: {
      title: '合作单位',
      icon: 'el-icon-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/user',
    name: 'SystemUser',
    component: () => import('./user'),
    meta: {
      title: '用户管理',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/role',
    name: 'SystemRole',
    component: () => import('./role'),
    meta: {
      title: '角色管理',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/update',
    name: 'CompanyUpdate',
    component: () => import('./manage/update'),
    hidden: true,
    meta: {
      title: '添加企业',
      icon: 'el-icon-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true, // 隐藏项目展示按钮
      activeMenu: '/company/manage'
    }
  },
  {
    path: '/company/department',
    name: 'SystemDepartment',
    component: () => import('./department'),
    meta: {
      title: '部门管理',
      icon: 'el-icon-receiving',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/department-user',
    name: 'SystemDepartmentUser',
    component: () => import('./departmentUser'),
    meta: {
      title: '部门人员管理',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/oa',
    name: 'CompanyOa',
    component: () => import('./oa'),
    meta: {
      title: 'OA管理',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/oa/addFormStyle',
    name: 'CompanyAddFormStyle',
    component: () => import('./oa/editFormStyle'),
    hidden: true,
    meta: {
      title: '新建审批样式',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/oa/editFormStyle',
    name: 'CompanyEditFormStyle',
    component: () => import('./oa/editFormStyle'),
    hidden: true,
    meta: {
      title: '编辑审批样式',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/oa/addForm',
    name: 'CompanyAddForm',
    component: () => import('./oa/editForm'),
    hidden: true,
    meta: {
      title: '新建表单',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/company/oa/editForm',
    name: 'CompanyEditForm',
    component: () => import('./oa/editForm'),
    hidden: true,
    meta: {
      title: '编辑表单',
      icon: 'el-icon-s-custom',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  }
]

export default [
  {
    path: '/project/add',
    name: 'SystemProjectAdd',
    hidden: true,
    component: () => import('./project-add'),
    meta: { title: '新建项目', activeMenu: '/system/project/project-list', hiddenSidebar: true }
  },
  /** 新增项目参项单位页面 end**/
  {
    path: '/project/edit',
    name: 'SystemProjectEdit',
    component: () => import('./project-add'),
    onlyHostVisible: true,
    meta: { title: '项目编辑', hiddenSidebar: true }
  },
  {
    path: '/project/detail',
    name: 'SystemProjectDetails',
    component: () => import('./project-details'),
    meta: { title: '项目详情', hiddenSidebar: true }
  },
  {
    path: '/project/projectRoleSet',
    name: 'SystemProjectRoleSet',
    component: () => import('./project-role-set'),
    meta: { title: '项目角色配置', hiddenSidebar: true }
  },
  {
    path: '/project/projectDepartmentManage',
    name: 'SystemProjectDepartmentManage',
    component: () => import('./project-department-manage'),
    meta: { title: '项目机构管理', hiddenSidebar: true }
  },
  {
    path: 'project-department-map',
    name: 'SystemProjectDepartmentMap',
    component: () => import('./project-department-map'),
    meta: { title: '项目机构图', hiddenSidebar: true }
  },
  {
    path: '/project/messagePush',
    name: 'SystemProjectMessagePush',
    component: () => import('./messagePush'),
    // 仅主办方可见
    onlyHostVisible: true,
    meta: { title: '信息推送', hiddenSidebar: true }
  }
]

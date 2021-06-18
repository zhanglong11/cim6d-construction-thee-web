import Vue from 'vue'
import Router from 'vue-router'
import { baseRouter } from '@/views/base/baseRouter' // 基础路由管理
import { constructionRouter } from '@/views/construction/constructionRouter' // 施工路由管理
import { supervisorRouter } from '@/views/supervisor/supervisorRouter' // 监理路由管理
import projectOARouter from '@/views/projectOA/projectOARouter' // OA路由管理
import companyRouter from '@/views/company/router' //企业配置
import projectRouter from '@/views/project/router' //项目配置
import { bimSynergyRouter } from '@/views/bimSynergy/router' //甲方大屏路由配置
import { drawingsRouter } from '@/views/drawings/router' // 图纸管理路由配置
import { patrolRouter } from '@/views/patrol/router' // 智能巡更管理路由配置
Vue.use(Router)

// 处理开发路由，不进行权限处理
let developmentRoute = [
  // 开发完毕上线要删除，走权限控制
]
let developmentRouteNames = []
const formatDevelopmentRoute = array => {
  array.map(item => {
    if (!item.name) {
      return
    }
    developmentRouteNames.push(item.name)
    if (item.children) {
      formatDevelopmentRoute(item.children)
    }
  })
}
formatDevelopmentRoute(developmentRoute)
Vue.prototype.$DevelopmentRoute = developmentRouteNames

/* Layout */
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/',
    hidden: true,
    redirect: '/home',
    component: Layout
  },
  {
    path: '/webView', // 单独bim展示 - 小模型
    hidden: true,
    name: 'BimWebView',
    component: () => import('@/views/webView')
  },
  {
    path: '/home',
    name: 'CompanyHome',
    hidden: true,
    component: Layout,
    redirect: '/companyHome',
    children: [
      {
        path: '/companyHome',
        name: 'CompanyCenter',
        component: () => import('@/views/home'),
        meta: {
          title: '首页',
          hiddenSidebar: true,
          hiddenNavProjectSelect: true,
          dontGetProject: true,
          isHome: true,
          hiddenBimSynergy: true // 隐藏项目展示按钮
        }
      }
    ]
  },
  {
    path: '/company',
    name: 'Company',
    component: () => import('@/views/company/index'),
    redirect: '/company/project',
    hidden: true,
    meta: {
      title: '企业配置',
      hiddenBimSynergy: true // 隐藏项目展示按钮
    },
    children: companyRouter
  },
  {
    path: '/userCenter',
    name: 'UserCenter',
    component: () => import('@/views/company/userCenter'),
    hidden: true,
    meta: {
      title: '个人中心',
      hiddenNavProjectSelect: true,
      hiddenSidebar: true,
      hiddenBimSynergy: true // 隐藏项目展示按钮
    }
  },
  {
    path: '/project',
    name: 'Project',
    component: () => import('@/views/project/index'),
    redirect: '/project/role',
    hidden: true,
    meta: { title: '项目配置', hiddenSidebar: true },
    children: projectRouter
  },
  ...baseRouter, // 基础路由管理
  ...constructionRouter, // 施工路由管理
  ...supervisorRouter, // 监理路由管理
  ...projectOARouter, // OA路由管理
  ...bimSynergyRouter, // 甲方大屏路由配置
  ...drawingsRouter, // 图纸管理
  ...patrolRouter // 智能巡更管理
]

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({
      y: 0
    }),
    // mode: 'history',
    routes: constantRoutes
  })

const router = createRouter()
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

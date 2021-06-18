/* 甲方大屏路由 */
import Layout from '../index'
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
export const bimSynergyRouter = [
  {
    path: '/bimSynergy',
    name: 'BimSynergy',
    hidden: true,
    component: Layout,
    redirect: '/bimSynergy/main',
    children: [
      {
        path: 'main',
        name: 'BimSynergyMain',
        component: () => import('../main'),
        meta: { title: '首页', subTitle: 'Home' }
      },
      {
        path: 'video',
        name: 'BimSynergyVideo',
        component: () => import('../video'),
        meta: { title: '视频监控', subTitle: 'Cameras & Surveillance' }
      },
      {
        path: 'labour',
        name: 'BimSynergyLabour',
        component: () => import('../labour'),
        meta: { title: '劳务管理', subTitle: 'Labor Management' }
      },
      {
        path: 'schedule',
        name: 'BimSynergySchedule',
        component: () => import('../schedule'),
        meta: { title: '进度展示', subTitle: 'Progress Display' }
      },
      {
        path: 'quality',
        name: 'BimSynergyQuality',
        hidden: false,
        component: () => import('../quality'),
        meta: { title: '质量展示', type: 1, subTitle: 'Quality' }
      },
      {
        path: 'safety',
        name: 'BimSynergySafety',
        hidden: false,
        component: () => import('../quality'),
        meta: { title: '安全展示', type: 2, subTitle: 'Safety' }
      },
      {
        path: 'internet',
        name: 'BimSynergyInternet',
        component: () => import('../internet'),
        meta: { title: '智能物联网', subTitle: 'Intelligent IOT' }
      },
      {
        path: 'attendance',
        name: 'AttendanceClock',
        component: () => import('../attendance'),
        meta: { title: '考勤打卡', subTitle: 'Attendance-Clock' }
      }
    ]
  }
]

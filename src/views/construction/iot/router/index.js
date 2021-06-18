// 环境监控 路由
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

export const iotRouter = [
  {
    path: '/environmental-monitoring',
    component: Layout,
    redirect: '/environmental-monitoring/list',
    name: 'EnvironmentalMonitoring',
    meta: { title: '环境监控', icon: 'el-icon-monitor' },
    children: [
      {
        path: 'product',
        name: 'ProductList',
        component: () => import('../product'),
        meta: { title: '产品' }
      },
      {
        path: 'product/new',
        name: 'NewProduct',
        component: () => import('../product/new'),
        meta: { title: '创建产品', activeMenu: '/environmental-monitoring/product' },
        hidden: true
      },
      {
        path: 'productDetail',
        name: 'ProductDetail',
        component: () => import('../product/$id'),
        meta: { title: '产品详情', activeMenu: '/environmental-monitoring/product' },
        hidden: true
      },
      {
        path: 'device',
        name: 'DeviceList',
        component: () => import('../device'),
        meta: { title: '设备' }
      },
      {
        path: 'deviceDetail',
        name: 'DeviceDetail',
        component: () => import('../device/$id'),
        meta: { title: '产品详情', activeMenu: '/environmental-monitoring/device' },
        hidden: true
      },
      {
        path: 'group',
        name: 'GroupList',
        component: () => import('../group'),
        meta: { title: '分组' }
      },
      {
        path: 'groupDetail',
        name: 'GroupDetail',
        component: () => import('../group/$id'),
        meta: { title: '分组详情', activeMenu: '/environmental-monitoring/group' },
        hidden: true
      },
      {
        path: 'warningRule',
        name: 'WarningRuleList',
        component: () => import('../warningRule'),
        meta: { title: '预警规则' }
      },
      {
        path: 'equip',
        name: 'WarningRuleList',
        component: () => import('../warningRule'),
        meta: { title: '预警规则' }
      },
      {
        path: 'equipmentLink',
        name: 'EquipmentLink',
        component: () => import('../equipmentLink'),
        meta: { title: '设备关联' }
      }
    ]
  }
]

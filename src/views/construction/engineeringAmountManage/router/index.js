/* 工程量管理路由 */
import Layout from '@/layout'
import shell from '@/utils/shell'
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
export const engineeringAmountManageRouter = [
  {
    path: '/engineeringAmount',
    component: Layout,
    redirect: '/engineeringAmount/engineeringSetting',
    name: 'EngineeringAmount',
    meta: { title: '工程量管理', icon: 'el-icon-postcard' },
    children: [
      {
        path: 'engineeringSetting',
        name: 'EngineeringSetting',
        component: () => import('../engineeringSetting'),
        meta: { title: '工程设置' }
      },
      {
        path: 'constructionGroup',
        name: 'ConstructionGroup',
        component: () => import('../constructionGroup'),
        meta: { title: '施工班组设置' }
      },
      {
        path: 'subPayAmount',
        name: 'SubPayAmount',
        component: shell('subPayAmount'),
        meta: { title: '报分包付款用工程量' },
        redirect: '/engineeringAmount/subPayAmount/subPayAmountList',
        children: [
          {
            path: 'subPayAmountList',
            name: 'SubPayAmountList',
            component: () => import('../subPayAmount'),
            meta: { title: '分包汇总工程量管理' }
          },
          {
            path: 'editSubPayAmount/:id',
            name: 'EditSubPayAmount',
            hidden: true,
            component: () => import('../subPayAmount/edit'),
            meta: { title: '修改分包汇总工作量', activeMenu: '/engineeringAmount/subPayAmount/subPayAmountList' }
          },
          {
            path: 'subPayAmountDetail/:id',
            name: 'SubPayAmountDetail',
            hidden: true,
            component: () => import('../subPayAmount/detail'),
            meta: { title: '分包汇总工作量详情', activeMenu: '/engineeringAmount/subPayAmount/subPayAmountList' }
          },
          {
            path: 'subPayTotalAmount',
            name: 'SubPayTotalAmount',
            component: () => import('../subPayAmount/subPayTotalAmount'),
            meta: { title: '总包汇总工程量管理' }
          }
        ]
      },
      {
        path: 'ownerReceiveAmount',
        name: 'OwnerReceiveAmount',
        component: shell('ownerReceiveAmount'),
        redirect: '/engineeringAmount/ownerReceiveAmount/ownerReceiveAmountList',
        alwaysShow: true,
        meta: { title: '报业主收款用工程量' },
        children: [
          {
            path: 'ownerReceiveAmountList',
            name: 'OwnerReceiveAmountList',
            component: () => import('../ownerReceiveAmount'),
            meta: { title: '总包汇总工程量管理' }
          },
          {
            path: 'editOwnerReceiveAmount/:id',
            name: 'EditOwnerReceiveAmount',
            hidden: true,
            component: () => import('../ownerReceiveAmount/edit'),
            meta: {
              title: '修改总包汇总工程量',
              activeMenu: '/engineeringAmount/ownerReceiveAmount/ownerReceiveAmountList'
            }
          },
          {
            path: 'ownerReceiveAmountDetail/:id',
            name: 'OwnerReceiveAmountDetail',
            hidden: true,
            component: () => import('../ownerReceiveAmount/detail'),
            meta: {
              title: '总包汇总工程量详情',
              activeMenu: '/engineeringAmount/ownerReceiveAmount/ownerReceiveAmountList'
            }
          }
        ]
      }
    ]
  }
]

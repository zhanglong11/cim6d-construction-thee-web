// 工作协同
import Layout from '@/layout'
export default [
  {
    path: '/workTogether',
    name: 'WorkTogether',
    component: Layout,
    redirect: '/workTogether/noticeManage',
    meta: { title: '工作协同', icon: 'el-icon-suitcase' },
    children: [
      {
        path: 'noticeManage',
        name: 'NoticeManage',
        component: () => import('../noticeManage'),
        meta: { title: '消息中心' }
      },
      {
        path: 'meetingManage',
        name: 'MeetingManage',
        component: () => import('../meetingManage'),
        meta: { title: '会议管理' }
      },
      {
        path: 'taskManage',
        name: 'TaskManage',
        component: () => import('../taskManage'),
        meta: { title: '任务管理' }
      },
      {
        path: 'taskManageDetail',
        name: 'TaskManageDetail',
        hidden: true,
        component: () => import('../taskManage/detail'),
        meta: { title: '详情', activeMenu: '/workTogether/taskManage' }
      }
    ]
  }
]

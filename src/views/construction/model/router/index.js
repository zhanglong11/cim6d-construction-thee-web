// BIM模型管理路由
import Layout from '@/layout/index'

export const modelRouter = [
  {
    path: '/model',
    name: 'Model',
    redirect: '/model/manage/modelVersion',
    component: Layout,
    meta: { title: 'BIM模型管理', icon: 'el-icon-files' },
    children: [
      {
        path: 'modelVersion',
        name: 'ModelVersion',
        component: () => import('../manage/modelVersion'),
        meta: { title: '模型版本' }
      },
      {
        path: 'modelVersionDetail/:id',
        name: 'ModelVersionDetail',
        hidden: true,
        component: () => import('../manage/modelVersion/Detail'),
        meta: { title: '模型版本更新详情', activeMenu: '/model/modelVersion' }
      },
      {
        path: 'modelVersionAdd',
        name: 'ModelVersionAdd',
        hidden: true,
        component: () => import('../manage/modelVersion/AddModel'),
        meta: { title: '新增模型版本变更', activeMenu: '/model/modelVersion' }
      },
      {
        path: 'progress',
        name: 'ModelProgress',
        component: () => import('../manage/progress'),
        meta: { title: '进度关联' }
      },
      {
        path: 'qualityProblem',
        name: 'ModelQualityProblem',
        component: () => import('../manage/qualityProblem'),
        meta: { title: '质量问题关联' }
      },
      {
        path: 'qualityAcceptance',
        name: 'ModelQualityAcceptance',
        component: () => import('../manage/qualityAcceptance'),
        meta: { title: '质量验收关联' }
      },
      {
        path: 'securityCheck',
        name: 'ModelSecurityCheck',
        component: () => import('../manage/securityCheck'),
        meta: { title: '安全检查关联' }
      },
      {
        path: 'safetyCulture',
        name: 'ModelSafetyCulture',
        component: () => import('../manage/safetyCulture'),
        meta: { title: '安全文明检查关联' }
      },
      {
        path: 'inventory',
        name: 'ModelInventory',
        component: () => import('../manage/inventory'),
        meta: { title: '清单关联' }
      }
    ]
  }
]

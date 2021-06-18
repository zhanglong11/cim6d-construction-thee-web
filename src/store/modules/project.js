/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-27
 * @Last Modified by: gengweigang
 * @Last Modified time: 2021-03-12 11:17:52
 */
import router from '@/router'
import { getProjectList } from '@/api/user'
import { Message } from 'element-ui'
const state = {
  // 添加项目的弹窗
  addProjectDialog: false,
  projectId: localStorage.getItem('projectId') || '', // 项目id
  projectUserCategory: parseInt(localStorage.getItem('projectUserCategory')) || '', // 记录项目是主办方还是参与方 1参与方 2主办方
  projectName: localStorage.getItem('projectName') || '', // 项目名称
  projectType: localStorage.getItem('projectType') || '', // 项目类型
  latitude: localStorage.getItem('latitude') || '', // 项目位置
  longitude: localStorage.getItem('longitude') || '',
  projectDetail: localStorage.getItem('projectDetail') ? JSON.parse(localStorage.getItem('projectDetail')) : {}, //项目详情
  projectList: [],
  companyId: null
}

const mutations = {
  // 消息中转处理
  toMessageDetails(state, { projectItem, subModulesRouterName }) {
    this.commit('setProjectLocalStorage', projectItem)
    router.push({
      name: subModulesRouterName,
      params: {
        id: projectItem.targetId
      },
      query: {
        id: projectItem.targetId
      }
    })
  },
  // 设置项目缓存
  setProjectLocalStorage(state, obj) {
    let projectType = obj.type
    localStorage.setItem('projectId', obj.id)
    localStorage.setItem('projectType', projectType)
    localStorage.setItem('projectName', obj.name)
    localStorage.setItem('projectUserCategory', obj.projectUserCategory)
    localStorage.setItem('projectDetail', JSON.stringify(obj))
    state.projectId = obj.id
    state.projectName = obj.name
    state.projectType = projectType
    state.projectUserCategory = obj.projectUserCategory
    state.companyId = obj.companyId
    state.projectDetail = obj
    this.commit('setLocal', {
      latitude: obj.latitude,
      longitude: obj.longitude
    })
    if (process.env.NODE_ENV === 'development' && !obj.isApproval) {
      this.commit('userPower/setWebTitle', {
        serviceCode: projectType,
        webTitle: '本地开发'
      })
    } else {
      this.commit('userPower/setWebTitle', {
        serviceCode: projectType,
        webTitle: '本地开发'
      })
    }
    this.commit('userPower/getPower', () => {
      let firstPowerRoute = this.state.userPower.power[0] || 'CenterHome'
      if (this.state.userPower.power.length === 0) {
        Message({
          message: '无项目权限',
          type: 'error',
          duration: 2 * 1000
        })
        return
      }
      // 精装修项目跳转
      if (projectType === 'decoration') {
        this.dispatch('setSystemConfigStorage')
        location.href = `/decoration/#/to-admin`
        return
      }
      if (router.history.current.name === firstPowerRoute) {
        location.reload()
      } else {
        // 判断有没有公告管理权限
        if (this.state.userPower.power.includes('Notice')) {
          router.push({
            name: 'Notice'
          })
        } else {
          router.push({
            name: firstPowerRoute
          })
        }
      }
      this.dispatch('setSystemConfigStorage')
    })
  },
  // 单独设置项目id
  setProjectId(state, projectId) {
    localStorage.setItem('projectId', projectId)
    state.projectId = projectId
  },
  // 单独设置项目人员分类
  setProjectUserCategory(state, projectUserCategory) {
    localStorage.setItem('projectUserCategory', projectUserCategory)
    state.projectUserCategory = projectUserCategory
  },
  // 单独设置项目名称
  setProjectName(state, projectName) {
    localStorage.setItem('projectName', projectName)
    state.projectName = projectName
  },
  // 单独设置项目详情
  setProjectDetail(state, projectDetail) {
    localStorage.setItem('projectDetail', JSON.stringify(projectDetail))
    state.projectDetail = projectDetail
  },
  // 单独设置项目经纬度
  setLocal(state, obj) {
    localStorage.setItem('latitude', obj.latitude)
    localStorage.setItem('longitude', obj.longitude)
    state.latitude = obj.latitude
    state.longitude = obj.longitude
  },
  // 设置 添加项目弹窗的状态
  setAddProjectDialog(state, visible) {
    state.addProjectDialog = visible
  },
  // 单独设置项目类型
  setProjectType(state, projectType) {
    localStorage.setItem('projectType', projectType)
    state.projectType = projectType
  }
}

const actions = {
  // 查询项目列表
  queryProjectList({ state }) {
    return getProjectList().then(res => {
      state.projectList = res.data
    })
  }
}

export default {
  state,
  mutations,
  actions
}

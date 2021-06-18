import { roleApi } from '@/api/role'
import toFlat from '@/utils/toFlat'
import { Message } from 'element-ui'
// 用户权限
const state = {
  power: localStorage.getItem('power') ? localStorage.getItem('power').split(',') : [],
  systemPower: localStorage.getItem('systemPower') ? localStorage.getItem('systemPower').split(',') : [],
  powerFlatList: localStorage.getItem('powerFlatList') ? JSON.parse(localStorage.getItem('powerFlatList')) : [],
  organizationTree: [], // 企业组织架构树
  serviceCode: localStorage.getItem('serviceCode') || 'construction',
  serviceList: [], // 可用服务类型
  webTitle: '临腾智慧工地' //localStorage.getItem('webTitle') || 'CIM6D-智慧工地' // 标题栏地址
}

const mutations = {
  // 设置通用标题栏
  setWebTitle(state, obj) {
    state.serviceCode = obj.serviceCode
    // state.webTitle = obj.webTitle
    localStorage.setItem('serviceCode', obj.serviceCode)
    // localStorage.setItem('webTitle', obj.webTitle)
  },
  // 获取用户授权
  getPower(state, callBack = () => {}) {
    if (!this.state.project.projectId) {
      return
    }
    return new Promise((resolve, reject) => {
      roleApi
        .getAvailablePower()
        .then(response => {
          const { data } = response
          const power = []
          const findArray = array => {
            if (!array) {
              return
            }
            array.map(e => {
              // 主导方旧代码
              //((projectUserCategory === 2 && e.flag === 1) || projectUserCategory === 1)
              if (e.powerKey !== 'AppPower') {
                power.push(e.powerKey)
              }
              if (e.children && e.powerKey !== 'AppPower') {
                findArray(e.children)
              }
            })
          }
          if (data.length > 0) {
            this.commit('userPower/setWebTitle', {
              serviceCode: state.serviceCode,
              webTitle: data[0].serviceName
            })
            document.title = `${data[0].serviceName}`
          } else {
            Message.error('无项目权限')
            //return
          }
          state.powerFlatList = toFlat(data)
          localStorage.setItem('powerFlatList', JSON.stringify(state.powerFlatList))
          data.map(item => {
            if (item.serviceCode === state.serviceCode) {
              findArray(item.children)
            }
          })
          // 第一个子路由未授权
          let whiteList = {
            ProjectOA: 'ProjectOAHome', // 项目OA管理
            SetFormManageFlag: 'ProjectOAFixedFormEdit' // 编辑固定表单
          }
          for (let key in whiteList) {
            if (power.includes(key)) {
              power.push(whiteList[key])
            }
          }
          localStorage.setItem('power', power.join(','))
          state.power = power
          callBack()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  setPower(state, obj) {},
  // 设置
  setOrganizationTree(state, array) {
    state.organizationTree = array
  },
  changeSystemPower(state, powerList) {
    state.systemPower = powerList
  },
  // 设置可用服务类型
  setServiceList(state, array) {
    state.serviceList = array
  }
}
const actions = {
  async getSystemPower({ commit }) {
    const { data } = await roleApi.getSystemPower()
    const powerList = toFlat(data)
      .map(item => item.powerKey)
      .filter(item => item)
    commit('changeSystemPower', powerList)
    let serviceList = _.filter(data, e => e.serviceCode !== 'base')
    commit('setServiceList', _.map(serviceList, 'serviceCode'))
    localStorage.setItem('systemPower', powerList.join(','))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

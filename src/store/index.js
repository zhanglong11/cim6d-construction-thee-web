/*
 * @Description:
 * @Author:
 * @Date: 2020-01-09 18:05:43
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import bim from './modules/bim'
import project from './modules/project'
import dataManage from '@/views/construction/data-manage/store/dataManage'
import labour from '@/views/construction/labourManage/store'
import iot from '@/views/construction/iot/store'
import systemConfig from './modules/system-config' // 系统参数全局缓存
import approval from './modules/approval' // 审批全局缓存
import userPower from './modules/userPower' // 用户权限
import workflow from './modules/workflow'
import design from './modules/design'
import system from './modules/system'
import treeForEach from '@/utils/treeForEach'
import api from '@/api'
import treeFilter from '@/utils/treeFilter'
import commonModule from './modules/commonModule'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    design,
    workflow,
    bim,
    project,
    dataManage,
    labour,
    iot,
    systemConfig,
    approval,
    userPower,
    system,
    commonModule
  },
  getters,
  state: {
    userList: [],
    departmentUserList: [],
    departmentList: [],
    departmentUserListWithDep: []
  },
  mutations: {
    changeUserList(state, list) {
      state.userList = list
    },
    changeDepartmentUserList(state, list) {
      state.departmentUserList = list
    },
    changeDepartmentList(state, list) {
      state.departmentList = list
    },
    changeDepartmentUserListWithDep(state, list) {
      state.departmentUserListWithDep = list
    }
  },
  actions: {
    async getDepartmentUserList({ commit }) {
      let data = await api.getOrganList().then(res => res.data || [])
      if (_.get(data, '0.children.0')) {
        data = data[0].children
      }
      let userList = []
      treeForEach(data, (e, parent) => {
        e.name = e.dataName
        e.label = e.dataName
        e.targetId = e.dataUnicode
        e.children = e.child
        e.userId = e.dataUnicode
        if (!e.children) e.children = []
        if (e.organType === 5) {
          e.organId = parent?.id
        }
        if (e.organType === 6) {
          e.organId = parent.organId
          e.organName = parent.name
          e.id = e.dataUnicode
          delete e.children
          userList.push(e)
        }
      })
      commit('changeUserList', userList)
      commit('changeDepartmentUserList', data)
      commit(
        'changeDepartmentList',
        treeFilter(data, e => e.organType !== 6)
      )
    },
    async getDepartmentList({ commit }) {
      const projectId = localStorage.getItem('projectId') || ''
      if (!projectId) {
        return
      }
      let obj = {
        projectId: localStorage.getItem('projectId')
      }
      let data = await api.getDepartList(obj).then(res => res.data[0].children)
      treeForEach(data, e => {
        e.label = e.name
        if (!e.children) delete e.children
      })
      commit('changeDepartmentList', data)
    },
    async getDepartmentUserListWithDep({ commit }) {
      let data = await api.getOrganList().then(res => res.data || [])
      treeForEach(data, e => {
        e.label = e.name
        if (_.size(e.userList))
          e.userList.forEach(user => {
            user.organId = e.id
            user.depName = e.name
          })
        if (e.userList) e.children = (e.children || []).concat(e.userList)
      })
      commit('changeDepartmentUserListWithDep', data)
    }
  }
})

export default store

import { login, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getOrigin } from '@/utils/'

const state = {
  token: getToken(),
  id: localStorage.getItem('id') || '',
  name: localStorage.getItem('name') || '',
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
  createTime: localStorage.getItem('createTime') || '',
  avatar: localStorage.getItem('avatar') || '',
  companyId: localStorage.getItem('companyId') || '', // 这里的公司ID是用户所在的公司
  companyAdminFlag: localStorage.getItem('companyAdminFlag') === '1',
  companyAddTemp: localStorage.getItem('companyAddTemp') ? JSON.parse(localStorage.getItem('companyAddTemp')) : '', // 临时存储未保存的企业信息
  cacheTimer: '', // 自动缓存定时器
  saveTime: localStorage.getItem('companyAddTempSaveTime') || '' // 上次自动保存时间
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERINFO: (state, userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    state.userInfo = userInfo
  },
  SET_TIME: (state, createTime) => {
    state.createTime = createTime
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_COMPANY_ID: (state, companyId) => {
    state.companyId = companyId
  },
  SET_COMPANY_ADMIN_FLAG: (state, companyAdminFlag) => {
    state.companyAdminFlag = companyAdminFlag
  },
  // 自动缓存未保存的项目数据
  autoSaveCompanyTemp(state, data) {
    state.cacheTimer = setInterval(() => {
      const time = new Date()
      const h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      const m = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      const saveTime = `，保存时间 ${h}:${m}`
      localStorage.setItem('companyAddTempSaveTime', saveTime)
      state.saveTime = saveTime
      localStorage.setItem('companyAddTemp', JSON.stringify(data))
      state.companyAddTemp = data
    }, 2000)
  },
  // 关闭定时器
  closeCacheTimer(state) {
    clearInterval(state.cacheTimer)
  },
  // 关闭定时器并清除项目缓存数据
  clearCompanyTemp(state) {
    clearInterval(state.cacheTimer)
    localStorage.setItem('companyAddTemp', '')
    state.companyAddTemp = ''
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return login(userInfo).then(res => {
      commit('SET_TOKEN', res.data)
      setToken(res.data)
    })
  },

  // get info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token)
        .then(res => {
          const datas = res.data
          localStorage.setItem('id', datas.id)
          localStorage.setItem('name', datas.realName)
          localStorage.setItem('avatar', datas.headImage)
          localStorage.setItem('companyId', datas.companyId)
          localStorage.setItem('createTime', datas.createTime)
          localStorage.setItem('companyAdminFlag', datas.companyAdminFlag)
          commit('SET_ID', datas.id)
          commit('SET_NAME', datas.realName)
          commit('SET_TIME', datas.createTime)
          commit('SET_AVATAR', datas.headImage)
          commit('SET_USERINFO', datas)
          // 因为有参与方登录，所以公司id从项目中获取
          // commit('SET_COMPANY_ID', datas.companyId)
          commit('SET_COMPANY_ADMIN_FLAG', datas.companyAdminFlag === 1)
          commit('SET_COMPANY_ID', datas.companyId)
          resolve(datas)
        })
        .catch(error => {
          removeToken()
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    commit('SET_TOKEN', '')
    removeToken()
    resetRouter()
    commit('SET_NAME', '')
    commit('SET_AVATAR', '')
    commit('SET_TIME', '')
    commit('SET_COMPANY_ID', '')
    commit('SET_COMPANY_ADMIN_FLAG', '')
    localStorage.clear()
    sessionStorage.clear()
    location.reload()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

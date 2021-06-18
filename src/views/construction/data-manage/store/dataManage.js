import Api from '../api/work-bench'
const state = {
  projectList: []
}

const mutations = {
  changeProjectList(state, projectList) {
    state.projectList = projectList
  }
}
const actions = {
  //获取项目列表
  async getProjectList({ commit }) {
    let res = await Api.getProjectList({ page: 1, rows: 999 })
    let projectList = res.data
    commit('changeProjectList', projectList)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

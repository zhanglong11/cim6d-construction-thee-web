import axios from '@/utils/axios'
export default {
  namespaced: true,
  state: {
    groupListTree: []
  },
  mutations: {
    changeGroupListTree(state, list) {
      state.groupListTree = list
    }
  },
  actions: {
    getGroupListTree({ commit }) {
      axios.iot.post('group/list', {}).then(res => {
        commit('changeGroupListTree', res.data)
      })
    }
  }
}

import { getActiveMergerModel } from '@/api/modelo'
export default {
  namespaced: true,
  state: {
    appToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTI1LCJ1c2VybmFtZSI6ImJpbXV5dSIsImlzUGVybWFuZW50Ijp0cnVlLCJpYXQiOjE1NjA0MTE4OTAsImV4cCI6MzMwOTY0MTE4OTB9.dgURCUb7VoECsDokXOFOx8zxdjwFzSIEFGC0zjASDGw',
    bimTreeData: [],
    bimModelId: null,
    bimElementData: [],
    bimModelCamera: null
  },
  mutations: {
    SET_BIM_MODEL_ID: (state, id) => {
      localStorage.setItem('bimModelId', id)
      state.bimModelId = id
    },
    SET_BIM_TREE: (state, tree) => {
      state.bimTreeData = tree
    },
    SET_BIM_ELEMENT: (state, data) => {
      state.bimElementData = data
    },
    SET_BIM_MODEL_CAMERA: (state, data) => {
      localStorage.setItem('bimModelCamera', data)
      state.bimModelCamera = data
    }
  },
  actions: {
    setBimModelId({ commit }) {
      getActiveMergerModel().then(res => {
        commit('SET_BIM_MODEL_ID', res.data?.combineModelId)
        if (res.data?.defaultView) {
          commit('SET_BIM_MODEL_CAMERA', res.data?.defaultView)
        }
      })
    },
    setBimTree({ commit }, tree) {
      commit('SET_BIM_TREE', tree)
    },
    setBimElement({ commit }, tree) {
      commit('SET_BIM_ELEMENT', tree)
    }
  }
}

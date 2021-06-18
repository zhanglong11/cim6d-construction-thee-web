import api from '@/api/workflow'
import toTree from '@/utils/toTree'
export default {
  namespaced: true,
  state: {
    userListTree: [],
    roleList: [],
    roleCategory: [],
    formList: [],
    processCategory: [],
    processCategoryTree: []
  },
  mutations: {
    changeUserListTree(state, treeData) {
      state.userListTree = treeData
    },
    changeRoleList(state, list) {
      state.roleList = list
    },
    changeRoleCategory(state, list) {
      state.roleCategory = list
    },
    changeFormList(state, list) {
      state.formList = list
    },
    changeProcessCategory(state, list) {
      state.processCategory = list
      state.processCategoryTree = toTree(list)
    }
  },
  actions: {
    async getRoleList({ commit }) {
      const datas = await api.getRoleList()
      let list = []
      datas.map(item => {
        if (item.child && item.child.length > 0) {
          item.child.map((e, i) => {
            if (e.child) {
              if (i === 0) {
                list.push(...e.child)
              } else {
                e.child.map(f => {
                  if (f.child) {
                    list.push(...f.child)
                  }
                })
              }
            }
          })
        }
      })
      const formatArray = array => {
        array.map(e => {
          e.name = e.dataName
          e.type = e.organType === 6 ? 3 : null
          e.targetId = e.dataUnicode
          e.children = e.child
          e.label = e.dataName
          e.value = e.dataUnicode
          if (e.child) {
            formatArray(e.child)
          }
        })
      }
      formatArray(list)
      console.log(3333333, list)
      commit('changeRoleList', list)
    },
    async getRoleCategory({ commit }) {
      const list = await api.getRoleCategory()
      commit('changeRoleCategory', list)
    },
    async getFormList({ commit }) {
      const list = await api.getFormList()
      let newList = []
      list.map(item => {
        if (item.children) {
          newList.push(item)
        }
      })
      commit('changeFormList', newList)
    },
    async getProcessCategory({ commit }) {
      const list = await api.getProcessCategory()
      commit('changeProcessCategory', list)
    }
  }
}

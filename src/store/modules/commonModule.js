import { adminFile } from '@/utils/axios'
/**
 * 参数管理接口-分组内参数详情 @author yangjiaqi
 * @param {String} argGroup argGroup
 */
function getGroupArgByArgGroup(argGroup) {
  return adminFile.get(`systemArg/getGroupArg/${argGroup}`)
}
export default {
  namespaced: true,
  state: {
    moduleList: [],
    docType: 'list'
  },
  mutations: {
    changeModuleList(state, list) {
      state.moduleList = list
    },
    changeDocType(state, type) {
      state.docType = type
    }
  },
  actions: {
    getModuleList({ commit }) {
      getGroupArgByArgGroup('module').then(res => {
        commit('changeModuleList', res.data || [])
      })
    }
  }
}

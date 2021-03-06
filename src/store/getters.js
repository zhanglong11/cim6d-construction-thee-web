const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  createTime: state => state.user.createTime,
  companyId: state => state.user.companyId,
  moduleList: state => state.commonModule.moduleList
}
export default getters

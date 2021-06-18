import axios from '@/utils/axios'
const projectId = localStorage.getItem('projectId')
//const baseURL = '/cs'
export default {
  // 获取集团资料列表
  getTableList: data => {
    return axios.construction.post(`/buildInfo/queryList`, data)
  },
  //添加集团资料
  addData: data => {
    return axios.construction.post(`/buildInfo/save`, { ...data, projectId })
  },
  //更新集团资料
  updateData: data => {
    return axios.construction.post(`/buildInfo/update`, data)
  },
  //获取集团资料详情
  getDataDetail: id => {
    return axios.construction.get(`/buildInfo/detail/${id}`, {})
  },
  deleteData: id => {
    return axios.construction.get(`/buildInfo/delete/${id}`, {})
  },
  getProjectList: data => {
    return axios.post(`/cim6d/system/project/list`, data)
  }
}

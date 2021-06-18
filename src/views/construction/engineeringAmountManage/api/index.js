/*
工程量管理的api
 */
import http from '@/utils/axios'
export default {
  getESSTree: () => {
    return http.construction.get(`/engineeringStructure/treeList`)
  },
  //获取工程/结构/子工程列表
  getESSList: id => {
    return http.construction.get(`/engineeringStructure/list/${id}`)
  },
  //添加工程/结构/子工程
  addESS: data => {
    return http.construction.post('/engineeringStructure/save', data)
  },
  //更新工程/结构/子工程
  updateESS: data => {
    return http.construction.post('/engineeringStructure/update', data)
  },
  //删除工程/结构/子工程
  deleteESSById: data => {
    return http.construction.post(`/engineeringStructure/batchDelete`, data)
  },
  //施工分组
  getGroupList: (data = {}) => {
    return http.construction.post('/engineeringConstructionTeam/list', data)
  },
  //全部施工分组
  getAllGroupList: (data = {}) => {
    return http.construction.post('/engineeringConstructionTeam/listAll', data)
  },
  //添加分组
  addGroup: data => {
    return http.construction.post('/engineeringConstructionTeam/save', data)
  },
  //更新分组
  updateGroup: data => {
    return http.construction.post('/engineeringConstructionTeam/update', data)
  },
  //删除分组
  deleteGroupById: data => {
    return http.construction.post(`engineeringConstructionTeam/batchDelete`, data)
  },
  uploadSubPayAmount: data => {
    return http.construction.post(`/engineeringAmountsRecord/importEngineeringAmountsSubcontract`, data, {
      contentType: 'multipart/form-data'
    })
  },
  //分包汇总工程量管理列表
  getSubPayAmountList: data => {
    return http.construction.post('/engineeringAmountsRecord/list', data)
  },
  //获取分包工程量详情
  getSubPayAmountDetail: id => {
    return http.construction.get(`/engineeringAmountsRecord/get/${id}`)
  },
  //编辑页分包工程量列表数据
  getSubPayAmountAllList: data => {
    return http.construction.post(`/engineeringAmountsSubcontract/listAll`, data)
  },
  //获取分包工程量详情
  getSubPayAmountInfoDetail: id => {
    return http.construction.get(`/engineeringAmountsSubcontract/getRecordInfo/${id}`)
  },
  //提交分包工程量
  saveSubPayAmount: data => {
    return http.construction.post(`/engineeringAmountsSubcontract/bathUpdate`, data)
  },
  //下载分包详情
  downloadSubPayAmount: id => {
    return http.construction.get(`/engineeringAmountsRecord/exportInfo/${id}`, { responseType: 'blob' })
  },
  //获取分包总包工程量汇总
  getSubTotalAmountList: () => {
    return http.construction.get('/engineeringAmountsGeneral/selectSummary')
  },
  //下载分包总包工程量汇总
  downloadSubTotalAmount: () => {
    return http.construction.get(`/engineeringAmountsRecordSummary/exportSummary`, { responseType: 'blob' })
  },
  //获取总包汇总工程量列表
  getOwnerReceiveAmountList: data => {
    return http.construction.post(`/engineeringAmountsRecordSummary/list`, data)
  },
  //下载总包汇总工程量
  downloadOwnerReceiveAmount: id => {
    return http.construction.get(`/engineeringAmountsRecordSummary/exportInfo/${id}`, { responseType: 'blob' })
  },
  //批量下载总包汇总工程量
  downloadOwnerReceiveAmountMultiple: ids => {
    return http.construction.post(`/engineeringAmountsRecordSummary/exportBatch`, ids, { responseType: 'blob' })
  },
  //总包编辑页头部详情
  getTotalPayAmountInfoDetail: id => {
    return http.construction.get(`/engineeringAmountsGeneral/getRecordInfo/${id}`)
  },
  //总包编辑页列表数据
  getTotalPayAmountAllList: (data = {}) => {
    return http.construction.post(`/engineeringAmountsGeneral/listAll`, data)
  },
  //提交总包工程量
  saveTotalPayAmount: data => {
    return http.construction.post(`/engineeringAmountsGeneral/bathUpdate`, data)
  },
  //总包工程量详情
  getTotalPayAmountDetail: id => {
    return http.construction.get(`/engineeringAmountsGeneral/get/${id}`)
  }
}

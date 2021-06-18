import { system } from '@/utils/axios'

const companyAPI = {
  // 获取关联公司列表
  getCompanyList: data => {
    return system.post(`company/relation/list`, data)
  },
  // 获取所有关联公司列表
  getCompanyListAll: data => {
    return system.post(`company/relation/listAll`, data)
  },
  // 新建企业
  addCompanyItem(data) {
    return system.post(`/admin/companyBase/add`, data)
  },
  // 更新企业信息
  updateCompanyItem(data) {
    return system.post(`/admin/companyBase/update`, data)
  },
  // 获取企业详细信息
  getCompanyInfo(id) {
    return system.post(`/admin/companyBase/get/${id}`)
  },
  // 根据统一社会信用代码查询企业 @author yangjiaqi
  getCompanyInfoByCode(code) {
    return system.post('company/relation/queryByCode/' + code)
  },
  // 保存并绑定参与方企业 @author yangjiaqi
  saveCompanyRelation(data) {
    return system.post('company/relation/save', data)
  },
  // 删除参与方企业 @author yangjiaqi
  removeCompanyRelation(participantCompanyId) {
    return system.get('company/relation/delete/' + participantCompanyId)
  }
}

export default companyAPI

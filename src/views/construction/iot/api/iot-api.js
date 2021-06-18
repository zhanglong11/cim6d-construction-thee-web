import { iot } from '@/utils/axios'
const { post, get } = iot

const projectId = localStorage.getItem('projectId')
export default {
  /*设备*/
  // 设备列表
  getIotDeviceList: data => {
    return post(`/device/list`, data)
  },
  // 获取统计数据
  getIotStatistics: data => {
    return post(`/device/statistics`, data)
  },
  // 设备删除
  deleteIotDevice: idList => {
    return post(`/device/delete`, idList)
  },
  // 设备禁用启用
  updateIotDevice: data => {
    return post(`/device/update`, data)
  },
  // 设备详情
  getIotDeviceDetail: id => {
    return get(`/device/get/${id}`)
  },
  // 设备添加
  addIotDevice: data => {
    return post(`/device/add`, data)
  },
  // 设备-运行状态-功能列表-查看数据
  getIotProductInterval: data => {
    return post('/time/productInterval', data)
  },

  /*分组*/
  // 分组列表
  getIotGroupList: data => {
    return post(`/group/list`, data)
  },
  // 分组删除
  deleteIotGroup: ids => {
    return get(`/group/delete/${ids}`)
  },
  // 分组详情
  getIotGroupDetal: id => {
    return get(`/group/get/${id}`)
  },
  // 删除设备绑定分组
  unbindGroupDevice: (groupId, deviceIdList) => {
    return post(`/group/device/unbind/${groupId}`, deviceIdList)
  },
  // 设备绑定分组
  bindGroupDevice: (groupId, deviceIdList) => {
    return post(`/group/device/bind/${groupId}`, deviceIdList)
  },
  // 分组添加
  addIotGroup: data => {
    return post(`/group/add`, data)
  },
  // 分组编辑
  updateGroup: data => {
    return post(`/group/update`, data)
  },

  /*产品*/
  // 产品列表
  getIotProductList: data => {
    return post(`/product/list`, data)
  },
  // 删除产品
  deleteIotProduct: ids => {
    return get(`/product/delete/${ids}`)
  },
  // 标准品类列表
  getIotProductTemplateList: data => {
    return get(`/product/template/list`, data)
  },
  // 产品添加
  addIotProduct: data => {
    return post(`/product/add`, data)
  },
  // 产品编辑
  updateIotProduct: data => {
    return post(`/product/update`, data)
  },
  // 产品详情
  getIotProductDetail: id => {
    return get(`/product/get/${id}`)
  },
  // 产品topic添加
  addIotTopic: data => {
    return post(`/topic/add`, data)
  },
  // 产品topic编辑
  updateIotTopic: data => {
    return post(`/topic/update`, data)
  },
  // 产品topic删除
  deleteIotTopic: ids => {
    return get(`/topic/delete/${ids}`)
  },
  // 产品功能列表
  getIotProductAttributeList: data => {
    return post(`/product/attribute/list`, data)
  },
  // 产品功能删除
  deleteIotProductAttribute: ids => {
    return get(`/product/attribute/delete/${ids}`)
  },
  // 产品功能名称列表：templateId为标准品类id；返回简约数据结构，如：{name: xxx, id: x}
  getIotProductAttributeSimpleList: (templateId, type) => {
    return get(`/attribute/list/${templateId}/${type}`)
  },
  // 产品绑定标准功能
  bindProductStandardAttribute: (productId, idArray) => {
    return post(`/product/standard/attribute/bind/${productId}`, idArray)
  },
  // 产品-自定义功能-(单位列表、数据类型列表)
  getIotArgList: data => {
    return post(`/arg/list`, data)
  },
  // 产品标准功能更新
  updateIotProductStandard: data => {
    return post(`/product/standard/update`, data)
  },
  // 产品自定义功能更新
  updateIotProductCustom: data => {
    return post(`/product/custom/update`, data)
  },
  // 产品自定义功能添加
  addIotProductCustomAttribute: data => {
    return post(`/product/custom/attribute/add`, data)
  },

  /*预警规则*/
  // 预警规则列表
  getIotDeviceWarningRuleList: data => {
    return post(`/device/warning/rule/list`, data)
  },
  // 预警规则添加
  addIotDeviceWarningRule: data => {
    return post(`/device/warning/rule/add`, data)
  },
  // 预警规则编辑
  updateIotDeviceWarningRule: data => {
    return post(`/device/warning/rule/add`, data)
  },
  // 预警规则删除
  deleteIotDeviceWarningRule: id => {
    return get(`/device/warning/rule/delete/${id}`)
  },
  // 预警规则克隆
  cloneIotDeviceWarningRule: (deviceId, idArray) => {
    return post(`/device/warning/rule/clone/${deviceId}`, idArray)
  }
}

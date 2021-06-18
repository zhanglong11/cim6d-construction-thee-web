/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-19 11:22:23
 * @Last Modified by: gengweigang
 * @Last Modified time: 2020-11-27 09:49:32
 */

import http from '@/utils/axios'
export const formApi = {
  // 添加自定义表单
  addForm: data => {
    return http.workflow({
      url: '/custom/form/add',
      method: 'post',
      data
    })
  },
  // 编辑自定义表单
  updateForm: data => {
    return http.workflow({
      url: '/custom/form/update',
      method: 'post',
      data
    })
  },
  // 自定义表单查询
  queryFormList: data => {
    return http.workflow({
      url: '/custom/form/list',
      method: 'post',
      data
    })
  },
  // 根据ID删除表单
  deleteForm: id => {
    return http.workflow({
      url: `/custom/form/delete/${id}`,
      method: 'get'
    })
  },
  // 根据ID获取自定义表单信息
  getDetailsForm: id => {
    return http.workflow({
      url: `/custom/form/get/${id}`,
      method: 'get'
    })
  },
  /**
   任务名称：2747/ 自定义表单：表单分类、表单功能开发
   开发人员：李建敏
   日期：2020-3月-27日
   任务类型：1.全新代码
   **/
  // 获取表单控件
  getFormControls(id) {
    return http.workflow.get('/custom/form/controls/list/' + id).then(res => res.data)
  },
  // 保存控件
  saveControls(id, controls) {
    return http.workflow.post('/custom/form/controls/save/' + id, controls)
  },
  // 添加分组
  addCategory: data => {
    return http.workflow({
      url: '/category/add',
      method: 'post',
      data
    })
  },
  // 编辑分组
  updateCategory: data => {
    return http.workflow({
      url: '/category/update',
      method: 'post',
      data
    })
  },
  // 删除分组
  deleteCategory: id => {
    return http.workflow({
      url: `/category/delete/${id}`,
      method: 'get'
    })
  },
  // 分组树
  treeCategory: data => {
    return http.workflow({
      url: '/category/tree',
      method: 'post',
      data
    })
  }
}

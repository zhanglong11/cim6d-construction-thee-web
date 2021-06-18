import { labour } from '@/utils/axios'
import http from '@/utils/axios'
const { post, get } = labour

const projectId = localStorage.getItem('projectId')
export default {
  /*劳务公司*/
  // 劳务公司列表
  getLabourCompanyList: data => {
    return post(`/company/list`, data)
  },
  // 删除劳务公司
  deleteLabourCompany: data => {
    return post(`/company/delete`, data)
  },
  // 劳务公司详情
  getLabourCompanyDetail: id => {
    return get(`/company/get/${id}`)
  },
  // 劳务公司新增
  addLabourCompany: data => {
    return post(`/company/add`, { projectId: localStorage.getItem('projectId'), ...data })
  },
  // 劳务公司修该
  updateLabourCompany: data => {
    return post(`/company/update`, data)
  },
  // 查看公司树下在职状态的员工
  getLabourCompanyTree: data => {
    return post(`/company/tree`, data)
  },

  /*班组*/
  // 班组列表
  getLabourGroupList: data => {
    return post(`/group/list`, data)
  },
  // 班组删除
  deleteLabourGroup: ids => {
    return get(`/group/delete/${ids}`)
  },
  // 根据项目id加载班组名称列表(班组名称下拉框使用)
  getLabourGroupBaseList: () => {
    return get(`/group/baseList/${projectId}`)
  },
  // 班组详情
  getLabourGroupDetail: id => {
    return get(`/group/get/${id}`)
  },
  // 班组新增
  addLabourGroup: data => {
    return post(`/group/add`, data)
  },
  //所有公司及班组
  getCompanyAndGroup: data => {
    return post(`/company/getCompanyAndGroup`, { projectId: localStorage.getItem('projectId'), data })
  },
  // 班组编辑
  updateLabourGroup: data => {
    return post(`/group/update`, data)
  },

  /*工人信息*/
  // 工人信息列表
  getLabourEmployeeList: data => {
    return post(`/employee/list`, data)
  },
  // 工人信息删除
  deleteLabourEmployee: data => {
    return post(`/employee/delete/`, data)
  },
  // 工人信息详情
  getLabourEmployeeDetail: id => {
    return get(`/employee/get/${id}`)
  },
  getLabourEmployeeDetails: id => {
    return get(`/employee/get/${id}`)
  },
  //工人考勤详情
  getLabourAttence: data => {
    return post(`/employee/viewAttendance`, data)
  },
  //考勤管理列表
  getAttendancDetail: data => {
    return post(`/employee/getAttendanceManagement`, {
      projectId: localStorage.getItem('projectId'),
      endDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      startDate: moment(new Date(new Date().getTime() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
      ...data
    })
  },
  // 工人信息添加
  addLabourEmployee: data => {
    return post(`/employee/add`, { projectId: localStorage.getItem('projectId'), ...data })
  },
  // 工人信息编辑
  updateLabourEmployee: data => {
    return post(`/employee/update`, data)
  },
  //导入
  importLabor: data => {
    return post('/employee/importExcelOfFaceDistinguish', data, {
      'Content-Type': 'multipart/form-data'
    })
  },
  //劳务人员工资支付列表
  getPeoplePlay: data => {
    return post(`/salaryManagement/list`, data)
  },
  //劳务人员工资支付详情
  getPeoplePlayDate: id => {
    return get(`/salaryManagement/get/${id}`)
  },
  //下载工资模板接口
  getSalaryDown: data => {
    return get(`/salaryManagement/downLoad/`, { responseType: 'blob' })
  },
  //导入工资单
  getImportLabor: data => {
    return post('/salaryManagement/importExcel', data, {
      'Content-Type': 'multipart/form-data'
    })
  },
  //考勤导出
  getAttenceExport: data => {
    return post(`/employee/exportAttendanceManagement`, data, { responseType: 'blob' })
  },
  //查看考勤导出
  getLabourExport: data => {
    return post(`/employee/exportViewAttendance`, data, { responseType: 'blob' })
  },
  //判断班组下是否有人
  getGroupEmployee: id => {
    return get(`/company/getGroupEmployee/${id}`)
  },
  //个人工资导出
  getExport: id => {
    return get(`/employee/exportPayroll/${id}`, { responseType: 'blob' })
  },
  //测试假接口
  getPlanList: data => {
    return http.post('cim6d/system/project/list', data)
  },
  //人员导入
  getLabourimportExcel: data => {
    return post(`/employee/importExcel`, data, { 'Content-Type': 'multipart/form-data' })
  },
  //xiaz
  getExportTemplateDown: data => {
    return get(`/employee/exportTemplate/`, { responseType: 'blob' })
  }
}

import axios from '@/utils/axios'

export default {
  //考勤组管理
  getAttendanceClockInList: data => axios.construction.post(`/attendanceGroup/list`, data),
  getAttendanceClockInAdd: data => axios.construction.post(`/attendanceGroup/add`, data),
  getAttendanceClockInUpdate: data => axios.construction.post(`/attendanceGroup/update`, data),
  getAttendanceClockInDetail: id => axios.construction.get(`/attendanceGroup/get/${id}`),
  getAttendanceClockInDelete: id => axios.construction.get(`/attendanceGroup/delete/${id}`),
  getAttendanceClockInbyDay: data => axios.construction.post(`/attendanceClockIn/byDay`, data),
  getAttendanceClockInbyMonth: data => axios.construction.post(`/attendanceClockIn/byMonth`, data),
  //导出
  getbyMonthExport: data =>
    axios.construction.post(`/attendanceClockIn/byMonth/export`, data, { responseType: 'blob' }),

  getbybyDayExport: data => axios.construction.post(`/attendanceClockIn/byDay/export`, data, { responseType: 'blob' }),

  getDetailKaopin: data => axios.construction.post(`/attendanceClockIn/byMonth/detail`, data)
}

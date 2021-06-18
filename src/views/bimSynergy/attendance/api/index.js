import axios, { iotEquipmentMonitor } from '@/utils/axios'
const { post, get } = iotEquipmentMonitor

export default {
  getGroupBar: data => post(`/deli/getEmploeeKqInfo`, data),

  getAttendanceList: data => post(`/deli/selectClockInfo`, data),

  laborBar: data => post(`/deli/getLabourEmploeeKqInfo`, data),

  groupList: data => post(`/deli/getDepartmentEmploeeKqInfo`, data),

  zhuChart: data => post(`/deli/selectDepartmentAttendanceRank`, data),

  errList: data => post(`/deli/selectDepartmentStatisticalInformation`, data)
}

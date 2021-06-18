import http from '@/utils/axios'
export default {
  eleDetail: id => http.iotEquipmentMonitor.get(`/hrsd/selectElectricityAmount/${id}`),

  waterDetail: id => http.iotEquipmentMonitor.get(`/hrsd/selectWaterAmount/${id}`),

  waterList: data => http.iotEquipmentMonitor.post(`/hrsd/selectWaterStatistics`, data),

  eleList: data => http.iotEquipmentMonitor.post(`/hrsd/selectElectricityStatistics`, data)
}

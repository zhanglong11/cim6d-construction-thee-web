import http from '@/utils/axios'

export default {
  // 获取天气
  getWeatherInfo: data => http.system.post(`/weather/info`, data),
  // 分页查询巡更路线列表 @author LiZongLiang
  queryPatrolRouter: data => http.construction.post(`/patrol/route/list`, data),
  // 巡更路线详情 @author LiZongLiang
  getPatrolRouter: patrolRouteId => http.construction.get(`/patrol/route/get/${patrolRouteId}`),
  // 分页查询巡更计划列表 @author LiZongLiang
  queryPatrol: data => http.construction.post(`/patrol/list`, data),
  // 巡更计划详情 @author LiZongLiang
  getPatrol: patrolId => http.construction.get(`/patrol/get/${patrolId}`),
  // 获取产品列表
  queryProductList: data => http.iot.post(`/product/listAll`, data),
  // 获取设备列表
  queryDeviceList: data => http.iot.post(`/device/list`, data),
  // 华润物联网对接-查询塔吊遥测数据
  queryTadiaoSelectTowerTelemetryData: data => http.iotEquipmentMonitor.post(`/tadiao/selectTowerTelemetryData`, data),
  // 华润物联网对接-分页查询告警记录 @author sunshihao
  querySelectAlarmDataPage: data => http.iotEquipmentMonitor.post(`/tadiao/selectAlarmDataPage`, data),
  // 华润物联网对接-查询告警记录已处理与处理中总数 @author sunshihao
  querySelectAlarmHandleCount: data => http.iotEquipmentMonitor.post(`/tadiao/selectAlarmHandleCount`, data),
  // 华润物联网对接-查询升降机遥测数据 @author linhansheng
  queryLifterSelectLifterTelemetryData: data =>
    http.iotEquipmentMonitor.post(`/lifter/selectLifterTelemetryData`, data),
  // 巡更统计 @author LiZongLiang
  queryPatrolStatistical: data => http.construction.post(`/patrol/statistical`, data),
  // 巡更树结构 @author LiZongLiang
  getPatrolTree: () => http.construction.get(`/patrolTree`),
  // 巡更树结构 @author LiZongLiang
  // getPatrolTree: () => http.construction.get(`/patrolTree`),
  // 查询时间段内AQI数据 @author sunshihao
  queryYcSelectAqiYc: data => http.iotEquipmentMonitor.post(`/yc/selectAqiYc`, data),
  // 查询时间段内扬尘数据 @author sunshihao
  queryYcSelectDataListYc: data => http.iotEquipmentMonitor.post(`/yc/selectDataIntervalYc`, data),
  // 大屏实时环境监测 @author sunshihao
  queryYcCurrentInfo: data => http.iotEquipmentMonitor.post(`/yc/devCurrentInfo`, data),

  getEquipmentModelId: data => http.iotEquipmentMonitor.post(`/iot/device/bim/batchGet`, data),

  getElement: (modelId, data) => http.iotEquipmentMonitor.post(`/iot/device/bim/reverseGet/${modelId}`, data)
}

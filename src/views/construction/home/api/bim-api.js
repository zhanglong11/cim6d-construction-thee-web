// bim Api
import axios, { gis } from '@/utils/axios'
import http from '@/utils/axios'
const { post, get } = gis
export const bimApi = {
  // 楼层树
  getFloorTreeData: bimResourceId => {
    return http.gis({
      url: `/noToken/basic/commonFile/get/fdht/bim_${bimResourceId}/space.json`,
      method: 'get'
    })
  },
  // 专业树
  getSpecialTreeData: bimResourceId => {
    return http.gis({
      url: `/noToken/basic/commonFile/get/fdht/bim_${bimResourceId}/special.json`,
      method: 'get'
    })
  },
  // 项目特征树
  getProjectFeatureTreeData: bimResourceId => {
    return http.gis({
      url: `/noToken/basic/commonFile/get/fdht/bim_${bimResourceId}/bill.json`,
      method: 'get'
    })
  }
}

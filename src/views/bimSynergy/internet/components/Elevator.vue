<template>
  <div class="container">
    <div class="elevator-main">
      <div class="elevator-left">
        <div class="elevator-con">
          <BlockCard title="智能设备">
            <template #content>
              <el-select v-model="deviceType" class="device-type" @change="changeDeviceType">
                <el-option v-for="(item, i) in deviceList" :key="i" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <div class="elevator-list">
                <ul>
                  <li
                    v-for="(item, index) in list"
                    :key="index"
                    :class="{ active: item.id === active }"
                    @click="handleTab(item)"
                  >
                    <div class="top-line"></div>
                    <div class="bottom-line"></div>
                    <div class="floor-img">
                      <img :src="require(`../../newImages/internet/device/icon${item.productTemplateId}.png`)" alt="" />
                    </div>
                    <div class="floor-title">
                      <h2>{{ item.name }}</h2>
                      <span class="status" :class="{ red: item.normal !== 1 }">
                        {{ item.normal === 0 ? '报警' : item.normal === 1 ? '正常' : '离线' }}
                      </span>
                      <!-- <p>{{ item.deviceAddress }}</p> -->
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </BlockCard>
          <DialogElevator :visible.sync="dialogVisible" :dataValue="dialogData" />
        </div>
      </div>
      <div class="elevator-center">
        <div class="elevator-con">
          <!-- <BlockCard :title="'模型展示'">
            <template #content>
              <div class="bm-con">
                <BimView ref="bim" :model-id="localStorage.getItem('bimModelId')" :bimBgColor="bimConfig.bimBgColor" />
              </div>
            </template>
          </BlockCard> -->
        </div>
      </div>
      <div class="elevator-right">
        <div class="warn-wrapper">
          <BlockCard :title="'报警信息'" class="no-padding">
            <template #content>
              <ul class="list">
                <li>
                  <div class="alarm-icon">
                    <img src="../../newImages/internet/circle-red.png" alt="" />
                  </div>
                  <div>
                    <p>处理中总数</p>
                    <p>{{ alarmDataTotal.handlingCount }}</p>
                  </div>
                </li>
                <li>
                  <div class="alarm-icon alarm-icon-total">
                    <img src="../../newImages/internet/circle-green.png" alt="" />
                  </div>
                  <div>
                    <p>已处理总数</p>
                    <p class="green">{{ alarmDataTotal.handledCount }}</p>
                  </div>
                </li>
              </ul>

              <div class="report-list">
                <ul v-if="tableData.length > 0">
                  <li v-for="(item, i) in tableData" :key="i">
                    <div class="box">
                      <div class="title">{{ item.deviceName }}</div>
                      <div class="time">
                        <span>{{ item.ts }}</span>
                        <p class="status">
                          <span v-if="handleStatus === '0'" class="gold">已处理</span>
                          <span v-else class="unprocessed">未处理</span>
                        </p>
                      </div>
                      <div class="desc">
                        {{ item.alarmContent }}
                      </div>
                    </div>
                  </li>
                </ul>
                <span v-else class="no-data">
                  <img src="../../newImages/internet/no-data.png" alt="" />
                  暂无数据…
                </span>
              </div>
            </template>
          </BlockCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../api'
import BlockCard from '../../componments/BlockCard'
import DialogElevator from './DialogElevator' // 升降机 模态框
import bimConfig from '../../bimConfig' // bim模型配置
export default {
  name: 'Elevator',
  components: {
    BlockCard,
    DialogElevator
  },
  data() {
    return {
      deviceType: '',
      deviceList: [
        {
          value: '',
          label: '全部智能设备'
        },
        {
          value: 1,
          label: '智能升降机'
        },
        {
          value: 2,
          label: '智能塔机'
        },
        {
          value: 3,
          label: '智能电表'
        },
        {
          value: 4,
          label: '智能水表'
        }
      ],
      productTemplateIdList: [66, 67, 75, 76],
      //升级机选中
      active: 0,
      //升降机报警信息表格数据
      tableData: [],
      alarmDataTotal: {
        handledCount: 0,
        handlingCount: 0
      },
      //左侧升降机数据
      list: [],
      dialogVisible: false,
      dialogData: {},
      bimConfig,
      checkEle: []
    }
  },
  computed: {
    bimReady() {
      return this.$parent.$parent.$parent.$parent.bimReady
    }
  },
  watch: {
    bimReady(v) {
      if (v) {
        if (this.list.length) {
          this.getEquipmentElement(this.list[0].id)
        }
      }
    }
  },
  mounted() {
    this.queryProductList()
    this.$nextTick(() => {
      if (this.bimReady) {
        if (this.list.length) {
          this.getEquipmentElement()
        }
      }
    })
  },
  beforeDestroy() {
    this.initModel()
  },
  methods: {
    // 获取产品列表
    async queryProductList() {
      let params = {
        productTemplateIdList: this.productTemplateIdList
      }
      let result = await Api.queryProductList(params)
      let datas = result.data || []
      let list = [
        {
          value: '',
          key: '',
          label: '全部智能设备'
        }
      ]
      datas.forEach((e, i) => {
        list.push({
          value: e.id,
          label: e.name,
          key: e.productKey
        })
        if (i === 0) {
          this.queryDeviceList()
        }
      })
      this.deviceList = list
    },
    // 获取设备列表
    async queryDeviceList(productId) {
      let params = {
        productId,
        productTemplateIdList: this.productTemplateIdList,
        page: 1,
        rows: 100
      }
      let result = await Api.queryDeviceList(params)
      let datas = result.data
      let list = datas.records || []
      list.forEach((e, i) => {
        if (i === 0) {
          this.active = e.id
          this.querySelectAlarmData(e.id)
          if (this.bimReady) {
            this.getEquipmentElement(e.id)
          }
        }
      })
      this.list = list
    },
    // 查询告警信息
    querySelectAlarmData(devId) {
      this.querySelectAlarmHandleCount(devId)
      this.querySelectAlarmDataPage(devId)
    },
    // 查询告警记录已处理与处理中总数
    async querySelectAlarmHandleCount(devId) {
      if (!devId) {
        return
      }
      let params = {
        devId
      }
      let result = await Api.querySelectAlarmHandleCount(params)
      let datas = result.data
      this.alarmDataTotal = datas
      console.log('查询告警记录已处理与处理中总数', datas)
    },
    // 分页查询告警记录
    async querySelectAlarmDataPage(devId) {
      if (!devId) {
        return
      }
      let params = {
        devId,
        page: 1,
        rows: 10
      }
      let result = await Api.querySelectAlarmDataPage(params)
      let datas = result.data
      let list = datas.records || []
      this.tableData = list
    },
    // 改变智能设备
    changeDeviceType(type) {
      this.queryDeviceList(type)
    },
    // 设备点击事件
    handleTab(item) {
      console.log(111, item)
      this.active = item.id
      this.dialogData = item
      this.dialogVisible = true
      this.querySelectAlarmData(item.id)
      this.getEquipmentElement(item.id)
    },

    //获取设备构件
    async getEquipmentElement(id) {
      let bimApp = this.$parent.$parent.$parent.$parent.$refs.bim
      // bimApp.clearMark()
      bimApp.setHighlightEnabled(false)
      if (this.checkEle && this.checkEle.length) {
        bimApp.setElementsColor(this.checkEle, null)
      }
      let res = await Api.getEquipmentModelId([id])
      if (!res.data || !res.data.length) {
        return
      }
      let elementId = res.data.filter(d => d.componentIdList && d.componentIdList.length)
      let initEleAry = [...new Set(elementId.map(e => e.componentIdList).flat())]
      this.checkEle = initEleAry || []
      if (!initEleAry.length) {
        bimApp.setCameraPickData()
        return
      }
      bimApp.pickElement(initEleAry)
      bimApp.setElementsColor(initEleAry, [245, 82, 36])

      let cameraInfo = res.data[0]?.modelView || ''
      // let tt = {
      //   fov: 46,
      //   distance: 16.682126089181658,
      //   phi: 0.625432925199433,
      //   theta: 1.1424018366025517,
      //   at: [1020.1820068359372, 1223.3850097656243, -0.24148583412170402]
      // }
      if (cameraInfo) {
        bimApp.setCameraData(JSON.parse(cameraInfo))
      }
      // bimApp.setMark({
      //   eleAry: initEleAry,
      //   imgSrc: require('../../images/internet/issue.png'),
      //   callBack: this.iconClick
      // })
    },
    //标注点击
    async iconClick(e) {
      let bimApp = this.$parent.$parent.$parent.$parent.$refs.bim
      let doc = e.split('+')[1].split('/')
      let param = { docId: doc[0], elementId: doc[1] }
      let res = await Api.getElement(localStorage.getItem('bimModelId'), param)
      this.currentId = res.data
      bimApp.showDetail(e)
    },
    // 表格样式处理
    tableRowClassName({ row }) {
      if (row.status === 0) {
        return 'success-row'
      }
      return ''
    },
    initModel() {
      if (this.checkEle && this.checkEle.length) {
        let bimApp = this.$parent.$parent.$parent.$parent.$refs.bim
        console.log(bimApp)
        bimApp && bimApp.setElementsColor(this.checkEle, null)
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('./Elevator');
</style>

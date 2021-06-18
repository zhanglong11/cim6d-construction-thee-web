<template>
  <el-dialog
    class="custom-dialog"
    :class="{ 'is-line': dataValue.productTemplateId === '67' || dataValue.productTemplateId === '66' }"
    :visible="visible"
    :title="`${dataValue.name}：${dataValue.deviceAddress || ''}`"
    append-to-body
    :width="dataValue.productTemplateId === '67' || dataValue.productTemplateId === '66' ? '80%' : '900px'"
    @close="close"
  >
    <!-- 升降机 模态框 start -->
    <div v-if="dataValue.productTemplateId === '67'" class="elevator device">
      <div class="elevator-left">
        <h4 class="mode-title">
          <span class="top-line"></span>
          <span class="bottom-line"></span>
          <span class="title">实时监控</span>
        </h4>
        <div v-if="visible" class="video-img">
          <span class="top-line"></span>
          <span class="bottom-line"></span>
          <template v-if="videoList.length > 0">
            <template v-for="(item, index) in videoList">
              <div v-if="item.videoUrl" :key="index" class="vm-item">
                <Video :ref="item.id" :url="item.videoUrl" />
              </div>
            </template>
          </template>
          <img v-else src="../../images/internet/shengjiang.png" />
          <!-- <ul>
            <li>2021-01-16 16:38:00</li>
            <li>在线</li>
          </ul> -->
        </div>
      </div>
      <div class="elevator-right">
        <h4 class="mode-title">
          <span class="top-line"></span>
          <span class="bottom-line"></span>
          <span class="title">设备信息</span>
        </h4>
        <el-row :gutter="20" class="model-content">
          <el-col :span="24">
            <ul class="model-info device-info">
              <li>
                <span>设备编号：</span>
                <span>{{ info.devsn }}</span>
              </li>
              <li>
                <span>载重重量：</span>
                <span>{{ info.weight }} kg</span>
              </li>
              <li>
                <span>运行速度：</span>
                <span>{{ info.speed }} 米</span>
              </li>
              <li>
                <span>发送时间：</span>
                <span>{{ info.sendtime }}</span>
              </li>
              <li>
                <span>运行高度：</span>
                <span>{{ info.height }} 米</span>
              </li>
              <li>
                <span>前门状态：</span>
                <span>{{ info.foreDoorStatus === '1' ? '打开' : '关闭' }}</span>
              </li>
              <li>
                <span>后门状态：</span>
                <span>{{ info.behindDoorStatus === '1' ? '打开' : '关闭' }}</span>
              </li>
              <li>
                <span>风速：</span>
                <span>{{ info.windSpeed }} m/s</span>
              </li>
              <li>
                <span>重量百分比：</span>
                <span>{{ info.weightPercent }} %</span>
              </li>
              <li>
                <span>高度百分比：</span>
                <span>{{ info.heightPercent }} %</span>
              </li>
              <li>
                <span>实时倾斜度1：</span>
                <span>{{ info.tilt1 }} 度</span>
              </li>
              <li>
                <span>倾斜百分比1：</span>
                <span>{{ info.tiltPercent1 }} %</span>
              </li>
              <li>
                <span>实时倾斜度2：</span>
                <span>{{ info.tilt2 }} 度</span>
              </li>
              <li>
                <span>倾斜百分比2：</span>
                <span>{{ info.tiltPercent2 }} %</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 升降机 模态框 end -->
    <!-- 塔机 模态框 start -->
    <div v-if="dataValue.productTemplateId === '66'" class="elevator device">
      <div class="elevator-left">
        <h4 class="mode-title">
          <span class="top-line"></span>
          <span class="bottom-line"></span>
          <span class="title">实时监控</span>
        </h4>
        <div v-if="visible" class="video-img">
          <span class="top-line"></span>
          <span class="bottom-line"></span>
          <template v-if="videoList.length > 0">
            <template v-for="(item, index) in videoList">
              <div v-if="item.videoUrl" :key="index" class="vm-item">
                <Video :ref="item.id" :url="item.videoUrl" />
              </div>
            </template>
          </template>
          <img v-else src="../../images/internet/taji.png" />
          <!-- <ul v-if="videoList.length > 0">
            <li>2021-01-16 16:38:00</li>
            <li>在线</li>
          </ul> -->
        </div>
      </div>
      <div class="elevator-right">
        <h4 class="mode-title">
          <span class="top-line"></span>
          <span class="bottom-line"></span>
          <span class="title">设备信息</span>
        </h4>
        <el-row :gutter="20" class="model-content">
          <el-col :span="24">
            <ul class="model-info device-info">
              <li>
                <span>设备编号：</span>
                <span>{{ info.devNo }}</span>
              </li>
              <li>
                <span>风速：</span>
                <span>{{ info.wind }} m/s</span>
              </li>
              <li>
                <span>载重：</span>
                <span>{{ info.weight }} t</span>
              </li>
              <li>
                <span>回转：</span>
                <span>{{ info.rotation }} °</span>
              </li>
              <li>
                <span>幅度：</span>
                <span>{{ info.radius }} m</span>
              </li>
              <li>
                <span>高度：</span>
                <span>{{ info.height }} m</span>
              </li>
              <li>
                <span>力矩百分比：</span>
                <span>{{ info.torquePercent }} %</span>
              </li>
              <li>
                <span>力矩：</span>
                <span>{{ info.torque }} t*m</span>
              </li>
              <li>
                <span>倾角X：</span>
                <span>{{ info.angleX }} °</span>
              </li>
              <li>
                <span>倾角Y：</span>
                <span>{{ info.angleY }} °</span>
              </li>
              <li>
                <span>当前倍率：</span>
                <span>{{ info.multipRate }}</span>
              </li>
              <li>
                <span>定幅变码：</span>
                <span>{{ info.fixedCodeAmplitude }}</span>
              </li>
              <li>
                <span>定码变幅：</span>
                <span>{{ info.fixedAmplitudeVariableCode }}</span>
              </li>
              <!-- <li>
                <span>报警状态：</span>
                <span>{{ info.alarmState }}</span>
              </li>
              <li>
                <span>传感器状态：</span>
                <span>{{ info.sensorState }}</span>
              </li> -->
              <li>
                <span>实时额定载重：</span>
                <span>{{ info.rated_weight }} t</span>
              </li>
              <li>
                <span>风级：</span>
                <span>{{ info.windLevel }}</span>
              </li>
              <!-- <li>
                <span>一类禁吊区报警代码：</span>
                <span>{{ info.alarmCode1 }}</span>
              </li>
              <li>
                <span>二类禁吊区报警代码：</span>
                <span>{{ info.alarmCode2 }}</span>
              </li> -->
              <li>
                <span>时间：</span>
                <span>{{ info.time }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 塔机 模态框 end -->
    <!-- 电表 模态框 start -->
    <DialogElectric v-if="dataValue.productTemplateId === '75'" :id="deviceId"></DialogElectric>
    <!-- 电表 模态框 end -->
    <!-- 水表 模态框 start -->
    <DialogWater v-if="dataValue.productTemplateId === '76'" :id="deviceId" />
    <!-- 水表 模态框 end -->
  </el-dialog>
</template>

<script>
import Api from '../../api'
import HomeApi from '../../main/api/index'
import Video from '../../componments/Video'
import DialogWater from '@/views/bimSynergy/internet/components/DialogWater'
import DialogElectric from '@/views/bimSynergy/internet/components/DialogElectric'
export default {
  name: 'DialogElevator',
  components: {
    Video,
    DialogWater,
    DialogElectric
  },
  props: {
    visible: {},
    id: {},
    dataValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      info: {},
      videoList: [],
      timer: null,
      status,
      deviceId: null
    }
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init()
      }
    }
  },
  // 方法集合
  methods: {
    // 关闭弹窗
    close() {
      this.videoList = []
      this.clearTouch()
      this.$emit('update:visible', false)
    },
    // 初始化
    init() {
      if (!this.dataValue.id) {
        return
      }
      this.deviceId = this.dataValue.id
      // 获取塔吊详情
      if (this.dataValue.productTemplateId === '66') {
        this.queryTadiaoSelectTowerTelemetryData()
        this.timer = setInterval(() => {
          this.queryTadiaoSelectTowerTelemetryData()
          this.touch()
        }, 9000)
      }
      // 获取升降机详情
      if (this.dataValue.productTemplateId === '67') {
        this.queryLifterSelectLifterTelemetryData()
        this.timer = setInterval(() => {
          this.queryLifterSelectLifterTelemetryData()
          this.touch()
        }, 9000)
      }
    },
    // 华润物联网对接-查询塔吊遥测数据
    async queryTadiaoSelectTowerTelemetryData() {
      let params = {
        devId: this.dataValue.id
      }
      let result = await Api.queryTadiaoSelectTowerTelemetryData(params)
      let datas = result.data
      let towerDataList = datas.towerDataList || {}
      let videoList = datas.monitorCameraQueryDTOS || []
      this.info = towerDataList
      this.formatVideo(videoList)
    },
    // 华润物联网对接-查询升降机遥测数据
    async queryLifterSelectLifterTelemetryData() {
      let params = {
        devId: this.dataValue.id
      }
      let result = await Api.queryLifterSelectLifterTelemetryData(params)
      let datas = result.data
      let lifterDataList = datas.lifterDataList || {}
      let videoList = datas.monitorCameraQueryDTOS || []
      this.info = lifterDataList
      this.formatVideo(videoList)
    },
    // 处理视频地址
    formatVideo(array) {
      let list = array.filter((e, i) => i === 0)
      list.forEach(e => {
        e.videoUrl = ''
      })
      list.forEach((e, i) => {
        this.getVideoUrlAndPlayVideo(e, i)
      })
    },
    // 调用start，返回播放地址，并进行播放
    getVideoUrlAndPlayVideo(item, i) {
      HomeApi.getVideoUrl({
        factoryNum: item.factoryNum,
        deviceNum: item.deviceNum,
        projectId: this.projectId
      }).then(res => {
        let datas = res.data
        let videoUrl = datas ? datas.HLS : ''
        item.videoUrl = videoUrl
        if (!videoUrl) {
          return
        }
        let index = _.map(this.videoList, 'videoUrl').includes(videoUrl)
        if (!index) {
          this.videoList.push(item)
        }
      })
    },
    // 视频试试直播
    touch() {
      this.videoList.forEach(e => {
        if (e.videoUrl) {
          HomeApi.touch({ factoryNum: e.factoryNum, deviceNum: e.deviceNum, projectId: this.projectId })
        }
      })
    },
    clearTouch() {
      clearInterval(this.timer)
      this.timer = null
    },
    initInfo(data) {
      let rectifyList = data.rectifyReviewList
      if (!rectifyList || !rectifyList.length) {
        this.info = data
        return
      }
      //
      let rectify = rectifyList.filter(r => r.rectifyReviewFlag === 0)
      let recheck = rectifyList.filter(r => r.rectifyReviewFlag === 1)
      let rectifyClone = _.cloneDeep(rectify)
      let recheckClone = _.cloneDeep(recheck)
      let fileId = [
        data.fileId,
        ...rectifyClone.map(r => r.rectifyFileId),
        ...recheckClone.map(r => r.reviewFileId)
      ].filter(c => c)
      let rectifyTime = [...new Set(rectifyClone.map(r => r.rectifyTime))].join(', ')
      let recheckTime = [...new Set(recheckClone.map(r => r.reviewTime))].join(', ')
      let rectifyName = [...new Set(rectifyClone.map(r => r.rectifyPrincipalName))].join(', ')
      let recheckName = [...new Set(recheckClone.map(r => r.reviewPrincipalName))].join(', ')
      this.info = {
        ...data,
        fileId: [...new Set(fileId)].join(','),
        rectifyTime,
        recheckTime,
        rectifyName,
        recheckName
      }
    }
  }
}
</script>

<style scoped lang="less">
@import url('./dialogElevator');
</style>

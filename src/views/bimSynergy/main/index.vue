<template>
  <div class="content">
    <div class="main">
      <div class="left">
        <!-- <div class="project-schedule">
          <div class="status">{{ scheduleStatus }}</div>
          <div class="value">{{ progressCompletedTotal }}%</div>
          <div class="spin"></div>
          <div id="progress-bar" :style="'width:' + scheduleStatusWidth + 'px'"></div>
        </div> -->
        <div class="project-general">
          <BlockCard :title="'项目概况'" :isOverflow="true">
            <template #content>
              <div class="pg-item-con">
                <div class="pg-item">
                  <div class="top-line"></div>
                  <div class="bottom-line"></div>
                  <div class="icon pg-name"></div>
                  <div class="text">
                    <div class="title">项目名称</div>
                    <div class="value" :title="projectInfo.name">{{ projectInfo.name }}</div>
                  </div>
                </div>
                <div class="pg-item">
                  <div class="top-line"></div>
                  <div class="bottom-line"></div>
                  <div class="icon pg-person"></div>
                  <div class="text">
                    <div class="title">项目负责人</div>
                    <div class="value">{{ projectInfo.principalName }}</div>
                  </div>
                </div>
                <!-- <div class="pg-item">
                <div class="icon pg-phone"></div>
                <div class="text">
                  <div class="title">联系方式</div>
                  <div class="value">{{ projectInfo.telephone }}</div>
                </div>
              </div> -->
                <div class="pg-item">
                  <div class="top-line"></div>
                  <div class="bottom-line"></div>
                  <div class="icon pg-time"></div>
                  <div class="text">
                    <div class="title">开工日期</div>
                    <div class="value">{{ projectInfo.startTime | formatData }}</div>
                  </div>
                </div>
                <div class="pg-item">
                  <div class="top-line"></div>
                  <div class="bottom-line"></div>
                  <div class="icon pg-time"></div>
                  <div class="text">
                    <div class="title">计划竣工日期</div>
                    <div class="value">{{ projectInfo.endTime | formatData }}</div>
                  </div>
                </div>
                <div class="pg-item">
                  <div class="top-line"></div>
                  <div class="bottom-line"></div>
                  <div class="icon pg-area"></div>
                  <div class="text">
                    <div class="title">建筑面积</div>
                    <div class="value">{{ projectInfo.buildingArea }}㎡</div>
                  </div>
                </div>
              </div>
            </template>
          </BlockCard>
        </div>
        <!-- <div class="scene-unit">
          <BlockCard :title="'现场参建单位'">
            <template #content>
              <div v-if="sceneUnitList.length" class="su-con">
                <div v-for="(item, index) in sceneUnitList" :key="index" class="su-item">
                  <div class="unit">
                    <div class="icon su-ce"></div>
                    <div class="value su-bg" :title="item.companyName">{{ item.companyName }}</div>
                  </div>
                  <div class="build">
                    <span>◂</span>
                    <span class="name" :title="item.unitName">{{ item.unitName }}</span>
                    <span>▸</span>
                  </div>
                </div>
              </div>
              <div v-else class="su-con su-con-null">暂无数据</div>
            </template>
          </BlockCard>
        </div> -->

        <!-- <div class="video-monitor">
          <BlockCard :title="'视频监控画面'">
            <template #content>
              <div v-if="videoList.length" class="vm-con">
                <template v-for="(item, index) in videoList">
                  <div v-if="_.get(item, 'videoUrl')" :key="index" class="vm-item">
                    <Video :ref="item.id" :url="item.videoUrl" />
                  </div>
                </template>
              </div>
              <div v-else class="vm-con vm-con-null">暂无数据</div>
            </template>
          </BlockCard>
        </div> -->

        <div class="month-progress">
          <BlockCard :title="'本月完成进度'">
            <template #content>
              <div class="progress-total">
                <ul>
                  <li>
                    <div class="progress-icon">
                      <img src="../newImages/main/progress-icon1.png" />
                    </div>

                    <span class="title" v-text="progressTabList[0]"></span>
                    <div class="progress-con">
                      <div class="progress-title">
                        <span class="number" style="color: #3d93ff">{{ normalFinishedNum }}</span>
                        <span class="percentage">{{ normalFinishedNumPercentage }}%</span>
                      </div>
                      <el-progress
                        :percentage="normalFinishedNumPercentage"
                        color="#3D93FF"
                        :stroke-width="4"
                        :show-text="false"
                      ></el-progress>
                    </div>
                  </li>
                  <li>
                    <div class="progress-icon progress-icon2">
                      <img src="../newImages/main/progress-icon2.png" />
                    </div>
                    <span class="title" v-text="progressTabList[1]"></span>
                    <div class="progress-con">
                      <div class="progress-title">
                        <span class="number" style="color: #77eed7">{{ advanceFinishedNum }}</span>
                        <span class="percentage">{{ advanceFinishedNumPercentage }}%</span>
                      </div>
                      <el-progress
                        :percentage="advanceFinishedNumPercentage"
                        color="#77EED7"
                        :stroke-width="4"
                        :show-text="false"
                      ></el-progress>
                    </div>
                  </li>
                  <li>
                    <div class="progress-icon progress-icon3">
                      <img src="../newImages/main/progress-icon3.png" />
                    </div>
                    <span class="title" v-text="progressTabList[2]"></span>
                    <div class="progress-con">
                      <div class="progress-title">
                        <span class="number" style="color: #fff47f">{{ delayFinishedNum }}</span>
                        <span class="percentage">{{ delayFinishedNumPercentage }}%</span>
                      </div>
                      <el-progress
                        :percentage="delayFinishedNumPercentage"
                        color="#FFF47F"
                        :stroke-width="4"
                        :show-text="false"
                      ></el-progress>
                    </div>
                  </li>
                </ul>
              </div>
              <!-- <div class="mp-con">
                <div class="mp-bg mp-bg-1">
                  <div class="value">{{ normalFinishedNum }}</div>
                  <div class="title">正常完成数量</div>
                </div>
                <div class="mp-bg mp-bg-2">
                  <div class="value">{{ advanceFinishedNum }}</div>
                  <div class="title">超额完成数量</div>
                </div>
                <div class="mp-bg mp-bg-3">
                  <div class="value">{{ delayFinishedNum }}</div>
                  <div class="title">滞后完成数量</div>
                </div>
              </div> -->
            </template>
          </BlockCard>
        </div>
        <div class="schedule-con">
          <BlockCard :title="'项目进度'">
            <template #content>
              <div class="schedule">
                <div class="schedule-left">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div class="schedule-right">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <el-progress
                  type="circle"
                  :width="120"
                  :stroke-width="10"
                  :percentage="progressCompletedTotal"
                  :show-text="false"
                  :color="scheduleColors"
                ></el-progress>
                <div class="schedule-text">
                  <div class="value">
                    <b>{{ progressCompletedTotal }}%</b>
                  </div>
                  <div class="status">完成进度</div>
                </div>
              </div>
            </template>
          </BlockCard>
        </div>
      </div>
      <div class="tab">切换</div>
      <div class="center">
        <div class="tab">
          <span :class="{ active: !show3d }" @click="changeTab(false)">全景图</span>
          <span :class="{ active: show3d }" @click="changeTab(true)">模型展示</span>
        </div>
        <BlockCard v-if="!show3d" :title="'模型展示'">
          <template #content>
            <!--            <div-->
            <!--              v-loading="!maskImgSrc"-->
            <!--              class="mask"-->
            <!--              element-loading-spinner="el-icon-loading"-->
            <!--              element-loading-background="rgba(255, 255, 255, 0.4)"-->
            <!--            >-->
            <!--              <img :src="maskImgSrc" alt="" />-->
            <!--            </div>-->
            <div class="mask">
              <PhotoBall :img-url="maskImgSrc" />
            </div>
          </template>
        </BlockCard>
        <div class="progress-wrap">
          <div class="finished">
            <span class="icon"></span>
            <span class="label">已完成进度</span>
            <span class="num">{{ progressCompletedTotal }}%</span>
          </div>
          <div class="unfinished">
            <span class="icon"></span>
            <span class="label">未完成进度</span>
            <span class="num">{{ progressTotal }}%</span>
          </div>
          <!--          <p>-->
          <!--            <span>已完成进度</span>-->
          <!--            <span class="num">{{ progressCompletedTotal }} </span>-->
          <!--            %-->
          <!--          </p>-->
          <!--          <p>-->
          <!--            <span>未完成进度</span>-->
          <!--            <span class="num">{{ progressTotal }} </span>-->
          <!--            %-->
          <!--          </p>-->
        </div>
        <div class="bim-model">
          <!-- <BlockCard :title="'模型展示'">
            <template #content>
              <div class="bm-con">
                <BimView
                  ref="bim"
                  :model-id="localStorage.getItem('bimModelId')"
                  :bimBgColor="bimConfig.bimBgColor"
                  @ready="bimShouProgress"
                />
              </div>
            </template>
          </BlockCard> -->
        </div>
      </div>
      <div v-if="$hasPower('BimSynergyQuality') || $hasPower('BimSynergySafety')" class="right">
        <div v-if="$hasPower('BimSynergyQuality')" class="month-quality">
          <BlockCard :title="'本月质量问题'">
            <template #content>
              <MonthQualityChart :option="qualityOption" />
            </template>
          </BlockCard>
        </div>
        <div v-if="$hasPower('BimSynergySafety')" class="month-safety">
          <BlockCard :title="'本月安全问题'">
            <template #content>
              <MonthSafetyChart :option="safetyOption" />
            </template>
          </BlockCard>
        </div>
        <div class="month-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import MonthQualityChart from './monthQualityChart'
import MonthSafetyChart from './monthSafetyChart'
import BlockCard from '../componments/BlockCard'
import Api from './api/index'
// import Video from '../componments/Video'
import bimConfig from '../bimConfig' // bim模型配置
import PhotoBall from './components/photoBall'
export default {
  components: { MonthQualityChart, MonthSafetyChart, BlockCard, PhotoBall },
  data() {
    return {
      sceneUnitList: [],
      scheduleColors: [
        { color: '#00E4FF', percentage: 20 },
        { color: '#00E4FF', percentage: 100 }
      ],
      projectInfo: this.$store.state.project.projectDetail,
      videoList: [],
      timer: null,
      qualityOption: {},
      safetyOption: {},
      actualFinishedPercent: 0,
      advanceFinishedNum: 0,
      advanceFinishedNumPercentage: 0,
      delayFinishedNum: 0,
      delayFinishedNumPercentage: 0,
      normalFinishedNum: 0,
      normalFinishedNumPercentage: 0,
      progressTotal: 0,
      progressCompletedTotal: 0,
      progressCompleted: [],
      unProgressCompleted: [],
      scheduleStatus: '进行中',
      scheduleStatusWidth: 0,
      progressTabInterval: null,
      progressIndex: 0,
      progressTabList: ['正常完成', '超额完成', '滞后完成'],
      bimConfig,
      show3d: false,
      maskImgSrc: ''
    }
  },
  computed: {
    bimReady() {
      return this.$parent.bimReady
    }
  },
  mounted() {
    this.formatBim()
    this.init()
    this.getSceneUnitList()
    // this.getMonitorVideoList()
    // this.timer = setInterval(() => {
    //   this.touch()
    // }, 10000)
    this.getInspectProblemQueryBar()
    this.getScheduleTask()
    this.bimShouProgress()
    this.getProjectDetail()
  },
  beforeDestroy() {
    // this.clearTouch()
    this.destroyVideoList()
    // this.clearAutoProgressTab()
    this.formatBim()
  },
  methods: {
    // 处理bim是否显示
    formatBim() {
      this.$parent.bimConHeight = bimConfig.bimConHeight
      if (!this.$hasPower('BimSynergyQuality') && !this.$hasPower('BimSynergySafety')) {
        this.$parent.disableRight = !this.$parent.disableRight
      }
    },
    // 初始化
    init() {
      // this.autoProgressTab()
      // this.onresize()
    },
    //获取项目详情
    async getProjectDetail() {
      this.maskImgSrc = localStorage.getItem('projectImgUrl')
    },
    // 自动切换本月完成进度
    autoProgressTab() {
      this.progressTabInterval = setInterval(() => {
        if (this.progressIndex < 2) {
          this.progressIndex++
        } else {
          this.progressIndex = 0
        }
      }, 2000)
    },
    // 销毁自动切换本月完成进度
    clearAutoProgressTab() {
      clearInterval(this.progressTabInterval)
    },
    // 监听窗口改变
    onresize() {
      this.$nextTick(() => {
        if (this.$parent.onresize) {
          this.$parent.onresize()
        }
      })
    },
    // 现场参建单位列表
    getSceneUnitList() {
      let participantDTOList = this.projectInfo.participantDTOList || []
      for (let i = 0; i < participantDTOList.length; i++) {
        for (let j = 0; j < participantDTOList[i].participateCompanyName.length; j++) {
          this.sceneUnitList.push({
            companyName: participantDTOList[i].participateCompanyName[j],
            unitName: participantDTOList[i].typeName
          })
        }
      }
    },
    // 视频设备列表
    getMonitorVideoList() {
      Api.getMonitorVideoList({ projectId: this.projectInfo.id }).then(res => {
        // console.log(res.data.records)
        let videoList = res.data.records || []
        let list = []
        videoList.forEach((e, i) => {
          e.videoUrl = ''
          if (i === 0) {
            list.push(e)
          }
        })
        this.videoList = list
        if (list.length) {
          this.$nextTick(() => {
            list.forEach((item, index) => {
              this.getVideoUrlAndPlayVideo(item)
            })
          })
        }
      })
    },
    // 调用start，返回播放地址，并进行播放
    getVideoUrlAndPlayVideo(item) {
      Api.getVideoUrl({
        factoryNum: item.factoryNum,
        deviceNum: item.deviceNum,
        projectId: this.projectInfo.id
      }).then(res => {
        item.videoUrl = res.data?.WS_FLV
        console.log(111, this.videoList, item, res)
      })
    },
    // 视频试试直播
    touch() {
      this.videoList.forEach(e => {
        if (e.videoUrl) {
          Api.touch({ factoryNum: e.factoryNum, deviceNum: e.deviceNum, projectId: this.projectInfo.id })
        }
      })
    },
    clearTouch() {
      clearInterval(this.timer)
      this.timer = null
    },
    // 本月问题统计(质量与安全)
    getInspectProblemQueryBar() {
      Api.getInspectProblemQueryBar({}).then(res => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].inspectType === 1) {
            this.qualityOption = res.data[i]
          } else if (res.data[i].inspectType === 2) {
            this.safetyOption = res.data[i]
          }
        }
      })
    },
    // 本月进度统计
    getScheduleTask() {
      Api.getScheduleTask().then(res => {
        // console.log(res)
        let datas = res.data
        if (datas) {
          this.actualFinishedPercent = datas.actualFinishedPercent
          this.advanceFinishedNum = datas.advanceFinishedNum
          this.delayFinishedNum = datas.delayFinishedNum
          this.normalFinishedNum = datas.normalFinishedNum
          if (datas.totalNum) {
            this.normalFinishedNumPercentage = parseInt(((datas.normalFinishedNum / datas.totalNum) * 100).toFixed(0))
            this.advanceFinishedNumPercentage = parseInt(((datas.advanceFinishedNum / datas.totalNum) * 100).toFixed(0))
            this.delayFinishedNumPercentage = parseInt(((datas.delayFinishedNum / datas.totalNum) * 100).toFixed(0))
          }

          /*this.$nextTick(() => {
              let bar = document.getElementById('progress-bar')
              let value = parseFloat(parseFloat(this.actualFinishedPercent / 100).toFixed(2))
              if (value === 1) {
                this.scheduleStatus = '已完成'
              }
              this.actualFinishedPercent = value * 100
              bar.style.width = value * 186 + 'px'
            })*/
        }
      })
    },
    // 底部播放列表销毁
    destroyVideoList() {
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.$refs[this.videoList[i].id]) {
          this.$refs[this.videoList[i].id][0].destroy()
        }
      }
    },
    async bimShouProgress() {
      let params = {
        cycleType: 3,
        modelId: localStorage.getItem('bimModelId')
      }
      let result = await Api.getModelProgress(params)
      let datas = result.data
      let total = 0
      let completedTotal = 0
      if (!datas || datas.length === 0) {
        this.progressTotal = 0
        this.progressCompletedTotal = 0
        return
      }
      datas.map(e => {
        let componentIdList = e.componentIdList || []
        total += componentIdList.length
        if (e.groupNum === 0) {
          this.progressCompleted = componentIdList
          completedTotal = e.actualFinishedPercent || 0
        }
      })
      // this.unProgressCompleted = bimElementData.map(b => b.id).filter(e => !this.progressCompleted.includes(e))
      this.progressTotal = (100 - completedTotal).toFixed(2)
      this.progressCompletedTotal = completedTotal
      if (this.progressCompletedTotal === 100) {
        this.scheduleStatus = '已完成'
      }
      return
      this.scheduleStatusWidth = (this.progressCompletedTotal / 100) * 186
      // bimApp.clearElementsColor()
      // bimApp.setElementsColor(this.progressCompleted, [255, 187, 41])
      bimApp.setElementsColor(this.unProgressCompleted, [153, 153, 153])
    },
    changeTab(isShow3d) {
      this.show3d = isShow3d
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./main');
</style>

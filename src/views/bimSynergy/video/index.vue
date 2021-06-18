<template>
  <div class="content">
    <div class="video">
      <div class="right">
        <div class="monitorView">
          <BlockCard :title="'监控视图'">
            <template #content>
              <div class="model-con">
                <div class="model-item">
                  <div v-if="modelView === 1" class="v-model vm-1-1"></div>
                  <div v-else class="v-model vm-1-0" @click="handleModelView(1)"></div>
                  <div class="text" :class="{ active: modelView === 1 }">1视图</div>
                </div>
                <div class="model-item">
                  <div v-if="modelView === 2" class="v-model vm-2-1"></div>
                  <div v-else class="v-model vm-2-0" @click="handleModelView(2)"></div>
                  <div class="text" :class="{ active: modelView === 2 }">2视图</div>
                </div>
                <div class="model-item">
                  <div v-if="modelView === 3" class="v-model vm-3-1"></div>
                  <div v-else class="v-model vm-3-0" @click="handleModelView(3)"></div>
                  <div class="text" :class="{ active: modelView === 3 }">3视图</div>
                </div>
                <div class="model-item">
                  <div v-if="modelView === 4" class="v-model vm-4-1"></div>
                  <div v-else class="v-model vm-4-0" @click="handleModelView(4)"></div>
                  <div class="text" :class="{ active: modelView === 4 }">4视图</div>
                </div>
              </div>
            </template>
          </BlockCard>
        </div>
        <div class="monitorFacility">
          <BlockCard :title="'监控设备'">
            <template #content>
              <div class="mf-form">
                <div class="form-item line">
                  <input class="inp-keyword" placeholder="搜索..." @input="handleChangeInput" />
                  <div class="inp-search" @click="handleClickSearch"></div>
                </div>
                <!--                <div class="form-item status-con">-->
                <!--                  <div>-->
                <!--                    <div v-if="status === 1" class="status-btn line-1">全部</div>-->
                <!--                    <div v-else class="status-btn line-0" @click="handleStatus(1)">全部</div>-->
                <!--                  </div>-->
                <!--                  <div>-->
                <!--                    <div v-if="status === 2" class="status-btn line-1">在线</div>-->
                <!--                    <div v-else class="status-btn line-0" @click="handleStatus(2)">在线</div>-->
                <!--                  </div>-->
                <!--                  <div>-->
                <!--                    <div v-if="status === 3" class="status-btn line-1">离线</div>-->
                <!--                    <div v-else class="status-btn line-0" @click="handleStatus(3)">离线</div>-->
                <!--                  </div>-->
                <!--                </div>-->
                <div class="group-title">
                  <!--                  <div class="bar">-->
                  <!--                    <div class="text">所属区域：</div>-->
                  <!--                  </div>-->
                  <!--                  <div class="icon"></div>-->
                  <div class="group-select">
                    <el-select v-model="area" style="width: 100%" size="mini" clearable @change="handleChangeArea">
                      <el-option label="全部" :value="null"></el-option>
                      <el-option
                        v-for="(item, index) in areaList"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div v-if="videoList.length" class="group-con">
                <div v-for="(item, index) in videoList" :key="index" @click="handleClickItem(item)">
                  <div class="group-item">
                    <div
                      class="vm-video"
                      :style="{
                        background: `url(${item.ablumUrl}) black no-repeat`,
                        backgroundSize: 'contain'
                      }"
                    >
                      <!--<Video :ref="item.id" :url="item.videoUrl" :autoplay="false" />-->
                      <div></div>
                      <div class="vm-bg"></div>
                      <div class="bottom">
                        <div class="text">{{ item.deviceName }}</div>
                        <div class="icon"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="group-con group-con-null">暂无数据</div>
            </template>
          </BlockCard>
        </div>
      </div>
      <div class="center">
        <div class="videoMonitor">
          <BlockCard :title="'视频监控'">
            <template #content>
              <div v-if="modelView === 1" key="model-1" class="vm-con">
                <div v-if="video1" class="vm-con1-wrap">
                  <div class="camera-name">{{ video1.deviceName }}-摄像头</div>
                  <Video
                    :ref="video1.id + '-model-1'"
                    :url="video1.videoUrl"
                    :width="'100%'"
                    :height="'calc(100% - 58px)'"
                  />
                  <!--                  <div class="play-back"><span>视频回放</span></div>-->
                </div>
                <div v-else class="vm-con-null">加载中...</div>
              </div>
              <div v-if="modelView === 2" key="model-2" class="vm-con">
                <div v-if="video2.length" class="vm-con2-wrap">
                  <div v-for="(item, index) in video2" :key="index" class="vm-item">
                    <div class="vm-item-wrap">
                      <div class="camera-name">{{ item.deviceName }}-摄像头</div>
                      <Video :ref="item.id + '-model-2'" :url="item.videoUrl" :height="'calc(100% - 58px)'" />
                      <div class="play-back"><span>视频回放</span></div>
                    </div>
                  </div>
                </div>
                <div v-else class="vm-con-null">加载中...</div>
              </div>
              <div v-if="modelView === 3" key="model-3" class="vm-con">
                <div v-if="video3.length" class="vm-con3-wrap">
                  <div v-for="(item, index) in video3" :key="index" :class="`vm-item vm-item-${index}`">
                    <div :class="`vm-item-wrap-${index}`">
                      <div class="camera-name">{{ item.deviceName }}-摄像头</div>
                      <Video :ref="item.id + '-model-3'" :url="item.videoUrl" :height="'calc(100% - 58px)'" />
                      <div class="play-back"><span>视频回放</span></div>
                    </div>
                  </div>
                </div>
                <div v-else class="vm-con-null">加载中...</div>
              </div>
              <div v-if="modelView === 4" key="model-4" class="vm-con">
                <div v-if="video4.length" class="vm-con4-wrap">
                  <div v-for="(item, index) in video4" :key="index" class="vm-item">
                    <div class="camera-name">{{ item.deviceName }}-摄像头</div>
                    <Video :ref="item.id + '-model-4'" :url="item.videoUrl" :height="'calc(100% - 58px)'" />
                    <div class="play-back"><span>视频回放</span></div>
                  </div>
                </div>
                <div v-else class="vm-con-null">加载中...</div>
              </div>
            </template>
          </BlockCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlockCard from '../componments/BlockCard'
import Video from '../componments/Video'
import Api from '../main/api/index'
import { getAreaList, getVideoAlbum } from '@/views/construction/equipment-monitoring/api/work-bench'
import { iotUrl } from '@/utils/axios'
import qs from 'qs'
export default {
  components: { BlockCard, Video },
  data() {
    return {
      modelView: 1, // 视频宫格模式
      status: 1, // 视频状态
      videoList: [], // 视频列表
      area: '', // 视频所属区域
      keyword: '',
      video1: null, // 一个视频对象
      video2: [], // 两个视频数组
      video3: [], // 三个视频数组
      video4: [], // 四个视频数组
      timer: null,
      areaList: []
    }
  },
  mounted() {
    this.formatBim()
    this.init()
    this.getMonitorVideoList()
  },
  beforeDestroy() {
    this.formatBim()
    this.clearTouch()
    this.destroyVideo1()
    this.destroyVideo2()
    this.destroyVideo3()
    this.destroyVideo4()
    this.destroyVideoList()
  },
  methods: {
    // 处理bim是否显示
    formatBim() {
      this.$parent.disableBim = !this.$parent.disableBim
    },
    init() {
      // this.onresize()
      getAreaList({ page: 1, rows: 10000 }).then(res => {
        this.areaList = res.data.records.map(item => ({ label: item.name, value: item.id }))
      })
    },
    // 监听窗口改变
    onresize() {
      this.$nextTick(() => {
        if (this.$parent.onresize) {
          this.$parent.onresize()
        }
      })
    },
    // 视频模式选择
    handleModelView: _.debounce(async function (type) {
      this.modelView = type
      this.clearTouch()
      this.destroyVideo1()
      this.destroyVideo2()
      this.destroyVideo3()
      this.destroyVideo4()
      if (type === 1) {
        if (this.video1) {
          this.createTimer([this.video1])
        } else {
          let video1 = this.videoList[0]
          await this.getVideoUrlAndPlayVideo(video1)
          this.video1 = video1
          this.createTimer([video1])
        }
      } else if (type === 2) {
        if (this.video2.length) {
          this.createTimer(this.video2)
        } else {
          let video2 = this.videoList.slice(0, 2)
          for (let i = 0; i < video2.length; i++) {
            await this.getVideoUrlAndPlayVideo(video2[i])
          }
          this.video2 = video2
          this.createTimer(video2)
        }
      } else if (type === 3) {
        if (this.video3.length) {
          this.createTimer(this.video3)
        } else {
          let video3 = this.videoList.slice(0, 3)
          for (let i = 0; i < video3.length; i++) {
            await this.getVideoUrlAndPlayVideo(video3[i])
          }
          this.video3 = video3
          this.createTimer(video3)
        }
      } else if (type === 4) {
        if (this.video4.length) {
          this.createTimer(this.video4)
        } else {
          let video4 = this.videoList.slice(0, 4)
          for (let i = 0; i < video4.length; i++) {
            await this.getVideoUrlAndPlayVideo(video4[i])
          }
          this.video4 = video4
          this.createTimer(video4)
        }
      }
    }, 100),
    // 输入框改变事件
    handleChangeInput(e) {
      this.keyword = e.target.value
    },
    // 视频设备状态
    handleStatus(type) {
      this.status = type
      this.getMonitorVideoList()
    },
    // 视频设备列表
    async getMonitorVideoList() {
      this.clearTouch()
      this.destroyVideo1()
      this.destroyVideo2()
      this.destroyVideo3()
      this.destroyVideo4()
      this.video1 = null
      this.video2 = []
      this.video3 = []
      this.video4 = []
      this.destroyVideoList()

      let params = {
        projectId: localStorage.getItem('projectId'),
        monitorAreaId: this.area ? this.area : null,
        keyword: this.keyword,
        status: 'monitorStatus_1',
        page: 1,
        rows: 1000
      }
      // if (this.status === 1) {
      //   delete params.status
      // } else if (this.status === 2) {
      //   params.status = 'monitorStatus_1,monitorStatus_2'
      // } else if (this.status === 3) {
      //   params.status = 'monitorStatus_4'
      // }
      let res = await Api.getMonitorVideoList(params)
      let videoList = res.data.records || []
      videoList.forEach(e => {
        e.videoUrl = ''
      })
      // videoList.splice(5)
      this.videoList = videoList
      console.log(videoList)
      this.videoList.forEach(item => {
        item.ablumUrl =
          iotUrl +
          `/noToken/monitorVideo/channelsnap?` +
          qs.stringify({
            projectId: this.$store.state.project.projectId,
            deviceNum: item.deviceNum,
            factoryNum: item.factoryNum
          })
      })
      if (videoList.length) {
        if (this.modelView === 1) {
          let video1 = videoList[0]
          await this.getVideoUrlAndPlayVideo(video1)
          this.video1 = video1
          this.createTimer([video1])
        } else if (this.modelView === 2) {
          let video2 = this.videoList.slice(0, 2)
          for (let i = 0; i < video2.length; i++) {
            await this.getVideoUrlAndPlayVideo(video2[i])
          }
          this.video2 = video2
          this.createTimer(video2)
        } else if (this.modelView === 3) {
          let video3 = this.videoList.slice(0, 3)
          for (let i = 0; i < video3.length; i++) {
            await this.getVideoUrlAndPlayVideo(video3[i])
          }
          this.video3 = video3
          this.createTimer(video3)
        } else if (this.modelView === 4) {
          let video4 = this.videoList.slice(0, 4)
          for (let i = 0; i < video4.length; i++) {
            await this.getVideoUrlAndPlayVideo(video4[i])
          }
          this.video4 = video4
          this.createTimer(video4)
        }

        // 右侧播放列表加载
        return false
        this.$nextTick(() => {
          videoList.forEach(async (item, index) => {
            await this.getVideoUrlAndPlayVideo(item)
            setTimeout(() => {
              // 只为处理切换路由时，造成自动播放，而加的暂停。(当前路由刷新时，不会自动播放，但是切换路由时，会自动播放。注：该video组件已设置autoplay="false"，但切换路由时依旧会自动播放)
              if (this.$refs[item.id]) {
                // console.log(this.$refs[item.id][0])
                this.$refs[item.id][0].pause()
              }
            }, 500)
          })
        })
      }
    },
    // 调用start，返回播放地址，并进行播放
    async getVideoUrlAndPlayVideo(item) {
      if (item.channel) {
        let res = await Api.getVideoUrl({
          factoryNum: item.factoryNum,
          deviceNum: item.deviceNum,
          projectId: localStorage.getItem('projectId')
        })
        if (res.data) {
          item.videoUrl = res.data.HLS
        } else {
          /*  item.channel = '1'
          item.deviceNum = '34020000001190000001'
          item.videoUrl = 'ws://bimfish.com:10001/ws_flv/hls/34020000001190000001_0200000001.flv'*/
        }
      } else {
        item.channel = '1'
        item.deviceNum = '34020000001190000001'
        let res = await Api.getVideoUrl({
          factoryNum: item.factoryNum,
          deviceNum: item.deviceNum,
          projectId: localStorage.getItem('projectId')
        })
        item.videoUrl = res.data.HLS
      }
    },
    // 搜索
    handleClickSearch() {
      this.getMonitorVideoList()
    },
    // 视频分组
    handleChangeArea() {
      this.getMonitorVideoList()
    },
    // 视频实时直播
    touch(video) {
      Api.touch({
        factoryNum: video.factoryNum,
        deviceNum: video.deviceNum,
        projectId: localStorage.getItem('projectId')
      })
    },
    clearTouch() {
      clearInterval(this.timer)
      this.timer = null
    },
    // timer生成
    createTimer(videos) {
      this.timer = setInterval(() => {
        for (let i = 0; i < videos.length; i++) {
          this.touch(videos[i])
        }
      }, 10000)
    },
    // 右侧播放列表销毁
    destroyVideoList() {
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.$refs[this.videoList[i].id]) {
          this.$refs[this.videoList[i].id][0].destroy()
        }
      }
    },
    // 销毁视图模式1组件
    destroyVideo1() {
      if (this.video1 && this.$refs[this.video1.id + '-model-1']) {
        this.$refs[this.video1.id + '-model-1'].destroy()
      }
    },
    // 销毁视图模式2组件
    destroyVideo2() {
      for (let i = 0; i < this.video2.length; i++) {
        if (this.$refs[this.video2[i].id + '-model-2'][0]) {
          this.$refs[this.video2[i].id + '-model-2'][0].destroy()
        }
      }
    },
    // 销毁视图模式3组件
    destroyVideo3() {
      for (let i = 0; i < this.video3.length; i++) {
        if (this.$refs[this.video3[i].id + '-model-3'][0]) {
          this.$refs[this.video3[i].id + '-model-3'][0].destroy()
        }
      }
    },
    // 销毁视图模式4组件
    destroyVideo4() {
      for (let i = 0; i < this.video4.length; i++) {
        if (this.$refs[this.video4[i].id + '-model-4'][0]) {
          this.$refs[this.video4[i].id + '-model-4'][0].destroy()
        }
      }
    },
    // 点击右侧小视频，左侧单视频切换
    async handleClickItem(item) {
      // console.log(item)
      this.clearTouch()

      if (this.modelView === 1) {
        this.destroyVideo1()
        this.video1 = null
        let video1 = _.cloneDeep(item)
        await this.getVideoUrlAndPlayVideo(video1)
        this.video1 = video1
        this.createTimer([video1])
      } else if (this.modelView === 2) {
        let newVideo2 = _.cloneDeep(this.video2)
        this.destroyVideo2()
        this.video2 = []
        newVideo2.splice(1, 1) // 删除最后一个视频
        newVideo2.splice(0, 0, _.cloneDeep(item)) // 第一个位置添加新视频
        for (let i = 0; i < newVideo2.length; i++) {
          await this.getVideoUrlAndPlayVideo(newVideo2[i])
        }
        this.video2 = newVideo2
        this.createTimer(newVideo2)
      } else if (this.modelView === 3) {
        let newVideo3 = _.cloneDeep(this.video3)
        this.destroyVideo3()
        this.video3 = []
        newVideo3.splice(2, 1) // 删除最后一个视频
        newVideo3.splice(0, 0, _.cloneDeep(item)) // 第一个位置添加新视频
        for (let i = 0; i < newVideo3.length; i++) {
          await this.getVideoUrlAndPlayVideo(newVideo3[i])
        }
        this.video3 = newVideo3
        this.createTimer(newVideo3)
      } else if (this.modelView === 4) {
        let newVideo4 = _.cloneDeep(this.video4)
        this.destroyVideo4()
        this.video4 = []
        newVideo4.splice(3, 1) // 删除最后一个视频
        newVideo4.splice(0, 0, _.cloneDeep(item)) // 第一个位置添加新视频
        for (let i = 0; i < newVideo4.length; i++) {
          await this.getVideoUrlAndPlayVideo(newVideo4[i])
        }
        this.video4 = newVideo4
        this.createTimer(newVideo4)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./video');
</style>

<template>
  <div class="bim-synergy-con">
    <div class="layout-main">
      <Navbar></Navbar>
      <div class="bm-main">
        <div v-show="!disableLeft" class="left" :style="leftWidth ? `width: ${leftWidth}px` : ''">111</div>
        <div
          class="center"
          :style="
            disableRight
              ? `margin-right: 20px;`
              : '' || disableLeft
              ? `margin-left: 20px;`
              : '' || isIot
              ? 'top: 45px;'
              : ''
          "
        >
          <div
            v-show="!disableBim"
            class="bm-con-model"
            :style="bimConHeight ? `height: calc(100vh - ${bimConHeight}px)` : ''"
          >
            <BlockCard :title="'模型展示'">
              <template #content>
                <BimView
                  ref="bim"
                  :model-id="localStorage.getItem('bimModelId')"
                  :bimBgColor="bimConfig.bimBgColor"
                  @ready="bimReady = true"
                />
              </template>
            </BlockCard>
          </div>
        </div>
        <div v-show="!disableRight" class="right" :style="leftWidth ? `width: ${rightWidth}px` : ''"></div>
      </div>
      <div class="content-wrap">
        <div class="main-line">
          <div class="left-line">
            <div class="line-con">
              <span v-for="(item, i) in 16" :key="i"></span>
            </div>
          </div>
          <div class="left-bottom-line"></div>
          <div class="main-bottom-line"></div>
        </div>
        <router-view :key="key" :disableBim.sync="disableBim"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './componments/Navbar'
import BlockCard from './componments/BlockCard'
import bimConfig from './bimConfig' // bim模型配置
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { Navbar, BlockCard },
  data() {
    // 这里存放数据
    return {
      bimConfig,
      disableLeft: false, // 是否禁用左侧导航
      leftWidth: bimConfig.leftWidth, // 左侧边栏宽度
      rightWidth: bimConfig.rightWidth, // 右侧边栏宽度
      disableRight: false, // 是否禁用右侧导航
      disableBim: false, // 是否禁用Bim模型
      bimConHeight: bimConfig.bimConHeight, // 动态模型高度
      bimReady: false
    }
  },
  computed: {
    key() {
      let pathRoute = this.$route.path
      return pathRoute
    },
    // 当前路由是否是智能物联网
    isIot() {
      let name = this.$route.name === 'BimSynergyInternet'
      return name
    }
  },
  watch: {
    isIot(val) {
      if (val) {
        this.bimConHeight = bimConfig.bimConHeight + 25
      } else {
        this.bimConHeight = bimConfig.bimConHeight
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    init() {
      // this.onresize()
    },
    // 监听窗口改变
    onresize() {
      document.getElementsByClassName('layout-main')[0].style.transform = ''
      this.$nextTick(() => {
        let clientWidth = document.documentElement.clientWidth
        let clientHeight = document.documentElement.clientHeight
        window.onresize = () => {
          // 定义窗口大小变更通知事件
          clientWidth = document.documentElement.clientWidth //窗口宽度
          clientHeight = document.documentElement.clientHeight //窗口高度
          this.changeLayoutMain(clientWidth, clientHeight)
        }
        this.changeLayoutMain(clientWidth, clientHeight)
      })
    },
    // 自动缩放
    changeLayoutMain(clientWidth, clientHeight) {
      const defaultWidth = 1920
      let layoutMain = document.getElementsByClassName('layout-main')
      let mainHeight = layoutMain[0].clientHeight
      let proportion = clientWidth / defaultWidth
      if (clientHeight < mainHeight) {
        proportion = clientHeight / mainHeight
      }
      if (clientWidth < defaultWidth || clientHeight < mainHeight) {
        layoutMain[0].style.transform = `scale(${proportion})`
      } else {
        layoutMain[0].style.transform = ''
      }
    }
  }
}
</script>

<style lang="less" scope>
@import url('./index.less');
</style>

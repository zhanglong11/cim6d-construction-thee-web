<template>
  <div class="nav-main">
    <div class="nav-top-line"></div>
    <div class="logo"></div>
    <div class="nav-menu">
      <ul>
        <template v-for="(item, i) in routes">
          <li
            v-if="!item.hidden && $hasPower(item.name)"
            :key="i"
            :class="{ active: `${item.name}` === activeMenu, 'home-menu': i === 0 }"
          >
            <router-link :to="`${item.path}`" class="title">
              {{ item.meta.title }}
              <p class="sub-title">{{ item.meta.subTitle }}</p>
            </router-link>
          </li>
        </template>
        <!-- <li>
          <router-link to="" class="title" @click.native="goBack()"> 后台管理 </router-link>
        </li> -->
      </ul>
    </div>
    <div class="nav-right">
      <div class="time">
        <div class="hms">{{ hms }}</div>
        <div class="ymd">{{ ymd }}</div>
      </div>
      <div class="line"></div>
      <div class="weather">
        <!-- <div v-if="weatherInfo.weatherPic">
          <span class="icon" :class="weatherInfo.weatherPic.split(',')[0]"></span>
        </div> -->
        <div v-if="weatherInfo.weather" class="icon-text">{{ weatherInfo.weather }}</div>
        <img src="../newImages/temperature.png" class="temperature-icon" />
        <div v-if="weatherInfo.temperature" class="temperature">{{ weatherInfo.temperature }}°C</div>
      </div>
      <div class="line"></div>
      <router-link to="" class="go-back" @click.native="goBack()">后台管理</router-link>
    </div>
  </div>
</template>

<script>
import Api from '../api/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      activeMenu: '',
      timer: null,
      hms: '',
      ymd: '',
      weatherInfo: {}
    }
  },
  // 监听属性 类似于data概念
  computed: {
    routes() {
      let list = this.$router.options.routes
      return _.find(list, { name: 'BimSynergy' }).children
    },
    projectLongitude() {
      return this.$store.state.project.longitude
    },
    projectLatitude() {
      return this.$store.state.project.latitude
    },
    projectId() {
      return this.$store.state.project.projectId
    },
    power() {
      return this.$store.state.userPower.power
    }
  },
  watch: {
    $route() {
      this.initRoute()
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.initRoute()
    this.hms = moment().format('LTS')
    this.ymd = moment().format('YYYY[-]MM[-]DD')
    this.countDown()
    this.getWeatherInfo()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  // 方法集合
  methods: {
    // 初始化路由
    initRoute() {
      this.activeMenu = this.$route.meta && this.$route.meta.activeMenu ? this.$route.meta.activeMenu : this.$route.name
      // console.log(111, this.routes, this.$route, this.activeMenu)
    },
    // 倒计时
    countDown() {
      this.timer = setInterval(() => {
        this.hms = moment().format('LTS')
        this.ymd = moment().format('YYYY[-]MM[-]DD')
      }, 1000)
    },
    // 获取天气信息
    getWeatherInfo() {
      // 固定的项目信息参数
      let params = {
        lng: this.projectLongitude,
        lat: this.projectLatitude,
        projectId: this.projectId
      }
      Api.getWeatherInfo(params).then(res => {
        this.weatherInfo = res.data
      })
    },
    // 返回
    goBack() {
      const lastLeaveUrl = sessionStorage.getItem('lastLeaveUrl')
      if (lastLeaveUrl) {
        sessionStorage.setItem('lastLeaveUrl', this.$route.fullPath)
        this.$router.push(lastLeaveUrl)
      } else {
        this.$router.push({
          name: this.power[0]
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@lineColor: #98b9db;
.nav-main {
  height: 125px;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2;
  background: url('../newImages/top-right.png') right 20px center no-repeat;
  background-size: 396px 57px;
  .nav-top-line {
    margin-left: 46px;
    width: 33px;
    height: 60px;
    position: relative;
    &:before,
    &:after {
      content: '';
      width: 2px;
      height: 30px;
      background: @lineColor;
      position: absolute;
      left: 0;
    }
    &:before {
      bottom: 0;
    }
    &:after {
      transform: rotate(45deg);
      left: 14px;
      top: -4px;
      height: 40px;
    }
  }
  .logo {
    margin: 0 40px 0 14px;
    width: 125px;
    height: 65px;
    background: url('../newImages/logo.png') no-repeat;
    background-size: contain;
  }
  .nav-menu {
    margin-left: 20px;
    ul {
      display: flex;
      align-items: center;
      height: 48px;
      margin-top: 4px;
      li {
        width: 198px;
        height: 48px;
        position: relative;
        background: url('../newImages/menu.png') no-repeat;
        background-size: 100% 100%;
        margin-left: -35px;
        transition: all 0.3s;
        text-align: center;
        .title {
          color: rgba(255, 255, 255, 0.5);
          margin-left: -25px;
          height: 100%;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          font-size: 16px;
          .sub-title {
            margin: 2px 0 0;
            font-size: 9px;
            transform: scale(0.8);
          }
        }
        &:hover,
        &.active {
          background-image: url('../newImages/menu-hover.png');
          .title {
            color: #fff;
          }
        }
        &.active {
          background-image: url('../newImages/menu-active.png');
        }
        &.home-menu {
          width: 115px;
          background-image: url('../newImages/menu-home.png');
          &:hover {
            background-image: url('../newImages/menu-home-hover.png');
          }
          &.active {
            background-image: url('../newImages/menu-home-active.png');
          }
        }
      }
    }
  }
  .nav-right {
    position: absolute;
    right: 0px;
    display: flex;
    height: 44px;
    align-items: center;
    color: #ffffff;
    font-size: 14px;
    margin-top: -20px;
    justify-content: flex-end;
    margin-right: 20px;
    .weather {
      display: flex;
      align-items: center;
      color: #b9b9b9;
      font-size: 16px;
      .icon {
        margin-right: 10px;
      }
      .icon-text {
        margin-right: 10px;
      }
      .temperature-icon {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      .temperature {
        /*font-weight: 600;*/
        margin-right: 2px;
      }
    }
    .line {
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0px 10px;
    }
    .time {
      font-size: 12px;
      .hms,
      .ymd {
        color: #b9b9b9;
      }
      .hms {
        color: #fff;
        text-align: right;
        font-size: 18px;
      }
    }
    .go-back {
      display: inline-flex;
      align-items: center;
      color: #fff;
      font-size: 14px;
      &:before {
        content: '';
        background: url('../newImages/go-back.png') no-repeat;
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        margin-right: 6px;
        transition: all 0.3s;
      }
      &:hover {
        color: #2366ff;
        &:before {
          background-image: url('../newImages/go-back-hover.png');
        }
      }
    }
  }
}
</style>

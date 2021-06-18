<template>
  <div class="wrap">
    <div class="left">
      <div class="current-wrap">
        <span class="icon"></span>
        <span class="num">{{ info.currentAmount }}</span>
        <span class="unit">当前功率KW/h</span>
        <div class="mask" />
      </div>
      <ul class="list">
        <li class="item" :class="{ active: activeType === 'day' }" @click="changeTab('day')">
          <span class="top"></span>
          <p class="label">本日用电量</p>
          <p class="val">{{ info.dayAmount }} KW/h</p>
          <span class="bottom"></span>
        </li>
        <li class="item" :class="{ active: activeType === 'month' }" @click="changeTab('month')">
          <span class="top"></span>
          <p class="label">本月用电量</p>
          <p class="val">{{ info.monthAmount }} KW/h</p>
          <span class="bottom"></span>
        </li>
        <li class="item" :class="{ active: activeType === 'year' }" @click="changeTab('year')">
          <span class="top"></span>
          <p class="label">本年用电量</p>
          <p class="val">{{ info.yearAmount }} KW/h</p>
          <span class="bottom"></span>
        </li>
      </ul>
    </div>
    <div class="right">
      <div class="title">
        <p>用电趋势</p>
        <div>
          <span :class="{ active: activeType === 'day' }" @click="changeTab('day')">本日</span>
          <span :class="{ active: activeType === 'month' }" @click="changeTab('month')">本月</span>
          <span :class="{ active: activeType === 'year' }" @click="changeTab('year')">本年</span>
        </div>
      </div>
      <div class="chart">
        <WaterElevatorChart :type="activeType" :chart-data="chartData"></WaterElevatorChart>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../api'
import WaterElevatorChart from '@/views/bimSynergy/internet/components/WaterElevatorChart'
export default {
  name: 'DialogWater',
  // import引入的组件
  components: {
    WaterElevatorChart
  },
  props: {
    id: {}
  },
  data() {
    // 这里存放数据
    return {
      activeType: 'day',
      chartData: {},
      info: {}
    }
  },
  watch: {
    id(v) {
      if (v) this.refresh()
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (!this.id) return
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.getDetail(this.id)
      this.getChartData()
    },
    async getDetail(id) {
      let res = await Api.eleDetail(id)
      this.info = res.data
    },
    changeTab(type) {
      this.activeType = type
      this.getChartData()
    },
    async getChartData() {
      let timeSpan = this.activeType === 'day' ? 1 : this.activeType === 'month' ? 2 : 3
      let res = await Api.eleList({ deviceId: this.id, timeSpan })
      let cloneData = _.cloneDeep(res.data)
      let time = cloneData.map(r => (timeSpan === 2 ? `${r.time}日` : timeSpan === 3 ? `${r.time}月` : r.time))
      let data = cloneData.map(r => r.values)
      this.chartData = {
        time,
        data
      }
      // this.chartData = [820, 932, 901, 934, 1290, 1330, 1320]
    }
  }
}
</script>

<style scoped lang="less">
@themeColor: #ffd46d;
.wrap {
  display: flex;
  .left {
    flex: 0 0 300px;
    padding: 0 30px;
    border-right: 1px solid rgba(35, 102, 254, 0.6);
    .current-wrap {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      width: 180px;
      height: 180px;
      margin: 0 auto;
      padding: 40px 0;
      .mask {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url('../../newImages/internet/waterElectric/ele-cur.png') no-repeat center;
        background-size: contain;
        animation: maskRotate 8s linear infinite;
        @keyframes maskRotate {
          0% {
            transform: rotateZ(0);
          }
          50% {
            transform: rotateZ(180deg);
          }
          100% {
            transform: rotateZ(360deg);
          }
        }
      }

      color: @themeColor;
      .icon {
        width: 20px;
        height: 20px;
        background: url('../../newImages/internet/waterElectric/ele-icon.png') no-repeat center;
        background-size: contain;
      }
      .num {
        font-size: 30px;
      }
      .unit {
        font-size: 12px;
        color: #fff;
      }
    }
    > ul {
      margin: 20px 0;
      > li {
        position: relative;
        margin: 10px;
        padding: 12px;
        border: 1px solid rgba(0, 228, 255, 0.2);
        cursor: pointer;
        &.active {
          box-shadow: 0 0 30px 0 rgb(11, 116, 229) inset;
          border: 1px solid transparent;
        }
        > span {
          &.top {
            &:before,
            &:after {
              position: absolute;
              top: 0;
              content: '';
              width: 3px;
              height: 3px;
              background: #76e1fc;
            }
            &:before {
              left: 0;
            }
            &:after {
              right: 0;
            }
          }
          &.bottom {
            &:before,
            &:after {
              position: absolute;
              bottom: 0;
              content: '';
              width: 3px;
              height: 3px;
              background: #76e1fc;
            }
            &:before {
              left: 0;
            }
            &:after {
              right: 0;
            }
          }
        }
        > p {
          text-align: center;
          &.val {
            color: @themeColor;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    padding-left: 30px;
    .title {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      padding: 20px;
      > p {
        padding-top: 6px;
      }
      > div {
        > span {
          display: inline-block;
          padding: 6px 30px;
          margin: 0 5px;
          cursor: pointer;
          &.active {
            background: url('../../newImages/internet/waterElectric/tag-bg.png') no-repeat center;
            background-size: contain;
          }
        }
      }
    }
    .chart {
      width: 100%;
      height: 350px;
      padding-top: 20px;
    }
  }
}
</style>

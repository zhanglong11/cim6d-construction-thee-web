<template>
  <div class="container">
    <div class="green-construction">
      <div class="left">
        <div class="green-con">
          <div class="green-left-top">
            <BlockCard title="本月">
              <template #content>
                <div class="recent-list">
                  <ul class="target-list target-list1">
                    <li>AQI</li>
                    <li>{{ aqiData[2].average }}</li>
                    <li>{{ aqiData[2].avgLevelName }}</li>
                  </ul>
                  <ul class="list">
                    <li v-for="(item, index) in typeList" :key="'list' + index">
                      <span :class="'color' + (index + 1)">{{ item.label }}</span>
                      <span> {{ aqiData[2][item.key] }}</span>
                    </li>
                  </ul>
                </div>
              </template>
            </BlockCard>
          </div>
          <div class="green-left-bottom">
            <BlockCard title="本季">
              <template #content>
                <div class="recent-list">
                  <ul class="target-list target-list2">
                    <li>AQI</li>
                    <li>{{ aqiData[3].average }}</li>
                    <li>{{ aqiData[3].avgLevelName }}</li>
                  </ul>
                  <ul class="list">
                    <li v-for="(item, index) in typeList" :key="'list' + index">
                      <span :class="'color' + (index + 1)">{{ item.label }}</span>
                      <span> {{ aqiData[3][item.key] }}</span>
                    </li>
                  </ul>
                </div>
              </template>
            </BlockCard>
          </div>
        </div>
      </div>
      <div class="center">
        <div class="green-con">
          <div class="green-center-top">
            <BlockCard title="实时环境监测">
              <template #content>
                <div class="tabs">
                  <div
                    v-for="(item, i) in tabList"
                    :key="i"
                    class="tab"
                    :class="{ active: tabIndex === i }"
                    @click="changeTab(item, i)"
                  >
                    {{ item.name }}
                  </div>
                </div>
                <div class="fill-con">
                  <div class="fill">
                    <div class="file-small">
                      <ul>
                        <li>
                          <div class="box">
                            <p>PM10</p>
                            <p>{{ currentInfo.pm10 }}</p>
                          </div>
                        </li>
                        <li>
                          <div class="box">
                            <p>噪音</p>
                            <p>{{ currentInfo.noise }}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="file-big">
                      <ul>
                        <li>
                          <div class="box">
                            <p>PM2.5</p>
                            <p>{{ currentInfo.pm25 }}</p>
                          </div>
                        </li>
                        <li>
                          <div class="box">
                            <p>风速</p>
                            <p>{{ currentInfo.windSpeed }}m/s</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <!-- <div class="fill-left">
                      <ul>
                        <li>
                          <p>PM2.5</p>
                          <p>{{ currentInfo.pm25 }}</p>
                        </li>
                        <li>
                          <p>PM10</p>
                          <p>{{ currentInfo.pm10 }}</p>
                        </li>
                        <li>
                          <p>风速</p>
                          <p>{{ currentInfo.windSpeed }}m/s</p>
                        </li>
                        <li>
                          <p>噪音</p>
                          <p>{{ currentInfo.noise }}</p>
                        </li>
                      </ul>
                    </div> -->
                    <div class="fill-list">
                      <LiquidFillEchart
                        container="liquidFillEchart"
                        :value="currentInfo.aqi"
                        :status="currentInfo.avgLevelName"
                      ></LiquidFillEchart>
                    </div>
                    <div class="file-big">
                      <ul>
                        <li>
                          <div class="box">
                            <p>温度</p>
                            <p>{{ currentInfo.temperature }}℃</p>
                          </div>
                        </li>
                        <li>
                          <div class="box">
                            <p>风力</p>
                            <p>{{ currentInfo.windPower }}级</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="file-small">
                      <ul>
                        <li>
                          <div class="box">
                            <p>风向</p>
                            <p>{{ currentInfo.windDirection }}</p>
                          </div>
                        </li>
                        <li>
                          <div class="box">
                            <p>湿度</p>
                            <p>{{ currentInfo.humidity }}%rh</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <!-- <div class="fill-left fill-right">
                      <ul>
                        <li>
                          <p>温度</p>
                          <p>{{ currentInfo.temperature }}℃</p>
                        </li>
                        <li>
                          <p>风向</p>
                          <p>{{ currentInfo.windDirection }}</p>
                        </li>
                        <li>
                          <p>湿度</p>
                          <p>{{ currentInfo.humidity }}%rh</p>
                        </li>
                        <li>
                          <p>风力</p>
                          <p>{{ currentInfo.windPower }}级</p>
                        </li>
                      </ul>
                    </div> -->
                  </div>
                  <div class="fill-img visible-md"><img src="../../newImages/internet/green/kpi.png" alt="" /></div>
                </div>
              </template>
            </BlockCard>
          </div>
          <div class="green-center-bottom">
            <BlockCard title="最近24小时">
              <template #content>
                <h4>最近24小时</h4>
                <div class="pictorial-list">
                  <EchartLine :dataList="ycSelectDataList" />
                </div>
              </template>
            </BlockCard>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="green-con">
          <div class="green-right-top">
            <BlockCard title="今日数据（次）">
              <template #content>
                <RadareEchart container="RadareEchart1" :dataList="aqiData[1]"></RadareEchart>
              </template>
            </BlockCard>
          </div>
          <div class="green-right-bottom">
            <BlockCard title="本年">
              <template #content>
                <div class="recent-list">
                  <ul class="target-list target-list3">
                    <li>AQI</li>
                    <li>{{ aqiData[4].average }}</li>
                    <li>{{ aqiData[4].avgLevelName }}</li>
                  </ul>
                  <ul class="list">
                    <li v-for="(item, index) in typeList" :key="'list' + index">
                      <span :class="'color' + (index + 1)">{{ item.label }}</span>
                      <span> {{ aqiData[4][item.key] }}</span>
                    </li>
                  </ul>
                </div>
              </template>
            </BlockCard>
            <!-- <BlockCard title="本周污染点TOP 8">
              <template #content>
                <ul class="pollution-list">
                  <li
                    v-for="(item, index) in pollutionList"
                    :key="'pollutionList' + index"
                    :class="item.status ? '' : 'gold'"
                  >
                    <span class="circle">{{ index + 1 }}</span>
                    <div class="list">
                      <div>{{ item.name }}</div>
                      <div>
                        <span>{{ item.type }}</span> <span>{{ item.number }}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </template>
            </BlockCard> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlockCard from '../../componments/BlockCard'
import RadareEchart from './RadareEchart'
import LiquidFillEchart from './LiquidFillEchart'
import EchartLine from './EchartLine'
import Api from '../../api'
export default {
  name: 'GreenConstruction',
  components: {
    BlockCard,
    RadareEchart,
    LiquidFillEchart,
    EchartLine
  },
  data() {
    return {
      //本周污染点数据列表
      pollutionList: [
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 0 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 0 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 0 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 },
        { name: '2期54#楼监测点', type: 'AQI', number: 167, status: 1 }
      ],
      //今日数据图表数据信息
      typeList: [
        { label: '优秀', value: '0', key: 'fineCts' },
        { label: '良好', value: '3', key: 'goodCts' },
        { label: '轻度', value: '0', key: 'mildCts' },
        { label: '中度', value: '4', key: 'mediumCts' },
        { label: '重度', value: '0', key: 'seriousCts' },
        { label: '严重', value: '0', key: 'graveCts' }
      ],
      tabIndex: 0,
      tabList: [],
      aqiData: {
        1: {},
        2: {},
        3: {},
        4: {}
      },
      currentInfo: {
        aqi: 0,
        humidity: 0,
        noise: 0,
        nsDevNo: 0,
        pm10: 0,
        pm25: 0,
        pmDevNo: 0,
        temperature: 0,
        thDevNo: 0,
        windDirection: 0,
        windPower: 0,
        windSpeed: 0,
        wpDevNo: 0
      },
      ycSelectDataList: [],
      productKey: '',
      timer: null
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    this.queryProductList()
  },
  methods: {
    // 初始化
    init() {
      // 今日数据
      this.queryYcSelectAqiYc(1)
      // 最近30天
      this.queryYcSelectAqiYc(2)
      // 最近90天
      this.queryYcSelectAqiYc(3)
      // 最近一年
      this.queryYcSelectAqiYc(4)
      this.queryYcCurrentInfo()
      this.queryYcSelectDataListYc()
    },
    // 切换选项卡
    changeTab(item, index) {
      clearInterval(this.timer)
      this.tabIndex = index
      this.productKey = item.productKey
      this.init()
      this.timer = setInterval(() => {
        this.init()
      }, 10000)
    },
    // 产品列表
    async queryProductList() {
      let params = {
        productTemplateIdList: [69]
      }
      let result = await Api.queryProductList(params)
      let datas = result.data || []
      this.tabList = datas
      if (datas && datas.length > 0) {
        this.changeTab(datas[0], 0)
      }
    },
    // 查询时间段内AQI数据
    async queryYcSelectAqiYc(daysType) {
      let params = {
        daysType,
        productKey: this.productKey
      }
      let result = await Api.queryYcSelectAqiYc(params)
      let datas = result.data
      this.aqiData[daysType] = datas
    },
    // 大屏实时环境监测
    async queryYcCurrentInfo() {
      let params = {
        productKey: this.productKey
      }
      let result = await Api.queryYcCurrentInfo(params)
      let datas = result.data
      if (!datas) {
        return
      }
      this.currentInfo = datas
    },
    // 查询时间段内扬尘数据
    async queryYcSelectDataListYc() {
      let params = {
        keys: 'aqi',
        productKey: this.productKey
      }
      let result = await Api.queryYcSelectDataListYc(params)
      let datas = result.data || []
      let aqiList = []
      datas.forEach(e => {
        let time = e.date
        let value = parseInt(e.values)
        aqiList.push([time, value])
      })

      let list = [
        {
          name: 'AQI',
          data: aqiList,
          type: 'line'
        }
      ]
      this.ycSelectDataList = list
    }
  }
}
</script>

<style scoped lang="less">
@green: #38f820;
@red: #f82020;
@gold: #6fdbff;
@import url('../../common.less');
@keyframes spinRotate {
  from {
    transform: rotate(0deg) scale(1);
  }
  to {
    transform: rotate(360deg) scale(1);
  }
}
.green-construction {
  display: flex;
  padding: 0 20px;
  height: 100%;
  .left {
    width: 380px;
    padding-right: @space;
  }
  .center {
    padding-top: 45px;
    flex: 1;
  }
  .right {
    width: 380px;
    padding-left: @space;
  }
}
.green-con {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.recent-list {
  color: #fff;

  .target-list {
    height: 246px;
    width: 246px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('../../newImages/internet/green/aqi.png') center no-repeat;
      background-size: contain;
      z-index: -1;
      animation: spinRotate 5s infinite cubic-bezier(0.26, 1.61, 0.69, -0.77);
    }
    &.target-list2:before {
      animation-delay: 300ms;
    }
    &.target-list3:before {
      animation-delay: 600ms;
    }
    li {
      text-align: center;
      &:first-child {
        color: @gold;
      }
      &:nth-child(2) {
        padding-top: 20px;
        font-weight: 600;
        font-size: 28px;
      }
      &:last-child {
        padding-top: 6px;
      }
    }
  }
  .list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    margin: 19px 0;
    li {
      width: 33%;
      text-align: center;
      margin-top: 20px;
      .color1 {
        color: #95ebff;
      }
      .color2 {
        color: #13a8d6;
      }
      .color3 {
        color: #a6d78e;
      }
      .color4 {
        color: #f2c244;
      }
      .color5 {
        color: #d55f38;
      }
      .color6 {
        color: #fe4d4f;
      }
      span {
        &:first-child {
          display: inline-block;
          &:before {
            content: '';
            width: 10px;
            height: 1px;
            display: inline-block;
            border-bottom: 3px solid;
            margin: 3px;
          }
        }
      }
    }
  }
}

.green-left-top {
  /deep/.middle-content {
    justify-content: center;
  }
}
.green-left-bottom {
  margin-top: @space;
  /deep/.middle-content {
    justify-content: center;
  }
}
.green-center-top {
  margin-bottom: @space;
  overflow: hidden;
  /deep/.middle-content {
    justify-content: center;
  }
}
.green-center-bottom {
  color: #fff;
  .pictorial-list {
    margin-top: 10px;
    flex: 1;
  }
  h4 {
    text-align: center;
    font-size: 14px;
    margin-top: -40px;
    &:before {
      content: url('../../images/internet/light_left.png');
      margin-right: 10px;
    }
    &:after {
      content: url('../../images/internet/light_right.png');
      margin-left: 10px;
    }
  }
}
.green-right-center {
  margin-top: @space;
}
.green-center-top {
  color: #fff;
  .fill-con {
    transform: scale(0.9);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .fill {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    .file-small,
    .file-big {
      height: 100%;
      flex: 1;
      ul {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        li {
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 30%;
          .box {
            width: 100px;
            height: 100px;
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            &:before {
              content: '';
              background: url('../../newImages/internet/green/center-small.png');
              background-size: 100%;
              width: 100%;
              height: 100%;
              position: absolute;
              z-index: -1;
              left: 0;
              top: 0;
              animation: spinRotate 8s infinite cubic-bezier(0.26, 1.61, 0.69, -0.77);
            }
          }
          p {
            &:first-child {
              font-size: 14px;
              color: @gold;
              margin-bottom: 5px;
            }
            &:last-child {
              font-size: 18px;
              font-weight: normal;
            }
          }
        }
      }
    }
    .file-big {
      ul {
        li {
          height: 50%;
        }
      }
    }
  }
  .fill-img {
    flex: initial !important;
    display: flex;
    justify-content: center;
    img {
      width: 775px;
      max-width: 100%;
    }
  }
  .fill-left {
    ul {
      margin-top: 20px;
      position: relative;
      li {
        background: url('../../newImages/internet/green/center-small.png');
        background-size: 100%;
        width: 100px;
        height: 100px;
        text-align: center;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        &:first-child {
          top: 10px;
          left: 100px;
        }
        &:nth-child(3) {
          top: 10px;
          left: 0;
        }
        &:nth-child(4) {
          top: 10px;
          left: 100px;
        }
        p {
          &:first-child {
            font-size: 14px;
            color: @gold;
            margin-bottom: 5px;
          }
          &:last-child {
            font-size: 18px;
            font-weight: normal;
          }
        }
      }
    }
  }
  .fill-right {
    ul {
      li {
        &:first-child {
          top: 10px;
          left: -100px;
        }
        &:nth-child(3) {
          top: 10px;
          left: 0;
        }
        &:nth-child(4) {
          top: 10px;
          left: -100px;
        }
      }
    }
  }
  .tabs {
    display: flex;
    align-items: center;
    justify-content: center;
    .tab {
      background: url('../../newImages/internet/green/tab.png') no-repeat;
      background-size: cover;
      width: 132px;
      height: 38px;
      display: inline-flex;
      justify-content: center;
      padding-top: 10px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      color: rgba(255, 255, 255, 0.6);
      &.active {
        background-image: url('../../newImages/internet/green/tab-hover.png');
        color: #fff;
      }
    }
  }
  .fill-list {
    // margin: 30px 15%;
    max-height: 400px;
    display: flex;
    align-items: center;
    flex: 2;
    height: 100%;
    position: relative;
    z-index: 1;
    &:before {
      content: '';
      background: url('../../newImages/internet/green/fill-bg.png') center no-repeat;
      background-size: contain;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: -1;
      left: 0;
      top: 0;
      animation: spinRotate 12s infinite cubic-bezier(0.26, 1.61, 0.69, -0.77);
    }
  }
}
.green-right-bottom {
  margin-top: @space;
  .pollution-list {
    color: #fff;
    overflow: auto;
    flex: 1;
    .gold {
      color: @gold;
    }
    li {
      display: flex;
      align-items: center;
      background: linear-gradient(to right, rgba(33, 132, 188, 0.3), rgba(33, 132, 188, 0));
      margin-bottom: 13px;
      padding: 0 10px;
      margin-left: 20px;

      .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
      }
      .circle {
        display: block;
        width: 28px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border-radius: 50%;
        border: 2px solid #2184bc;
        margin-right: 10px;
        margin-left: -20px;
        background: #0f1e2b;
      }
    }
  }
}
@media screen and (max-height: 1080px) {
  .fill-con {
    transform: scale(0.7) !important;
  }
  .recent-list {
    transform: scale(0.75) !important;
  }
}
</style>

<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="17">
        <ul class="ammeter-list">
          <li
            v-for="(item, index) in list"
            :key="index"
            :class="{ active: index === active }"
            @click="handleTab(index)"
          >
            <div class="left">
              <p>{{ item.name }}</p>
              <p>{{ item.number }}</p>
              <p>{{ item.unit }}</p>
            </div>
            <div class="right">
              <p>同期对比</p>
              <p v-if="item.status === 1">
                {{ item.value }}<img src="../../images/internet/down.png" alt="" width="20" />
              </p>
              <p v-else>{{ item.value }}<img src="../../images/internet/up.png" alt="" width="20" /></p>
            </div>
          </li>
        </ul>
        <div class="water-list">
          <BlockCard :title="'今日总用水'">
            <template #icon><img src="../../images/internet/bolt.png" /></template>
            <template #content>
              <div class="water-bar-list">
                <div v-for="(item, index) in waterList" :key="index" class="list">
                  <div class="title">{{ item.name }}</div>
                  <div class="img"><img src="../../images/internet/title-line.png" alt="" /></div>
                  <ul class="word-list">
                    <li>
                      <span>实时用水量</span>
                      <span>{{ item.num }}吨</span>
                    </li>
                    <li>所在位置：{{ item.addr }}</li>
                  </ul>
                  <div class="bar-list">
                    <WaterBar :container="'waterBar' + index" class="water-bar" :options="item"></WaterBar>
                    <div class="sign">{{ item.num }}吨</div>
                    <div class="circle-img">
                      <img src="../../images/internet/circle-bar.png" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </BlockCard>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="warn-wrapper">
          <BlockCard :title="'用水趋势'">
            <template #icon><img src="../../images/internet/danger.png" /></template>
            <template #content>
              <!--数据分析 start-->
              <div>
                <div>
                  <h4 class="title">今日用水趋势</h4>
                  <div>
                    <BargraphChart container="WaterhChart" height="245px"></BargraphChart>
                  </div>
                </div>
                <div>
                  <h4 class="title">本周用水趋势</h4>
                  <div>
                    <BargraphChart container="WaterhChart2" height="245px"></BargraphChart>
                  </div>
                </div>
                <div>
                  <h4 class="title">本月用水趋势</h4>
                  <div>
                    <BargraphChart container="WaterhChart3" height="245px"></BargraphChart>
                  </div>
                </div>
              </div>
              <!--数据分析 end-->
            </template>
          </BlockCard>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BlockCard from '@/views/bimSynergy/componments/BlockCard'
import WaterBar from './WaterBar'
import BargraphChart from './BargraphChart'
export default {
  name: 'Ammeter',
  components: {
    BlockCard,
    WaterBar,
    BargraphChart
  },
  data() {
    return {
      active: 0, //点击选中
      //总用水数据列表
      list: [
        {
          name: '今日总用水',
          number: '342.5',
          unit: 'kw/h',
          value: '0.6%',
          status: 1
        },
        {
          name: '本周总用水',
          number: '2367.1 ',
          unit: 'kw/h',
          value: '0.6%',
          status: 2
        },
        {
          name: '本月总用水',
          number: '9356.2 ',
          unit: 'kw/h',
          value: '0.6%',
          status: 1
        },
        {
          name: '全年总用水',
          number: '53698.2',
          unit: 'kw/h',
          value: '0.6%',
          status: 1
        }
      ],
      //今日总用水数据信息
      waterList: [
        { name: '智能水表1', num: 0.3, addr: '1栋一单元1楼管道井', parent: 30 },
        { name: '智能水表2', num: 0.5, addr: '2栋一单元1楼管道井', parent: 60 }
      ]
    }
  },
  methods: {
    handleTab(index) {
      this.active = index
    }
  }
}
</script>

<style scoped lang="less">
@green: #38f820;
@red: #f82020;
@gold: #ffbc2b;
.container {
  color: #fff;
  .water-list {
    margin-top: 20px;
    /deep/ .middle {
      overflow: auto;
    }
    .water-bar-list {
      display: flex;
      justify-content: space-around;
      overflow-x: auto;
      .list {
        width: 580px;
        margin-left: 80px;
        .img {
          margin-left: -37px;
        }
        .word-list {
          display: flex;
          align-items: center;
          justify-content: space-around;
          li {
            font-size: 14px;
            padding: 5px 8px 2px 8px;
            &:first-child {
              width: 46%;
              border: 1px solid rgba(255, 192, 113, 0.69);
              background: rgba(255, 192, 113, 0.29);
              border-radius: 3px;
              display: flex;
              justify-content: space-around;
              align-items: center;

              span {
                display: inline-block;
                &:first-child {
                  color: @gold;
                  &:before {
                    content: url('../../images/internet/icon-water.png');
                    width: 14px;
                    height: 14px;
                    vertical-align: middle;
                    margin-right: 10px;
                  }
                }
              }
            }
          }
        }
        .bar-list {
          position: relative;
          .water-bar {
            position: relative;
            z-index: 1;
          }
          .circle-img {
            position: absolute;
            bottom: 20px;
            left: 0;
            z-index: 0;
            img {
              width: 80%;
            }
          }
          .sign {
            font-size: 28px;
            position: absolute;
            bottom: 150px;
            left: 160px;
            z-index: 3;
          }
        }
      }
    }
  }
  .ammeter-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      background: url('../../images/internet/ammeter-list.png') no-repeat;
      background-size: 100% 100%;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 24%;
      font-size: 16px;
      line-height: 1.3;
      cursor: pointer;
      &.active {
        background: url('../../images/internet/ammeter-list-active.png') no-repeat;
        background-size: 100% 100%;
      }

      .left {
        p {
          &:nth-child(2) {
            color: @gold;
            font-size: 34px;
          }
          &:nth-child(3) {
            color: @gold;
            font-size: 12px;
          }
        }
      }
      .right {
        p {
          &:first-child {
            font-size: 14px;
          }
          &:last-child {
            font-size: 22px;
            color: #ffd487;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .warn-wrapper {
    .title {
      color: #ffdaaf;
      text-align: center;
      font-size: 14px;
      font-weight: 600;
      margin-top: 20px;
      &:before {
        content: '▶';
        font-size: 13px;
        padding-right: 2px;
      }
      &:after {
        content: '◀';
        font-size: 13px;
        margin-left: 2px;
      }
    }
  }
}
</style>

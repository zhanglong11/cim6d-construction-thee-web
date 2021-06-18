<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="17">
        <ul class="ammeter-list">
          <li
            v-for="(item, index) in list"
            :key="'ammeter' + index"
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
        <div class="wrapper">
          <BlockCard :title="'今日总用电'">
            <template #icon><img src="../../images/internet/bolt.png" /></template>
            <template #content>
              <div class="ammeter-wrapper">
                <div v-for="(item, index) in ammeterList" :key="'item' + index" class="list">
                  <ul class="list-top">
                    <li class="status" :class="{ red: item.status === 0 }">{{ item.status ? '分闸' : '合闸' }}</li>
                    <li><span class="circle"></span>{{ item.name }}</li>
                    <li>位置：1栋三单元1楼配电箱</li>
                    <li>
                      <div class="item-left">
                        <span>今日总用电</span> <span class="glod">{{ item.userAmmeter }}</span>
                      </div>
                      <div class="item-right">{{ item.proportion }}</div>
                    </li>
                  </ul>
                  <ul class="list-bottom">
                    <li v-for="subItem in item.list" :key="subItem">
                      <span>{{ subItem.name }}</span>
                      <span>{{ subItem.num }}</span>
                    </li>
                  </ul>
                </div>
                <!--                <HistogramBar></HistogramBar>-->
              </div>
            </template>
          </BlockCard>
        </div>
      </el-col>
      <el-col :span="7">
        <div class="warn-wrapper">
          <BlockCard :title="'用电分析'">
            <template #icon><img src="../../images/internet/danger.png" /></template>
            <template #content>
              <el-button-group class="user-ammeter-tab">
                <el-button
                  v-for="(item, index) in tabList"
                  :key="'user' + index"
                  v-model="isShow"
                  type="primary"
                  :class="{ 'is-active': isShow === index }"
                  @click="handleClick(index)"
                  >{{ item.name }}</el-button
                >
              </el-button-group>
              <!--报警维护 start-->
              <div v-if="isShow === 0">
                <div>
                  <h4 class="title">用电报警信息</h4>
                  <ul class="list">
                    <li>
                      <div><img src="../../images/internet/ammeter-red.png" alt="" /></div>
                      <div>
                        <p>处理中总数</p>
                        <p>2</p>
                      </div>
                    </li>
                    <li>
                      <div><img src="../../images/internet/ammeter-green.png" alt="" /></div>
                      <div>
                        <p>已处理总数</p>
                        <p class="green">184</p>
                      </div>
                    </li>
                  </ul>
                  <div class="table-wrap">
                    <el-table
                      ref="table"
                      class="table"
                      :data="tableData"
                      :row-class-name="tableRowClassName"
                      max-height="280"
                      stripe
                      highlight-current-row
                    >
                      <el-table-column prop="name" label="电报名称" />
                      <el-table-column prop="content" label="报警内容" />
                      <!--            <el-table-column prop="workType" label="工种" :formatter=""/>-->
                      <el-table-column prop="time" label="报警时间">
                        <template #default="scope">
                          <p>{{ scope.row.time.split(' ')[0] }}</p>
                          <p>{{ scope.row.time.split(' ')[1] }}</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="status" label="处理状态">
                        <template #default="scope">
                          <span class="gold">{{ scope.row.status === 1 ? '处理中' : '已解决' }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
                <div>
                  <h4 class="title">电表保养信息</h4>
                  <ul class="list">
                    <li>
                      <div><img src="../../images/internet/keep-red.png" alt="" /></div>
                      <div>
                        <p>处理中总数</p>
                        <p>2</p>
                      </div>
                    </li>
                    <li>
                      <div><img src="../../images/internet/keep-green.png" alt="" /></div>
                      <div>
                        <p>已处理总数</p>
                        <p class="green">184</p>
                      </div>
                    </li>
                  </ul>
                  <div class="table-wrap">
                    <el-table
                      ref="table"
                      class="table"
                      :data="tableData"
                      :row-class-name="tableRowClassName"
                      max-height="280"
                      stripe
                      highlight-current-row
                    >
                      <el-table-column prop="name" label="电报名称" />
                      <el-table-column prop="content" label="报警内容" />
                      <!--            <el-table-column prop="workType" label="工种" :formatter=""/>-->
                      <el-table-column prop="time" label="报警时间">
                        <template #default="scope">
                          <p>{{ scope.row.time.split(' ')[0] }}</p>
                          <p>{{ scope.row.time.split(' ')[1] }}</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="status" label="处理状态">
                        <template #default="scope">
                          <span class="gold">{{ scope.row.status === 1 ? '处理中' : '已解决' }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
              <!--报警维护 end-->
              <!--数据分析 start-->
              <div v-if="isShow === 1">
                <div>
                  <h4 class="title">今日用电趋势</h4>
                  <div>
                    <BargraphChart container="BargraphChart"></BargraphChart>
                  </div>
                </div>
                <div>
                  <h4 class="title">本周用电趋势</h4>
                  <div>
                    <BargraphChart container="BargraphChart2"></BargraphChart>
                  </div>
                </div>
                <div>
                  <h4 class="title">本月用电趋势</h4>
                  <div>
                    <BargraphChart container="BargraphChart3"></BargraphChart>
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
import BargraphChart from './BargraphChart'
export default {
  name: 'Ammeter',
  components: {
    BlockCard,
    BargraphChart
  },
  data() {
    return {
      isShow: 0, //用电分析选项卡
      active: 0, //点击选中
      tabList: [{ name: '报警维护' }, { name: '数据分析' }],
      //用电列表
      list: [
        {
          name: '今日总用电',
          number: '342.5',
          unit: 'kw/h',
          value: '0.6%',
          status: 1
        },
        {
          name: '本周总用电',
          number: '2367.1 ',
          unit: 'kw/h',
          value: '0.6%',
          status: 2
        },
        {
          name: '本月总用电',
          number: '9356.2 ',
          unit: 'kw/h',
          value: '0.6%',
          status: 1
        },
        {
          name: '全年总用电',
          number: '53698.2',
          unit: 'kw/h',
          value: '0.6%',
          status: 1
        }
      ],
      //今日总用电列表
      ammeterList: [
        {
          name: '一号配电室设备',
          address: '位置：1栋三单元1楼配电箱',
          userAmmeter: '200km/h',
          proportion: '60%',
          status: 1,
          list: [
            { name: 'Ua', num: '30', status: 1 },
            { name: 'Ub', num: '26', status: 1 },
            { name: 'Uc', num: '31', status: 1 },
            { name: 'Vlnavg', num: '30', status: 1 },
            { name: 'Uab', num: '30', status: 1 },
            { name: 'Ubc', num: '26', status: 1 },
            { name: 'Uca', num: '31', status: 1 },
            { name: 'Ullavg', num: '30', status: 1 },
            { name: 'Ia', num: '30', status: 1 },
            { name: 'Ib', num: '26', status: 1 },
            { name: 'Ic', num: '31', status: 1 },
            { name: 'Iavg', num: '30', status: 1 },
            { name: 'Pa', num: '30', status: 1 },
            { name: 'Pb', num: '26', status: 1 },
            { name: 'Pc', num: '31', status: 1 },
            { name: 'Psum', num: '30', status: 1 }
          ]
        },
        {
          name: '一号配电室设备',
          address: '位置：1栋三单元1楼配电箱',
          userAmmeter: '200km/h',
          proportion: '60%',
          status: 0,
          list: [
            { name: 'Ua', num: '30', status: 1 },
            { name: 'Ub', num: '26', status: 1 },
            { name: 'Uc', num: '31', status: 1 },
            { name: 'Vlnavg', num: '30', status: 1 },
            { name: 'Uab', num: '30', status: 1 },
            { name: 'Ubc', num: '26', status: 1 },
            { name: 'Uca', num: '31', status: 1 },
            { name: 'Ullavg', num: '30', status: 1 },
            { name: 'Ia', num: '30', status: 1 },
            { name: 'Ib', num: '26', status: 1 },
            { name: 'Ic', num: '31', status: 1 },
            { name: 'Iavg', num: '30', status: 1 },
            { name: 'Pa', num: '30', status: 1 },
            { name: 'Pb', num: '26', status: 1 },
            { name: 'Pc', num: '31', status: 1 },
            { name: 'Psum', num: '30', status: 1 }
          ]
        },
        {
          name: '一号配电室设备',
          address: '位置：1栋三单元1楼配电箱',
          userAmmeter: '200km/h',
          proportion: '60%',
          status: 0,
          list: [
            { name: 'Ua', num: '30', status: 1 },
            { name: 'Ub', num: '26', status: 1 },
            { name: 'Uc', num: '31', status: 1 },
            { name: 'Vlnavg', num: '30', status: 1 },
            { name: 'Uab', num: '30', status: 1 },
            { name: 'Ubc', num: '26', status: 1 },
            { name: 'Uca', num: '31', status: 1 },
            { name: 'Ullavg', num: '30', status: 1 },
            { name: 'Ia', num: '30', status: 1 },
            { name: 'Ib', num: '26', status: 1 },
            { name: 'Ic', num: '31', status: 1 },
            { name: 'Iavg', num: '30', status: 1 },
            { name: 'Pa', num: '30', status: 1 },
            { name: 'Pb', num: '26', status: 1 },
            { name: 'Pc', num: '31', status: 1 },
            { name: 'Psum', num: '30', status: 1 }
          ]
        },
        {
          name: '一号配电室设备',
          address: '位置：1栋三单元1楼配电箱',
          userAmmeter: '200km/h',
          proportion: '60%',
          status: 0,
          list: [
            { name: 'Ua', num: '30', status: 1 },
            { name: 'Ub', num: '26', status: 1 },
            { name: 'Uc', num: '31', status: 1 },
            { name: 'Vlnavg', num: '30', status: 1 },
            { name: 'Uab', num: '30', status: 1 },
            { name: 'Ubc', num: '26', status: 1 },
            { name: 'Uca', num: '31', status: 1 },
            { name: 'Ullavg', num: '30', status: 1 },
            { name: 'Ia', num: '30', status: 1 },
            { name: 'Ib', num: '26', status: 1 },
            { name: 'Ic', num: '31', status: 1 },
            { name: 'Iavg', num: '30', status: 1 },
            { name: 'Pa', num: '30', status: 1 },
            { name: 'Pb', num: '26', status: 1 },
            { name: 'Pc', num: '31', status: 1 },
            { name: 'Psum', num: '30', status: 1 }
          ]
        }
      ],
      //用电分析表格数据
      tableData: [
        {
          name: '智能电表1',
          content: '电压超过阈值',
          time: '20210122 13:23:21',
          status: 1
        },
        {
          name: '智能电表3',
          content: '电压超过阈值',
          time: '20210122 13:23:21',
          status: 1
        },
        {
          name: '智能电表3',
          content: '电压超过阈值',
          time: '20210122 13:23:21',
          status: 1
        },
        {
          name: '智能电表1',
          content: '电压超过阈值',
          time: '20210122 13:23:21',
          status: 1
        },
        {
          name: '智能电表3',
          content: '电压超过阈值',
          time: '20210122 13:23:21',
          status: 0
        },
        {
          name: '智能电表2',
          content: '电压超过阈值',
          time: '20210122 13:23:21',
          status: 0
        }
      ]
    }
  },
  methods: {
    //用电选项卡切换
    handleTab(index) {
      this.active = index
    },
    //用电分析选项卡
    handleClick(index) {
      this.isShow = index
    },
    //特定状态设置颜色
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 0) {
        return 'success-row'
      }
      return ''
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
  .wrapper {
    margin-top: 32px;
    /deep/ .middle {
      overflow: auto;
    }
  }
  .ammeter-wrapper {
    padding: 20px;
    display: flex;
    overflow-x: auto;
    /*width: 100%;*/
    /*justify-content: space-between;*/

    .list {
      /*flex: 1;*/
      /*width: 100%;*/
      /*overflow-x: auto;*/
      /*width: 46%;*/
      width: 425px;
      white-space: nowrap;
      background: url('../../images/internet/ammeter-wrapper.png') no-repeat;
      background-size: 100% 100%;
      padding: 40px 30px;
      margin-right: 15px;
      .list-top {
        background-color: rgba(255, 192, 113, 0.18);
        border: 1px solid rgba(255, 192, 113, 0.33);
        padding: 20px;
        border-radius: 3px;
        margin-top: 20px;
        .status {
          /*display: inline-block;*/
          text-align: right;

          color: @green;
          &:before {
            content: '';
            display: inline-block;
            width: 10px;
            height: 10px;
            margin-right: 3px;
            border-radius: 50%;
            background: @green;
            box-shadow: 0 0 3px rgba(56, 248, 32, 0.59);
          }
          &.red {
            color: @red;
            &:before {
              background: @red;
              box-shadow: 0 0 3px rgba(248, 32, 32, 0.69);
            }
          }
        }
        li {
          /*margin-bottom: 20px;*/
          &:nth-child(2) {
            .circle {
              display: inline-block;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 2px solid @gold;
              margin-right: 5px;
            }
          }
          &:nth-child(3) {
            margin: 20px 0px;
          }
          &:last-child {
            display: flex;
            border: 1px solid rgba(255, 192, 113, 0.33);
            /*padding: 5px 10px;*/

            border-radius: 3px;
            align-items: center;
            justify-content: space-between;
            .item-left {
              width: 70%;
              height: 30px;
              line-height: 30px;
              padding-left: 15px;
              /*padding:0 5px;*/
              background: linear-gradient(
                to right,
                rgba(251, 187, 72, 0.38),
                rgba(253, 205, 119, 0.38),
                rgba(255, 192, 79, 0.38)
              );
              span {
                display: inline-block;
                &:first-child {
                  font-size: 14px;
                  margin-right: 5px;
                }
                &.gold {
                  color: @gold;
                }
              }
            }
            .item-right {
              padding-right: 15px;
            }
          }
        }
      }
      .list-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 50px;
        li {
          width: 25%;
          text-align: center;
          margin-bottom: 60px;
          span {
            display: inline-block;
            &:first-child {
              color: @gold;
              margin-right: 5px;
            }
            &:last-child {
              color: @green;
            }
          }
        }
      }
    }
  }
  .warn-wrapper {
    /*background: url('../../images/internet/right-bg.png') no-repeat;*/
    .user-ammeter-tab {
      /*margin-bottom: 20px;*/
      display: flex;
      justify-content: center;
      /deep/ .el-button--primary {
        background-color: rgba(255, 192, 113, 0.33) !important;
        border-color: rgba(255, 192, 113, 0.36) !important;
        padding: 7px 30px;
        border-radius: 4px;
        margin-right: 15px;
        &.is-active {
          color: #fff !important;
          background-color: rgba(255, 177, 38, 0.47) !important;
          border-color: #ffb126 !important;
          -webkit-box-shadow: -1px 0 0 0 #ffb126;
          box-shadow: -1px 0 0 0 #ffb126;
        }
      }
    }
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
    background-size: 100% 100%;
    padding: 0 20px 20px 0;
    .table-wrap {
      padding: 0 10px;
      overflow: auto;
      /deep/ .el-table {
        background: transparent;
        .el-table__header {
          width: auto !important;
        }
        .el-table__body {
          width: auto !important;
        }
      }
    }
    .list {
      display: flex;
      justify-content: space-around;
      padding: 10px 20px;
      li {
        display: flex;
        align-items: center;
        p {
          margin-left: 15px;
          &:last-child {
            color: @gold;
            font-size: 24px;
            text-shadow: 0px 0px 3px @gold;
            margin-top: 10px;
          }
          &.green {
            color: @green;
            text-shadow: 0px 0px 3px @green;
          }
        }
      }
    }
  }
}
.el-table {
  /deep/ thead tr th {
    padding: 4px 0;
    background: #403c35 !important;
    color: #fff;
    border-right: 3px solid #000;
    border-bottom: 1px solid #000;
    text-align: center;
  }
  /deep/ tr td {
    background: #000;
    color: #999;
    border-right: 0;
    border-bottom: 1px solid #2c2927;
    text-align: center;
    .gold {
      color: @gold;
    }
  }

  &:before {
    height: 0;
  }
  /deep/ .el-table__empty-block {
    //background: transparent;
  }
  /*/deep/ .current-row {*/
  /*  td {*/
  /*    background: #f5c775 !important;*/
  /*  }*/
  /*}*/
}
.el-table--border {
  border: 1px solid #000;
}
/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #403c35;
}
/deep/ .el-table--striped .el-table__body tr.success-row td {
  background: #2f2e2d;
}
/deep/ .el-table__row {
  &:hover {
    background-color: #24211e;
    //border: 2px transparent solid;
    td {
      background-color: #24211e !important;
      //border: 2px transparent solid!important;
    }
  }
}
/deep/ .el-table--small td {
  padding: 0px 0;
}
</style>

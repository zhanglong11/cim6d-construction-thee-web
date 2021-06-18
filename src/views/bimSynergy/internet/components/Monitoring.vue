<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="5">
        <ul class="elevator-list">
          <li
            v-for="(item, index) in list"
            :key="index"
            :class="{ active: index === active }"
            @click="handleTab(index)"
          >
            <span class="status" :class="{ red: item.status === 0 }">{{ item.status ? '运行中' : '关机' }}</span>
            <div class="floor-img"><img src="../../images/internet/monitoring.png" alt="" /></div>
            <div class="floor-title">
              <h2>{{ item.name }}</h2>
              <p>{{ item.dec }}</p>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="12" class="model-wrapper">
        <!--        <h4 class="title"><img src="../../images/internet/sign.png" alt="" /><span>塔机监控1</span></h4>-->
        <!--        <div class="model-img">-->
        <!--          <img src="../../images/internet/video-bg.png" alt="" />-->
        <!--        </div>-->
        <BlockCard title="塔机监控1">
          <template #content>
            <div class="model-img">
              <img src="../../images/internet/video-bg.png" alt="" />
            </div>
          </template>
        </BlockCard>
        <BlockCard title="设备信息" style="margin-top: 17px">
          <template #content>
            <ul class="equipment-list">
              <li v-for="(item, index) in equipmentList" :key="'equipmentList' + index">
                <span>{{ item.label }}</span
                ><span>{{ item.value }}</span>
              </li>
            </ul>
          </template>
        </BlockCard>
      </el-col>
      <el-col :span="7">
        <div class="warn-wrapper">
          <BlockCard :title="'监控视频列表'">
            <template #content>
              <!--              <div class="tooltips">-->
              <!--                <el-form inline>-->
              <!--                  <el-form-item label="">-->
              <!--                    <el-date-picker-->
              <!--                      v-model="filterForm.dataTime"-->
              <!--                      type="datetime"-->
              <!--                      placeholder="选择日期"-->
              <!--                      value-format="yyyy-MM-dd HH:mm:ss"-->
              <!--                      format="yyyy-MM-dd HH:mm:ss"-->
              <!--                    >-->
              <!--                    </el-date-picker>-->
              <!--                    &lt;!&ndash;                    <DateRange :startTime.sync="filterForm.startDate" :endTime.sync="filterForm.endDate" />&ndash;&gt;-->
              <!--                  </el-form-item>-->
              <!--                  <el-form-item>-->
              <!--                    <el-button type="warning" icon="el-icon-search" @click="onSubmit">查询</el-button>-->
              <!--                  </el-form-item>-->
              <!--                </el-form>-->
              <!--              </div>-->
              <div class="table-wrap">
                <el-table ref="table" class="table" :data="tableData" max-height="845" stripe highlight-current-row>
                  <el-table-column prop="name" label="塔机名称" />
                  <el-table-column prop="content" label="报警内容" />
                  <el-table-column prop="time" label="报警时间" min-width="100">
                    <!--                    <template #default="scope">-->
                    <!--                      <p>{{ scope.row.time.split(' ')[0] }}</p>-->
                    <!--                      <p>{{ scope.row.time.split(' ')[1] }}</p>-->
                    <!--                    </template>-->
                  </el-table-column>
                  <el-table-column prop="status" label="处理状态">
                    <template #default="{ row }">
                      <span :class="row.status ? 'gold' : ''">{{ row.status ? '处理中' : '未处理' }}</span>
                      <!--                      <el-button type="text" icon="el-icon-view" class="gold" @click="toDetail(row)">查看</el-button>-->
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </BlockCard>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BlockCard from '../../componments/BlockCard'
export default {
  name: 'Elevator',
  components: {
    BlockCard
  },
  data() {
    return {
      filterForm: {},
      active: 0,
      //监控视频列表
      tableData: [
        {
          name: '塔机1',
          content: '高度预警',
          status: 1,
          time: '2021-01-22 13:00:00'
        },
        {
          name: '塔机2',
          content: '幅度报警',
          status: 1,
          time: '2021-01-22 11:00:00'
        },
        {
          name: '塔机3',
          content: '重量报警',
          status: 1,
          time: '2021-01-22 09:00:00'
        },
        {
          name: '塔机4',
          content: '风级报警',
          status: 1,
          time: '2021-01-22 07:00:00'
        },
        {
          name: '塔机5',
          content: '力矩报警',
          status: 1,
          time: '2021-01-22 15:00:00'
        },
        {
          name: '塔机1',
          content: '力矩报警',
          status: 1,
          time: '2021-01-22 13:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 11:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 09:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 09:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 07:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 13:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 11:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 1,
          time: '2021-01-22 09:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 0,
          time: '2021-01-22 07:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 0,
          time: '2021-01-22 07:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          status: 0,
          time: '2021-01-22 15:00:00'
        },
        {
          name: '塔机1',
          content: '高度报警',
          time: '2021-01-22 13:00:00',
          status: 0
        },
        {
          name: '塔机1',
          content: '高度报警',
          time: '2021-01-22 13:00:00',
          status: 0
        },
        {
          name: '塔机1',
          content: '高度报警',
          time: '2021-01-22 13:00:00',
          status: 0
        },
        {
          name: '塔机1',
          content: '高度报警',
          time: '2021-01-22 13:00:00',
          status: 0
        },
        {
          name: '塔机1',
          content: '高度报警',
          time: '2021-01-22 09:00:00',
          status: 0
        }
      ],
      //塔机监测列表
      list: [
        {
          status: 1,
          name: '塔机监控1',
          dec: '所在位置：1栋一单元'
        },
        {
          status: 0,
          name: '塔机监控2',
          dec: '所在位置：1栋一单元'
        },
        {
          status: 1,
          name: '塔机监控3',
          dec: '所在位置：1栋一单元'
        },
        {
          status: 0,
          name: '塔机监控4',
          dec: '所在位置：1栋一单元'
        },
        {
          status: 1,
          name: '塔机监控5',
          dec: '所在位置：1栋一单元'
        },
        {
          status: 1,
          name: '升降机6',
          dec: '所在位置：1栋一单元'
        }
      ],
      //设备信息列表
      equipmentList: [
        {
          label: '设备名',
          value: 'TD00234'
        },
        {
          label: '载重',
          value: '23吨'
        },
        {
          label: '回旋',
          value: '360°'
        },
        {
          label: '幅度',
          value: '210°'
        },
        {
          label: '高度',
          value: '145米'
        },
        {
          label: '测斜角',
          value: '11°'
        },
        {
          label: '当前倍率',
          value: '3.1倍'
        },
        {
          label: '定时额定载重',
          value: '22吨'
        },
        {
          label: '力矩百分比',
          value: '300%'
        },
        {
          label: '力矩',
          value: '23牛顿.米'
        },
        {
          label: '风速',
          value: '13 km/h'
        }
      ]
    }
  },
  methods: {
    handleTab(index) {
      this.active = index
    },
    toDetail(row) {},
    //查询日期
    onSubmit() {}
  }
}
</script>

<style scoped lang="less">
@green: #38f820;
@red: #f82020;
@gold: #ffbc2b;

.container {
  color: #fff;
  .title {
    text-shadow: 1px 1px 3px #d3a658;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      margin-right: 3px;
    }
  }
  .elevator-list {
    li {
      display: flex;
      align-items: center;
      background: url('../../images/internet/list.png') no-repeat;
      background-size: 100% 100%;
      padding: 39px 40px;
      position: relative;
      cursor: pointer;
      &.active {
        background: url('../../images/internet/list-active.png') no-repeat;
        background-size: 100% 100%;
      }
      .status {
        display: inline-block;
        position: absolute;
        right: 25px;
        top: 23px;
        color: @green;
        &:before {
          content: '';
          display: inline-block;
          width: 10px;
          height: 10px;
          margin-right: 3px;
          border-radius: 50%;
          background: @green;
        }
        &.red {
          color: @red;
          &:before {
            background: @red;
          }
        }
      }

      .floor-img {
        width: 25%;
        img {
          width: 100%;
        }
      }
    }
    .floor-title {
      flex: 1;
      margin-left: 40px;
    }

    h2 {
      font-size: 30px;
      font-weight: 600;
    }
    p {
      font-size: 12px;
      margin-top: 10px;
    }
  }
  .model-wrapper {
    /*background: url('../../images/internet/center-bg.png') no-repeat;*/
    /*background-size: 100% 100%;*/
    /*padding: 20px;*/
    .equipment-list {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      /*justify-content: space-between;*/
      padding-right: 30px;
      li {
        width: 20%;
        display: flex;
        justify-content: space-between;
        margin: 25px 20px 35px 20px;
        span {
          &:first-child {
            display: inline-block;
            color: #f4d1a8;
            border-left: 3px solid;
            padding-left: 5px;
          }
        }
      }
    }
    .model-img {
      margin-top: 10px;
      /*width: 100%;*/
      img {
        width: 100%;
      }
    }
    .model-content {
      .img {
        width: 100%;
      }
      .model-info {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        li {
          width: 50%;
          margin-bottom: 12px;
          font-size: 15px;
          span {
            &:first-child {
              color: #ffb126;
              display: inline-block;
              width: 47%;
            }
            &.red {
              color: @red;
            }
            &.green {
              color: @green;
            }
          }
        }
      }
    }
  }
  .warn-wrapper {
    /*background: url('../../images/internet/right-bg.png') no-repeat;*/
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
.tooltips {
  margin-left: 12px;
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

/deep/ .el-input__inner {
  &.is-focus {
    border-color: #f1c971;
  }
  background: #000;
  border-color: #f1c971;
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
</style>

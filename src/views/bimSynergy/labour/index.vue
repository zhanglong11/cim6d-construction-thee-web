<template>
  <div class="content">
    <div class="labour">
      <div class="left">
        <div class="todayStatistics">
          <BlockCard :title="'今日进退场统计'">
            <template #content>
              <!--              <TodayStatisticsChart :chartData="chartData" />-->
              <TodayStatisticsChartBar :chartData="chartData" />
            </template>
          </BlockCard>
        </div>
        <div class="typeView">
          <BlockCard :title="'现场工种'">
            <template #content>
              <div class="tv-con">
                <div class="tv-right">
                  <div class="tv-item" :class="tvCurItem === -1 ? 'tv-cur-item' : ''" @click="handleClickItem(-1)">
                    全部人员
                  </div>
                  <div
                    v-for="(item, index) in workTypeList"
                    :key="index"
                    class="tv-item"
                    :class="tvCurItem === item.workType ? 'tv-cur-item' : ''"
                    :title="$getLabelFromArg('workType', item.workType)"
                    @click="handleClickItem(item.workType)"
                  >
                    {{ $getLabelFromArg('workType', item.workType) }}
                  </div>
                </div>
                <div class="tv-left">
                  <div class="tv-text">
                    <div class="text" :title="activeWorkName">{{ activeWorkName }}</div>
                    <div class="number">{{ activeWorkNum }}</div>
                  </div>
                  <div class="tv-bg">
                    <div class="tv-person" />
                    <div class="tv-line-left" />
                    <div class="tv-line-right-first" />
                    <div class="tv-line-right-second" />
                    <div class="tv-foot" />
                    <div class="tv-mask" />
                    <!--                    <div class="tv-scan"></div>-->
                  </div>
                </div>
              </div>
            </template>
          </BlockCard>
        </div>
      </div>
      <div class="center">
        <div class="bim-model">
          <!-- <BlockCard :title="'模型展示'">
            <template #content>
              <div class="bm-con">
                <BimView ref="bim" :model-id="localStorage.getItem('bimModelId')" :bimBgColor="bimConfig.bimBgColor" />
              </div>
            </template>
          </BlockCard> -->
        </div>
        <div class="table-info">
          <BlockCard :title="'现场人员信息表'">
            <template #content>
              <div class="table-wrap">
                <el-table
                  ref="table"
                  class="table"
                  stripe
                  :data="personTableData"
                  height="99%"
                  highlight-current-row
                  @row-click="showDetail"
                >
                  <el-table-column prop="name" label="姓名" align="center" />
                  <el-table-column prop="groupName" label="班组" align="center" show-overflow-tooltip />
                  <!--            <el-table-column prop="workType" label="工种" :formatter=""/>-->
                  <el-table-column
                    prop="workType"
                    label="工种"
                    :formatter="(row, column, cellValue) => $getLabelFromArg('workType', cellValue)"
                    align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column prop="companyName" label="所属公司" align="center" show-overflow-tooltip />
                  <el-table-column prop="mobile" label="联系方式" align="center" show-overflow-tooltip />
                  <el-table-column prop="date" label="打卡时间" align="center" show-overflow-tooltip />
                </el-table>
              </div>
            </template>
          </BlockCard>
        </div>
      </div>
      <div class="right">
        <div class="person-info">
          <BlockCard :title="'人员信息'">
            <template #content>
              <div class="pi-con">
                <div class="pi-left">
                  <div
                    v-if="activeItem.headImage"
                    class="pi-img"
                    :style="`background-image: url('${activeItem.headImage}')`"
                  >
                    <!-- <img :src="activeItem.headImage" /> -->
                    <!--<div class="status"><span>●</span>在线</div>-->
                  </div>
                  <div v-else class="pi-img-null">暂&nbsp;无</div>
                  <div class="pi-ding"></div>
                </div>
                <div class="pi-right">
                  <div class="pi-item">
                    <div class="label">姓名：</div>
                    <div class="value" :title="activeItem.name || '-'">{{ activeItem.name || '-' }}</div>
                  </div>
                  <div class="pi-item">
                    <div class="label">班组：</div>
                    <div class="value" :title="activeItem.groupName || '-'">{{ activeItem.groupName || '-' }}</div>
                  </div>
                  <div class="pi-item">
                    <div class="label">工种：</div>
                    <div class="value" :title="$getLabelFromArg('workType', activeItem.workType)">
                      {{ $getLabelFromArg('workType', activeItem.workType) }}
                    </div>
                  </div>
                  <div class="pi-item">
                    <div class="label">体温：</div>
                    <div class="value" :title="activeItem.temperature || '-'">
                      {{ activeItem.temperature ? activeItem.temperature + '℃' : '-' }}
                    </div>
                  </div>
                  <div class="pi-item">
                    <div class="label">联系方式：</div>
                    <div class="value" :title="activeItem.mobile || '-'">{{ activeItem.mobile || '-' }}</div>
                  </div>
                  <div class="pi-item">
                    <div class="label">所属公司：</div>
                    <div class="value" :title="activeItem.companyName || '-'">{{ activeItem.companyName || '-' }}</div>
                  </div>
                  <div class="pi-item">
                    <div class="label">打卡时间：</div>
                    <div class="value" :title="activeItem.date || '-'">{{ activeItem.date || '-' }}</div>
                  </div>
                </div>
              </div>
            </template>
          </BlockCard>
        </div>
        <div class="type-company">
          <div class="type-list visible-md">
            <BlockCard :title="'现场工种'">
              <template #content>
                <el-table
                  ref="table"
                  class="table"
                  :data="groupList"
                  stripe
                  height="99%"
                  highlight-current-row
                  @row-click="showDetail"
                >
                  <el-table-column prop="groupName" label="班组名" align="center" />
                  <el-table-column prop="principalName" label="班组班长" align="center" />
                  <el-table-column prop="num" label="班组人数" align="center" />
                </el-table>
              </template>
            </BlockCard>
          </div>
          <div class="labour-company">
            <BlockCard :title="'到场劳务公司'">
              <template #content>
                <div v-if="companyData.length" class="company-con">
                  <div v-for="(item, index) in companyData" :key="index" class="company">
                    <div class="index">{{ index + 1 }}</div>
                    <div class="company-desc">
                      <p class="company-name">
                        <span :title="item.companyName">{{ item.companyName }}</span>
                      </p>
                      <p class="company-num">
                        <span class="num-total">
                          共计
                          <b class="num">{{ item.num }}</b>
                        </span>
                        <span>
                          占比
                          <b class="total">{{ item.percentage | toFixed2 }}%</b>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else class="company-con-null">暂无数据</div>
              </template>
            </BlockCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodayStatisticsChartBar from './todayStatisticsChartBar'
import BlockCard from '../componments/BlockCard'
import Api from './api'
import bimConfig from '../bimConfig' // bim模型配置
export default {
  components: { TodayStatisticsChartBar, BlockCard },
  data() {
    return {
      tvCurItem: -1,
      personTableData: [],
      workTypeTotal: 0,
      workTypeList: [],
      activeWorkName: '总数',
      activeWorkNum: 0,
      groupList: [],
      chartData: {
        into: [],
        out: []
      },
      companyData: [],
      activeItem: {},
      timeIndex: 0,
      timer: null,
      bimConfig
    }
  },
  computed: {
    workType() {
      return this.$getArgList('workType') || []
    }
  },
  mounted() {
    this.formatBim()
    this.init()
  },
  beforeDestroy() {
    this.formatBim()
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    // 处理bim是否显示
    formatBim() {
      let defaultHeight = 300
      this.$parent.bimConHeight = bimConfig.bimConHeight + defaultHeight
    },
    init() {
      // this.onresize()
      this.refresh()
    },
    // 监听窗口改变
    onresize() {
      this.$nextTick(() => {
        if (this.$parent.onresize) {
          this.$parent.onresize()
        }
      })
    },
    async refresh() {
      let res = await Api.default({})
      let resData = _.cloneDeep(res.data)
      this.personTableData = resData.employeeList || []
      // console.log(resData.employeeList)
      if (resData.employeeList && resData.employeeList.length) {
        this.currentRow()
      }
      this.groupList = resData.groupList || []
      this.initWorkType(resData.workTypeList || [])
      this.chartData = {
        into: resData.into || [],
        out: resData.out || []
      }
      let companyList = resData.companyList || []
      let numsList = _.map(companyList, 'num')
      let total =
        numsList.length > 0
          ? numsList.reduce(function (prev, curr, idx, arr) {
              return prev + curr
            })
          : 0
      companyList.map(e => {
        e.percentage = (e.num / total) * 100
        // total
      })
      this.companyData = companyList
    },
    currentRow() {
      this.timer = setInterval(() => {
        if (this.personTableData.length === this.timeIndex) {
          this.timeIndex = 0
        }
        // this.$refs.table.setCurrentRow(this.personTableData[this.timeIndex])
        this.activeItem = this.personTableData[this.timeIndex]
        this.timeIndex += 1
      }, 2000)
    },
    // 现场工种选项点击
    handleClickItem(type) {
      this.tvCurItem = type
      if (type === -1) {
        this.activeWorkName = '总数'
        this.activeWorkNum = this.workTypeTotal
        return
      }
      this.activeWorkName = this.$getLabelFromArg('workType', type)
      this.activeWorkNum = this.workTypeList.filter(f => f.workType === type)[0].num
    },
    //现场工种数据
    initWorkType(data) {
      let total = 0
      data.forEach(d => (total += d.num))
      this.workTypeTotal = total
      this.workTypeList = data
      this.activeWorkNum = total
    },
    showDetail(item) {
      this.activeItem = item
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./labour');
</style>

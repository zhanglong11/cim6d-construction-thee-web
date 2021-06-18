<template>
  <div class="content">
    <div class="quality">
      <div class="left">
        <BlockCard :title="'模型列表'">
          <template #content>
            <div class="tree-con">
              <BimTree
                class="synergy"
                :modelReady="bimReady"
                :is-model="false"
                :model-id="localStorage.getItem('bimModelId')"
              />
              <!--              <BimTree class="screen" />-->
            </div>
          </template>
        </BlockCard>
      </div>
      <div class="center">
        <!-- <BlockCard :title="'模型展示'">
          <template #content>
            <div class="bm-con">
              <BimView
                ref="bim"
                :model-id="localStorage.getItem('bimModelId')"
                :bimBgColor="bimConfig.bimBgColor"
                @ready="getData"
              />
            </div>
          </template>
        </BlockCard> -->
      </div>
      <div class="right">
        <BlockCard :title="type === 1 ? '质量问题' : '安全问题'">
          <template #content>
            <QualityIssueChart :type="type" />
            <div class="search-con">
              <div class="search">
                <input class="input" placeholder="请输入" @input="e => (search = e.target.value)" />
                <div class="icon" @click="getTableData"></div>
              </div>
            </div>
            <div class="table-wrap pi-con">
              <el-table
                ref="table"
                class="table"
                stripe
                :data="tableData"
                height="100%"
                highlight-current-row
                @row-click="showCurrentIcon"
              >
                <el-table-column type="index" label="序号" width="60" align="center" />
                <el-table-column prop="problemDesc" show-overflow-tooltip label="问题描述" min-width="90" />
                <el-table-column
                  prop="problemArea"
                  show-overflow-tooltip
                  label="检查部位"
                  min-width="90"
                  align="center"
                />
                <el-table-column prop="status" show-overflow-tooltip label="整改状态" min-width="90">
                  <template slot-scope="{ row }">
                    <div v-if="row.status === 0"><span class="status status-0">●</span>草稿</div>
                    <div v-if="row.status === 1"><span class="status status-1">●</span>待整改</div>
                    <div v-if="row.status === 2"><span class="status status-2">●</span>待复查</div>
                    <div v-if="row.status === 3"><span class="status status-3">●</span>复查合格</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="60" align="center">
                  <template slot-scope="{ row }">
                    <el-button type="text" size="mini" class="details-btn" @click.stop="showDetail(row)"
                      >详情</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </BlockCard>
      </div>
    </div>
    <QualitySafeDialog v-if="visible" :id="activeId" :visible.sync="visible" />
  </div>
</template>

<script>
import QualityIssueChart from './qualityIssueChart'
import QualitySafeDialog from './components/qualitySafeDialog'
import BlockCard from '../componments/BlockCard'
import Api from './api'
import bimConfig from '../bimConfig' // bim模型配置
export default {
  components: { QualityIssueChart, QualitySafeDialog, BlockCard },
  data() {
    return {
      visible: false,
      search: '',
      activeId: null,
      currentId: null,
      tableData: [],
      isReady: false,
      bimConfig
    }
  },
  computed: {
    type() {
      return this.$route.meta.type
    },
    bimReady() {
      return this.$parent.bimReady
    }
  },
  watch: {
    bimReady(v) {
      if (v) {
        this.getData()
      }
    }
  },
  beforeDestroy() {
    this.formatBim('-')
  },
  mounted() {
    this.init()
    this.formatBim()
    this.$nextTick(() => {
      if (this.bimReady) {
        this.getData()
      }
    })
  },
  methods: {
    // 处理bim是否显示
    formatBim(type = '+') {
      let rightWidth = type === '+' ? 500 : 400
      this.$parent.rightWidth = rightWidth
    },
    init() {
      this.getTableData()
    },
    // 监听窗口改变
    onresize() {
      this.$nextTick(() => {
        if (this.$parent.onresize) {
          this.$parent.onresize()
        }
      })
    },
    async getTableData() {
      let res = await Api.list({ screenSearch: this.search, inspectType: this.type })
      this.tableData = res.data
    },
    async getData(idAry = []) {
      let bimApp = this.$parent.$refs.bim
      bimApp.clearMark()
      let res = this.type === 1 ? await Api.getQualityModelId(idAry) : await Api.getSafeModelId(idAry)
      let elementId = res.data.filter(d => d.componentIdList && d.componentIdList.length)
      let initEleAry = [...new Set(elementId.map(e => e.componentIdList).flat())]
      // let initAry = initEleAry.map(i => {
      //   let o = {}
      //   o.id = i
      //   o.data = res.data.filter(a => a.componentIdList && a.componentIdList.includes(i)).map(d => d.dataId)
      //   return o
      // })
      if (!initEleAry || !initEleAry.length) {
        bimApp.setCameraPickData()
        return
      }
      if (!idAry.length) {
        bimApp.setCameraPickData()
      } else {
        bimApp.pickElement(initEleAry)
      }
      bimApp.setMark({ eleAry: initEleAry, imgSrc: require('./images/issue.png'), callBack: this.iconClick })
    },

    handleInput(e) {
      console.log(e.target.value)
    },
    showCurrentIcon({ id }) {
      this.currentId = this.currentId === id ? null : id
      this.currentId ? this.getData([this.currentId]) : this.getData()
    },
    showDetail(item) {
      this.activeId = item.id
      this.visible = true
    },
    async iconClick(e) {
      let doc = e.split('+')[1].split('/')
      let param = { docId: doc[0], elementId: doc[1] }
      let res = await Api.getElementQuality(localStorage.getItem('bimModelId'), param)
      this.currentId = res.data
      this.$parent.$refs.bim.showDetail(e)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./quality');
</style>

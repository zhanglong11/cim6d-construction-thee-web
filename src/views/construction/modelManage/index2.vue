<template>
  <div class="wrap">
    <el-card class="slide">
      <div slot="header" class="card-header">
        <span> BIM模型列表</span>
        <div>
          <el-button :disabled="checkedModelList.length < 2" @click="handleMergeModel">合并</el-button>
          <el-button v-if="$hasPower('ModelManageEpcPppAdd')" type="primary"> 模型管理 </el-button>
        </div>
      </div>
      <div class="tree-wrapper" style="padding: 10px; height: calc(100% - 100px)">
        <el-tree
          ref="tree"
          highlight-current
          :data="treeData"
          node-key="bimResourceId"
          show-checkbox
          :props="defaultProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          @check="treeCheckChange"
        >
          <div slot-scope="{ data }" class="custom-tree-node">
            <div v-loading="['INIT', 'UPLOADED'].includes(data.status)">
              <header>
                <span :title="data.name" class="name">{{ data.name }}</span>
                <span v-if="data.status === 'ERROR'">转换出错了</span>
              </header>
              <el-button-group class="btn-wrapper">
                <i class="el-icon-delete" @click="handleRemoveModel(data)"></i>
              </el-button-group>
            </div>
          </div>
        </el-tree>
      </div>
    </el-card>
    <div class="content">
      <el-card>
        <div slot="header" class="card-header">
          <span> BIM模型列表</span>
        </div>
        <div class="model-wrapper">
          <div class="model">
            <BIM :model-id="activeModelId" />
          </div>
          <template v-if="activeName === 'progress'">
            <ul v-if="searchForm.type === 1 || searchForm.type === 5" class="legend">
              <li><i style="background: #feed01"></i><span>已完成</span></li>
              <li><i style="background: #999"></i><span>未完成</span></li>
            </ul>
            <ul v-if="searchForm.type === 2" class="legend">
              <li><i style="background: #feed01"></i><span>第一天</span></li>
              <li><i style="background: #f8c17e"></i><span>第二天</span></li>
              <li><i style="background: #f29400"></i><span>第三天</span></li>
              <li><i style="background: #ec6d4a"></i><span>第四天</span></li>
              <li><i style="background: #e01c26"></i><span>第五天</span></li>
              <li><i style="background: #cc5072"></i><span>第六天</span></li>
              <li><i style="background: #a61f6e"></i><span>第七天</span></li>
            </ul>
            <ul v-if="searchForm.type === 3" class="legend">
              <li><i style="background: #feed01"></i><span>第一周</span></li>
              <li><i style="background: #f8c17e"></i><span>第二周</span></li>
              <li><i style="background: #f29400"></i><span>第三周</span></li>
              <li><i style="background: #ec6d4a"></i><span>第四周</span></li>
              <li><i style="background: #e01c26"></i><span>第五周</span></li>
            </ul>
            <ul v-if="searchForm.type === 4" class="legend">
              <li><i style="background: #feed01"></i><span>一月</span></li>
              <li><i style="background: #f8c17e"></i><span>二月</span></li>
              <li><i style="background: #f29400"></i><span>三月</span></li>
              <li><i style="background: #ec6d4a"></i><span>四月</span></li>
              <li><i style="background: #e01c26"></i><span>五月</span></li>
              <li><i style="background: #cc5072"></i><span>六月</span></li>
              <li><i style="background: #a61f6e"></i><span>七月</span></li>

              <li><i style="background: #453e71"></i><span>八月</span></li>
              <li><i style="background: #37519c"></i><span>九月</span></li>
              <li><i style="background: #01aa8d"></i><span>十月</span></li>
              <li><i style="background: #149e2e"></i><span>十一月</span></li>
              <li><i style="background: #afca01"></i><span>十二月</span></li>
            </ul>
          </template>
          <template v-if="activeName === 'quality'">
            <ul class="legend quality">
              <li><i style="background: #ff0000"></i><span>未整改问题</span></li>
              <li><i style="background: #149e2e"></i><span>已整改问题</span></li>
            </ul>
          </template>
          <template v-if="activeName === 'safe'">
            <ul class="legend safe">
              <li><i style="background: #ff9900"></i><span>未整改问题</span></li>
              <li><i style="background: #d0e17d"></i><span>已整改问题</span></li>
            </ul>
          </template>
        </div>
      </el-card>
      <div class="detail">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="进度查看" name="progress"> </el-tab-pane>
          <el-tab-pane label="质量问题查看" name="quality"> </el-tab-pane>
          <el-tab-pane label="安全问题查看" name="safe"> </el-tab-pane>
        </el-tabs>
        <div style="padding: 10px; width: 100%">
          <div class="tooltips">
            <el-form ref="pageQuery" :model="searchForm" inline>
              <el-form-item label="查看时间范围">
                <el-radio-group v-model="searchForm.type">
                  <el-radio :label="1">全部</el-radio>
                  <el-radio :label="2">本周</el-radio>
                  <el-radio :label="3">本月</el-radio>
                  <el-radio :label="4">本年</el-radio>
                  <el-radio :label="5">自由设置</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="">
                <DateRange
                  v-if="activeName === 'progress'"
                  key="1"
                  :disabled="searchForm.type !== 5"
                  :startTime.sync="progressForm.startDate"
                  :endTime.sync="progressForm.endDate"
                />
                <DateRange
                  v-if="activeName === 'quality'"
                  key="2"
                  :disabled="searchForm.type !== 5"
                  :startTime.sync="qualityForm.beginDate"
                  :endTime.sync="qualityForm.endDate"
                />
                <DateRange
                  v-if="activeName === 'safe'"
                  key="3"
                  :disabled="searchForm.type !== 5"
                  :startTime.sync="safeForm.beginDate"
                  :endTime.sync="safeForm.endDate"
                />
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
                  <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </div>
          <!--进度列表-->
          <Grid
            v-if="activeName === 'progress'"
            key="1"
            ref="progress"
            :immediate="false"
            max-height="300"
            :request="progressRequest"
            :filter-form.sync="progressForm"
          >
            <vxe-table-column type="seq" title="序号" width="60px" />
            <vxe-table-column field="taskName" title="进度名称" min-width="200" />
            <vxe-table-column field="scheduleFileName" title="所属进度文件" min-width="200" />
            <vxe-table-column field="planStartDate" title="计划开始时间" min-width="200" />
            <vxe-table-column field="planEndDate" title="计划结束时间" min-width="200" />
            <vxe-table-column field="actualStartDate" title="实际开始时间" min-width="200" />
            <vxe-table-column field="actualEndDate" title="实际结束时间" min-width="200" />
            <vxe-table-column field="executePersonName" title="任务完成人" min-width="200" />
          </Grid>
          <!--质量列表-->
          <Grid
            v-if="activeName === 'quality'"
            key="2"
            ref="quality"
            max-height="300"
            :immediate="false"
            :request="qualityRequest"
            :filter-form.sync="qualityForm"
          >
            <vxe-table-column type="seq" title="序号" width="60px" />
            <vxe-table-column field="description" title="质量问题描述" min-width="200" />
            <vxe-table-column field="locationName" title="问题部位" min-width="200" />
            <vxe-table-column field="engineeringCategory" title="工程类别" min-width="200" />
            <vxe-table-column field="issueType" title="问题类型" min-width="200" />
            <vxe-table-column field="discoveryPersonName" title="发现人" min-width="200" />
            <vxe-table-column field="discoveryDate" title="发现时间" min-width="200" />
            <vxe-table-column field="rectificationDate" title="整改期限" min-width="200" />
            <vxe-table-column
              field="isPunctualityRectification"
              title="是否按期整改"
              min-width="200"
              :formatter="({ cellValue }) => $getLabel(qualityLimitList, cellValue)"
            />
            <vxe-table-column
              field="status"
              title="状态"
              min-width="200"
              :formatter="({ cellValue }) => $getLabel(qualityStatusList, cellValue)"
            />
            <vxe-table-column field="cancelDate" title="取消时间" min-width="200" />
            <vxe-table-column field="cancelPersonName" title="取消人" min-width="200" />
            <vxe-table-column field="name" width="100" fixed="right" title="操作">
              <template #default="{ row }">
                <el-button type="text" @click="toQualityDetail(row.id)">详情</el-button>
              </template>
            </vxe-table-column>
          </Grid>
          <!--安全列表-->
          <Grid
            v-if="activeName === 'safe'"
            key="3"
            ref="safe"
            max-height="300"
            :immediate="false"
            :request="safeRequest"
            :filter-form.sync="safeForm"
          >
            <vxe-table-column type="seq" title="序号" width="60px" />
            <vxe-table-column field="description" title="安全问题描述" min-width="200" />
            <vxe-table-column field="locationName" title="问题部位" min-width="200" />
            <vxe-table-column field="engineeringCategory" title="工程类别" min-width="200" />
            <vxe-table-column field="issueType" title="问题类型" min-width="200" />
            <vxe-table-column field="discoveryPersonName" title="发现人" min-width="200" />
            <vxe-table-column field="discoveryDate" title="发现时间" min-width="200" />
            <vxe-table-column field="rectificationDate" title="整改期限" min-width="200" />
            <vxe-table-column
              field="isPunctualityRectification"
              title="是否按期整改"
              min-width="200"
              :formatter="({ cellValue }) => $getLabel(qualityLimitList, cellValue)"
            />
            <vxe-table-column
              field="status"
              title="状态"
              min-width="200"
              :formatter="({ cellValue }) => $getLabel(qualityStatusList, cellValue)"
            />
            <vxe-table-column field="cancelDate" title="取消时间" min-width="200" />
            <vxe-table-column field="cancelPersonName" title="取消人" min-width="200" />
            <vxe-table-column field="name" width="100" fixed="right" title="操作">
              <template #default="{ row }">
                <el-button type="text" @click="toSafeDetail(row.id)">详情</el-button>
              </template>
            </vxe-table-column>
          </Grid>
        </div>
      </div>
    </div>
    <LibraryLinkDialog
      v-if="libraryLinkVisible"
      :modelId="activeModelId"
      :viewId="viewId"
      :viewName="viewName"
      :visible.sync="libraryLinkVisible"
    />
    <el-dialog title="合并模型" :visible.sync="mergeModelDialogVisible">
      <el-form label-width="100px">
        <el-form-item label="合并列表">
          <el-tag v-for="{ name, modelId } in checkedModelList" :key="modelId" style="margin: 3px 10px 3px 0">
            {{ name }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新模型名称" required>
          <el-input v-model="mergeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="mergeForm.remark" type="textarea" :autosize="{ minRows: 3 }"></el-input>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="mergeModelDialogVisible = false">取消</el-button>
        <el-button v-promise-btn :disabled="!mergeForm.name" type="primary" @click="submitMergeModel">合并</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import LibraryLinkDialog from './components/LibraryLinkDialog'
import Api from './api'
import BIM from './components/bim/view'
import axios from '@/utils/axios'
import { getModelList, removeModel, createModel, updateModelStatus } from '@/api/modelo'

export default {
  name: 'ModelManage',
  components: { LibraryLinkDialog, BIM },
  data() {
    return {
      mergeModelDialogVisible: false,
      mergeForm: {
        name: '',
        remark: ''
      },
      libraryLinkVisible: false,
      activeModelId: null, //当前active模型
      treeData: [], //树数据
      checkedModelList: [], // 当前checked模型
      checkId: null, //当前选中
      viewId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      activeName: 'progress',
      viewName: '',
      searchForm: {
        type: 3
      },
      //进度搜索条件
      progressForm: {
        startDate: moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      //质量搜索条件
      qualityForm: {
        beginDate: moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      //安全搜索条件
      safeForm: {
        beginDate: moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      //进度列表接口
      progressRequest: body => {
        return Api.progressList(body)
      },
      //质量列表接口
      qualityRequest: body => {
        return Api.qualityList(body)
      },
      //安全列表接口
      safeRequest: body => {
        return Api.safeList(body)
      },
      //质量是否按期列表
      qualityLimitList: [
        { label: '否', value: 0 },
        { label: '是', value: 1 }
      ],
      //质量状态列表
      qualityStatusList: [
        { label: '未整改', value: 0 },
        { label: '已整改', value: 1 }
      ]
    }
  },
  watch: {
    //切换tab
    activeName() {
      this.searchForm = {
        type: 3
      }
      this.reset()
    },
    //时间类型切换
    'searchForm.type'(v) {
      const startWeekDate = moment().week(moment().week()).startOf('week').format('YYYY-MM-DD HH:mm:ss') //本周第一天
      const startMonthDate = moment().month(moment().month()).startOf('month').format('YYYY-MM-DD HH:mm:ss') //本月第一天
      const startYearDate = moment().year(moment().year()).startOf('year').format('YYYY-MM-DD HH:mm:ss') //本年第一天
      const endDate = moment().format('YYYY-MM-DD HH:mm:ss')
      if (v === 1 || v === 5) {
        this.qualityForm = {
          ...this.qualityForm,
          ...{
            beginDate: null,
            endDate: null
          }
        }
        this.safeForm = {
          ...this.safeForm,
          ...{
            beginDate: null,
            endDate: null
          }
        }
        this.progressForm = {
          ...this.progressForm,
          ...{
            startDate: null,
            endDate: null
          }
        }
        return
      }
      this.progressForm = {
        ...this.progressForm,
        ...{
          startDate: v === 2 ? startWeekDate : v === 3 ? startMonthDate : startYearDate,
          endDate: endDate
        }
      }
      this.qualityForm = {
        ...this.qualityForm,
        ...{
          beginDate: v === 2 ? startWeekDate : v === 3 ? startMonthDate : startYearDate,
          endDate
        }
      }
      this.safeForm = {
        ...this.safeForm,
        ...{
          beginDate: v === 2 ? startWeekDate : v === 3 ? startMonthDate : startYearDate,
          endDate: endDate
        }
      }
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    // 初始化
    init() {
      setTimeout(() => {
        this.refresh()
      }, 3000)
    },
    //刷新
    refresh() {
      this.$nextTick(() => {
        this.$refs[this.activeName].refresh()
        this.BIMSearch()
      })
    },
    //加载树
    async getTreeData() {
      const res = await getModelList({ projectId: localStorage.getItem('projectId') })
      const treeData = _.cloneDeep(res.data)
      // 处理已上传未处理完成的模型状态，从modelo查询模型状态，并同步到自己的服务器
      treeData.forEach(model => {
        const c = model => {
          if (model.status !== 'CONVERTED') {
            Modelo.Model.get(model.modelId).then(res => {
              model.status = res.status
              if (res.status !== model.status) {
                updateModelStatus({ id: model.id, status: res.status })
                e.status = res.status
              }
              if (res.status === 'INIT' || res.status === 'UPLOADED') {
                setTimeout(() => c(model), 2000)
              }
            })
          }
        }
        c(model)
      })
      this.list = treeData
      this.treeData = treeData
      return false
      this.$refs.tree.setCheckedKeys(treeData.map(r => r.bimResourceId))
      this.qualityForm = {
        ...this.qualityForm,
        ...{
          modelIdList: treeData.filter(r => r.type === 3).map(r => r.bimResourceId)
        }
      }
      this.safeForm = {
        ...this.safeForm,
        ...{
          modelIdList: treeData.filter(r => r.type === 3).map(r => r.bimResourceId)
        }
      }
      this.progressForm = {
        ...this.progressForm,
        ...{
          modelIdList: treeData.filter(r => r.type === 3).map(r => r.bimResourceId)
        }
      }
      this.init()
    },
    // 左侧树点击事件
    handleNodeClick(node) {
      this.activeModelId = node.modelId
    },
    //删除模型
    async handleRemoveModel(data) {
      await this.$tipRemove([data])
      await removeModel([data.id])
      await this.getTreeData()
    },
    //重置
    reset() {
      this.searchForm = {
        type: 3
      }
      this.refresh()
    },
    //显示图纸关联模态框
    showLinkDialog(modelId, viewId, viewName) {
      this.activeModelId = modelId
      this.viewId = viewId
      this.viewName = viewName
      this.libraryLinkVisible = true
    },
    //质量详情跳转
    toQualityDetail(id) {
      this.$router.push({
        name: 'EpcPppQualityQuestionDetail',
        params: {
          id
        }
      })
    },
    //安全详情跳转
    toSafeDetail(id) {
      this.$router.push({
        name: 'EpcPppSafetyQuestionDetail',
        params: {
          id
        }
      })
    },
    //树选中
    treeCheckChange(data, { checkedNodes, halfCheckedNodes }) {
      let list = []
      let allNodes = [...checkedNodes, ...halfCheckedNodes]
      this.checkedModelList = allNodes
      console.log(allNodes)

      /*allNodes.map(e => {
        if (e.type === 3) {
          list.push(e)
        }
        if (e.isFloor || e.isRoom) {
          guidList.push(...e.componentGuids)
        }
      })
      this.qualityForm = {
        ...this.qualityForm,
        ...{
          modelIdList: allNodes.filter(r => r.type === 3).map(r => r.bimResourceId)
        }
      }
      this.safeForm = {
        ...this.safeForm,
        ...{
          modelIdList: allNodes.filter(r => r.type === 3).map(r => r.bimResourceId)
        }
      }
      this.progressForm = {
        ...this.progressForm,
        ...{
          modelIdList: allNodes.filter(r => r.type === 3).map(r => r.bimResourceId)
        }
      }
      this.formatBimArray(list, true, _.uniqBy(guidList))*/
    },

    handleMergeModel() {
      this.mergeModelDialogVisible = true
      this.mergeForm.remark = '合并自模型：' + this.checkedModelList.map(e => e.name).join(',')
    },

    async submitMergeModel() {
      const modelId = await Modelo.Model.merge(
        this.mergeForm.name,
        this.checkedModelList.map(e => e.modelId)
      )
      await createModel({ modelId, ...this.mergeForm, projectId: localStorage.getItem('projectId') })
      this.mergeModelDialogVisible = false
      this.mergeForm.name = ''
      this.mergeForm.remark = ''
      this.getTreeData()
    },

    // 处理bim数据
    formatBimArray(array, isChange = false, guidArray) {
      let selectMonomer = []
      array.map(e => {
        selectMonomer.push({
          id: e.bimResourceId,
          viewId: e.viewId,
          modelName: e.bimResourceName,
          modelUrl: `${location.origin}${axios.gis.defaults.baseURL}/noToken/basic/commonFile/get/fdht/bim_${e.viewId}/3d.svf`
        })
      })
      this.selectMonomer = selectMonomer
      if (isChange) {
        // 改变选择
        this.singleChange({ bimArray: this.selectMonomer, guidArray })
      } else {
        // 初始化
        this.bimInit(this.selectMonomer)
      }
    },

    // 选择树
    singleChange({ bimArray, guidArray }) {
      this.$refs.BIMRef.watchModal(bimArray, guidArray)
    },
    // bim初始化
    bimInit(bimArray) {
      this.$refs.BIMRef.bimInit(bimArray)
    },

    //查看BIM数据
    BIMSearch() {
      if (this.activeName === 'progress') {
        this.getProgressModel()
      } else {
        this.getQualitySafeModel()
      }
    },

    //获取质量安全BIM模型
    async getQualitySafeModel() {
      const res =
        this.activeName === 'quality'
          ? await Api.getQualityModel(this.qualityForm)
          : await Api.getSafeModel(this.qualityForm)
      const resData = res.data
      let noCancelColor = '255,0,0'.split(',')
      let cancelColor = '20,158,46'.split(',')
      const bimApp = this.$refs.BIMRef.bimfishApp

      bimApp.clearIconDrawableMarker()
      bimApp.clearThemingColors()
      bimApp.viewer.impl.invalidate(true, true, true)

      if (this.activeName === 'quality') {
        // 已取消质量问题 标注
        resData.cancelGuid && this.$refs.BIMRef.qualityMarker(resData.cancelGuid, 2)
        // 未取消质量问题 标注
        resData.unCancelGuid && this.$refs.BIMRef.qualityMarker(resData.unCancelGuid, 1)
      } else {
        // 已取消安全问题 标注
        resData.cancelGuid && this.$refs.BIMRef.safeMarker(resData.cancelGuid, 2)
        // 未取消安全问题 标注
        resData.unCancelGuid && this.$refs.BIMRef.safeMarker(resData.unCancelGuid, 1)
      }
    },

    //获取进度BIM模型
    async getProgressModel() {
      const progressForm = this.progressForm
      const type = this.searchForm.type
      const cycleType = type === 1 || type === 5 ? 3 : type - 2
      const param = {}
      param.start = progressForm.startDate
      param.end = progressForm.endDate
      param.modelIdList = progressForm.modelIdList
      param.cycleType = cycleType
      const bimApp = this.$refs.BIMRef.bimfishApp
      bimApp.clearIconDrawableMarker()
      bimApp.clearThemingColors()
      const res = await Api.getProgressModel(param)
      const resData = res.data
      const colorAry = [
        '254,237,1', //1
        '248,193,126', //2
        '242,148,0', //3
        '236,109,74', //4
        '236,33,38', //5
        '236,33,38', //6
        '236,33,38', //7
        '69,62,113', //8
        '55,81,156', //9
        '1,170,141', //10
        '20,158,46', //11
        '175,202,1' //12
      ]
      const isFinishColorAry = ['254,237,1', '153,153,153']
      // console.log('cycleType-----', cycleType, bimApp)
      if (cycleType === 3) {
        resData.map(r => {
          let color = isFinishColorAry[r.groupNum].split(',')
          if (!r.componentIdList) {
            return
          }
          bimApp.setThemingColorArray(r.componentIdList, color[0] / 255, color[1] / 255, color[2] / 255, 1.0)
        })
        bimApp.viewer.impl.invalidate(true, true, true)
        return
      }
      resData.map(r => {
        let color = colorAry[r.groupNum - 1].split(',')
        if (!r.componentIdList) {
          return
        }
        bimApp.setThemingColorArray(r.componentIdList, color[0] / 255, color[1] / 255, color[2] / 255, 1.0)
      })
      bimApp.viewer.impl.invalidate(true, true, true)
    },

    //BIM上色
    clearProgressColor() {
      const bimApp = this.$refs.BIMRef.bimfishApp
      bimApp.clearThemingColors()
    }
  }
}
</script>

<style scoped lang="less">
div.wrap {
  display: flex;
  background-color: #f0f2f5;
  padding: 0;
  overflow: hidden;
  .slide {
    flex: 0 0 350px;
    background-color: #fff;
    /deep/ .el-card__body {
      height: 100%;
      padding: 0;
      .tree-wrapper {
        height: calc(100% - 100px);
        .el-tree-node__content {
          height: 52px;
        }
        .el-tree-node:not(:nth-last-child(2)) {
          border-bottom: 1px solid #eee;
        }
        .el-tree-node__expand-icon {
          display: none;
        }
        .el-checkbox {
          margin-left: 5px;
          margin-right: 10px;
        }
      }
      .el-tree {
        height: 100%;
        overflow: hidden;
      }
      .bottom-btn {
        text-align: center;
      }
    }
  }
  .content {
    flex: 1;
    margin-left: 20px;
    width: calc(100% - 20px);
    overflow: hidden;
    background-color: #f0f2f5;
    .model-wrapper {
      display: flex;
      .legend {
        flex: 0 0 140px;
        padding: 10px;
        li {
          width: 100%;
          padding: 4px 10px;
          display: flex;
          align-items: center;
          font-size: 14px;
          i {
            display: inline-flex;
            width: 20px;
            height: 10px;
            background: red;
            margin-right: 10px;
          }
        }
        &.quality {
          li {
            i {
              border-radius: 50%;
              height: 20px;
            }
          }
        }
        &.safe {
          li {
            i {
              height: 20px;
              transform: rotate(45deg) scale(0.8);
            }
          }
        }
      }
      .model {
        width: 100%;
        height: 500px;
      }
    }

    .detail {
      margin-top: 20px;
      background: #fff;
    }
  }
}
.custom-tree-node {
  width: 100%;
  overflow: hidden;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .btn-wrapper {
    display: flex;
    justify-content: right;
    align-items: center;
    > * {
      margin-right: 5px;
    }
  }
}
</style>

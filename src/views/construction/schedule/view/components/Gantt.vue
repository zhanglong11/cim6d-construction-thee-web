<template>
  <div ref="gantt-wrap" class="gantt-wrap">
    <div style="justify-content: flex-end; display: flex">
      <el-form>
        <el-form-item>
          <el-radio-group v-model="showChart">
            <el-radio-button :label="false">表格</el-radio-button>
            <el-radio-button :label="true">甘特图</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="视图" label-width="50px">
          <el-radio-group v-model="viewMode" size="mini">
            <el-radio-button :label="1">月</el-radio-button>
            <el-radio-button :label="2">周</el-radio-button>
            <el-radio-button :label="3">日</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="margin-left: 10px">
          <el-button type="primary" size="mini" @click="handleFullscreen">全屏</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div :id="ganttId" ref="gantt" style="height: calc(100% - 51px)"></div>
    <Detail :visible.sync="viewDialogVisible" :taskId="activeTaskId"></Detail>
  </div>
</template>

<script>
import { Gantt } from '@/assets/js/dhtmlxgantt/dhtmlxgantt'
const gantt = Gantt.getGanttInstance()
import Detail from './Detail'
const formatterDate = val => (val ? moment(val).format('YYYY-MM-DD') : '')
const changeRecordColumn = {
  name: 'view',
  label: '变更记录',
  width: 50,
  align: 'center',
  resize: true,
  template(task) {
    return `<a  style="${
      task.taskId && task.changedRecordCount > 0 ? 'color:#19c69b;' : 'color:#ccc;pointer-events:none'
    }" data-id="${task.taskId}" data-key="view">查看(${task.changedRecordCount || 0})</a>`
  }
}
const acceptanceStatusList = ['草稿', '待验收', '通过', '驳回']
const acceptanceColumn = {
  name: 'view',
  label: '验收状态',
  width: 50,
  align: 'center',
  resize: true,
  template(task) {
    return acceptanceStatusList[task.acceptanceStatus] || ''
  }
}
const milestoneColumn = {
  name: 'isMilestone',
  label: '里程碑',
  width: 50,
  align: 'center',
  resize: true,
  template(task) {
    return `
        <label style="width: 40px;height: 35px;display: block;">
        <input type="checkbox" ${task.milestoneFlag === 1 ? 'checked="checked"' : ''}" data-taskUniqueId="${
      task.taskUniqueId
    }" data-key="milestone">
  </label>
  `
  }
}
const defaultColumns = [
  { name: 'wbs', label: '任务编号', width: 60, template: gantt.getWBSCode, align: 'center', resize: true },
  { name: 'text', label: '任务名称', tree: true, width: 150, align: 'left', resize: true },
  {
    name: 'planStartDate',
    label: '计划开始日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.start_date)
    }
  },
  {
    name: 'planEndDate',
    label: '计划结束日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.end_date)
    }
  },
  changeRecordColumn,
  acceptanceColumn,
  milestoneColumn,
  { name: 'add', label: '', width: 40 }
]
const fullColumns = [
  { name: 'wbs', label: '任务编号', width: 60, template: gantt.getWBSCode, align: 'center', resize: true },
  { name: 'text', label: '任务名称', tree: true, width: 150, align: 'center', resize: true },
  {
    name: 'planStartDate',
    label: '计划开始日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.start_date)
    }
  },
  {
    name: 'planEndDate',
    label: '计划结束日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.end_date)
    }
  },
  {
    name: 'actualStartDate',
    label: '实际开始日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.actualStartDate)
    }
  },
  {
    name: 'actualEndDate',
    label: '实际结束日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.actualEndDate)
    }
  },
  {
    name: 'status',
    label: '任务状态',
    align: 'center',
    resize: true,
    width: 60,
    template(task) {
      return ['未领取', '已领取', '未完成', '超前完成', '正常完成', '滞后完成'][task.status] || ''
    }
  },
  { name: 'executePersonName', label: '任务执行人', align: 'center', resize: true, width: 80 },
  {
    name: 'isBind',
    label: '关联状态',
    align: 'center',
    resize: true,
    width: 60,
    template(task) {
      return ['未关联', '已关联'][task.isBind] || ''
    }
  },
  changeRecordColumn,
  acceptanceColumn,
  milestoneColumn
]
const uploadPageColumns = [
  { name: 'wbs', label: '任务编号', width: 60, template: gantt.getWBSCode, align: 'center', resize: true },
  { name: 'text', label: '任务名称', tree: true, width: 150, align: 'left', resize: true },
  {
    name: 'planStartDate',
    label: '计划开始日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.start_date)
    }
  },
  {
    name: 'planEndDate',
    label: '计划结束日期',
    align: 'center',
    resize: true,
    width: 90,
    template(task) {
      return formatterDate(task.end_date)
    }
  },
  milestoneColumn,
  { name: 'add', label: '', width: 40 }
]
export default {
  name: 'Gantt',
  components: { Detail },
  props: {
    unicode: {
      type: String,
      default: null
    },
    // 甘特图id
    ganttId: {
      type: String,
      default: 'gantt'
    },
    // 是否是新建
    isAdd: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      //gantt实例
      gantt,
      //视图模式 1 月  2 周   3 日
      viewMode: 3,
      showChart: false, // 显示甘特图右侧的图表,
      viewDialogVisible: false,
      activeTaskId: null,
      showGantt: true,
      selectMilestoneFlag: [] // 选择的里程碑
    }
  },
  watch: {
    viewMode() {
      this.setScale()
    },
    showChart: {
      immediate: true,
      handler(val) {
        gantt.config.show_chart = val
        if (val) {
          gantt.config.columns = this.isAdd ? uploadPageColumns : defaultColumns
        } else {
          gantt.config.columns = fullColumns
        }
        gantt.resetLayout()
      }
    }
  },
  beforeDestroy() {
    this.showGantt = false
    gantt.detachAllEvents()
    gantt.clearAll()
  },
  mounted() {
    this.init()
    if (this.isAdd) this.showChart = true
  },
  methods: {
    render() {
      gantt.render()
      gantt.resetLayout()
    },
    // 初始化
    init() {
      // gantt.detachEvent('onTaskClick')
      gantt.detachEvent('my-click')
      if (gantt.$root) {
        gantt.clearAll()
      }
      gantt.i18n.setLocale('cn')
      gantt.config.xml_date = '%Y-%m-%d %H:%i'
      gantt.config.day_date = '%M %d日 %D'
      gantt.config.default_date = '%Y年 %M %d日'
      gantt.config.month_date = '%Y年 %M'
      gantt.config.readonly = false // 只读模式
      gantt.config.open_tree_initially = true // 默认展开所有
      gantt.config.auto_scheduling = true
      gantt.config.start_on_monday = true
      gantt.config.auto_scheduling_strict = true
      gantt.config.auto_scheduling_compatibility = true
      gantt.config.auto_scheduling_descendant_links = true
      gantt.config.auto_types = true
      gantt.config.autofit = true
      gantt.config.lightbox_additional_height = 120
      gantt.config.columns = fullColumns
      // gantt.config.grid_width = 600
      gantt.templates.task_date = date => moment(date).format('YYYY-MM-DD')
      const sections = [
        { name: 'description', height: 70, map_to: 'text', type: 'textarea', focus: true },
        {
          name: 'time',
          type: 'duration',
          map_to: 'auto',
          time_format: ['%Y', '%m', '%d', '%H:%i']
        }
      ]
      gantt.config.lightbox.sections = sections
      gantt.config.lightbox.project_sections = sections
      gantt.config.lightbox.milestone_sections = sections

      gantt.init(this.$refs.gantt)
      gantt.attachEvent(
        'onTaskClick',
        (id, e) => {
          let index = this.selectMilestoneFlag.indexOf(id)
          if (index < 0) {
            this.selectMilestoneFlag.push(id)
          } else {
            this.selectMilestoneFlag.splice(index, 1)
          }
          if (e.target.getAttribute('data-key') === 'view') {
            this.activeTaskId = e.target.getAttribute('data-id')
            this.viewDialogVisible = true
          } else if (e.target.getAttribute('data-key') === 'milestone') {
            if (this.isAdd) {
              // 新增进度文件逻辑
              this.$emit('changeMilestone', this.selectMilestoneFlag)
            } else {
              const checked = +e.target.checked
              const taskUniqueId = e.target.getAttribute('data-taskUniqueId')
              this.axios.schedule
                .post('task/milestone/save', {
                  milestoneFlag: checked,
                  milestoneIdList: [taskUniqueId],
                  unicode: this.unicode
                })
                .then(() => {
                  this.$message.success(checked ? '设置里程碑成功' : '取消里程碑成功')
                })
                .catch(err => {
                  this.$message.error('设置里程碑失败')
                  this.$emit('refresh')
                })
            }
          } else {
            return true
          }
        },
        { id: 'my-click' }
      )
      gantt.attachEvent('onAfterTaskAdd', (id, item) => {
        item.planStartDate = moment(item.start_date).format('YYYY-MM-DD HH:mm:ss')
        item.planEndDate = moment(item.end_date).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    // 导入project文件（使用dhtmlxgantt的服务器解析）
    importFromMSProject(file) {
      gantt.importFromMSProject({
        data: file,
        callback: (project, callback) => {
          if (project) {
            gantt.clearAll()
            if (project.config.duration_unit) {
              gantt.config.duration_unit = project.config.duration_unit
            }
            gantt.parse(project.data)
          }
          if (callback) callback(project)
        }
      })
    },
    // 获取甘特图数据
    getData() {
      return gantt.serialize('json')
    },
    //设置甘特图数据
    setData(data) {
      gantt.clearAll()
      gantt.parse(data)
    },
    // 设置视图模式
    setScale() {
      gantt.config.scales = [
        [{ unit: 'month', step: 1, format: '%Y年%M' }],
        [{ unit: 'week', step: 1, format: '%Y年%M%d日', width: 200 }],
        [
          { unit: 'week', step: 1, format: '%F, %Y' },
          { unit: 'day', step: 1, format: '%j, %D' }
        ]
      ][this.viewMode - 1]
      gantt.config.min_column_width = [60, 100, 40][this.viewMode - 1]
      gantt.render()
    },
    handleFullscreen() {
      this.$fullscreen.toggle(this.$refs['gantt-wrap'])
      setTimeout(() => {
        gantt.render()
      }, 30)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/js/dhtmlxgantt/skins/dhtmlxgantt_material.css';
.gantt-wrap {
  background-color: #fff;
  &.fullscreen {
    min-height: 100%;
    padding: 15px;
    margin-top: 0 !important;
    width: unset !important;
  }
}
.el-form {
  display: flex;
  align-items: center;
}
</style>

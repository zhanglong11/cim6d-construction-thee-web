<template>
  <el-dialog
    class="beauty"
    width="600px"
    top="10vh"
    title="会议重叠通知"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <h3>会议重叠，请确定所创建项目与下方已有会议是否相同</h3>
    <el-form label-width="120px">
      <el-form-item label="会议主题">{{ form.meetingSubject }}</el-form-item>
      <el-form-item label="会议类型">{{ $getLabelFromArg('workMeetingType', form.meetingType) }} </el-form-item>
      <el-form-item label="发起人">{{ form.initiatorName }} </el-form-item>
      <el-form-item label="参与人">{{ form.participantName.join(',') }} </el-form-item>
      <el-form-item label="会议时间">{{ form.startTime }} - {{ form.endTime }} </el-form-item>
      <el-form-item label="会议地址"> {{ form.meetingAddress }}</el-form-item>
      <el-form-item label=" 创建人">{{ form.creatorName }} </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">重复，取消新建</el-button>
      <el-button v-promise-btn type="primary" @click="submit">不重复，继续新建</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'RepeatDialog',
  // import引入的组件
  components: {},
  props: {
    visible: {
      type: Boolean
    },
    activeKey: {
      type: Number
    },
    repeatData: {}
  },
  data() {
    // 这里存放数据
    return {
      form: {}
    }
  },
  watch: {
    activeKey(v) {
      this.form = this.repeatData[v]
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    refresh() {
      this.form = this.repeatData[this.activeKey]
    },
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      if (this.repeatData.length !== this.activeKey + 1) {
        this.$emit('update:activeKey', this.activeKey + 1)
        return
      }
      this.$emit('update:repeatData', [])
      this.$emit('update:activeKey', 0)
      this.$emit('update:addVisible', false)
      this.$parent.save(true)
      this.close()
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="wrap">
    <el-form ref="form" label-width="120px" style="width: 500px">
      <el-form-item label="任务内容" prop="taskContent">
        {{ form.taskContent }}
      </el-form-item>
      <el-form-item label="任务重要性" prop="taskLevel">{{ $getLabel(importList, form.taskLevel) }} </el-form-item>
      <el-form-item label="任务发起人" prop="taskLevel">{{ form.initiatorStr }}</el-form-item>
      <el-form-item label="任务发起时间" prop="taskLevel">{{ form.createTime }}</el-form-item>
      <el-form-item label="任务类型" prop="taskLevel">{{ form.taskType ? '多任务' : '单一任务' }}</el-form-item>
      <template v-if="form.taskType">
        <el-card v-for="(item, index) in form.detailAddDTOList" :key="index" shadow="never" style="margin-top: 10px">
          <div slot="header" class="card-header">子任务{{ index + 1 }}</div>

          <el-form-item label="子任务内容">
            {{ item.taskContent }}
          </el-form-item>

          <el-form-item label="任务接收人">
            {{ item.executorStr }}
          </el-form-item>

          <el-form-item label="任务截止时间">{{ item.taskEndTime }}</el-form-item>
          <el-form-item label="完成情况">{{ $getLabel(statusList, item.status) }}</el-form-item>
          <template v-if="item.status === 1">
            <el-form-item label="完成结果">{{ item.taskResult }}</el-form-item>
            <el-form-item label="附件"> <FileList :ids="item.fileId" /></el-form-item>
          </template>
          <template v-else>
            <el-button type="primary" @click="showDialog(item.id)">催办</el-button>
          </template>
        </el-card>
      </template>
      <template v-else>
        <el-form-item label="任务接收人" prop="executor">
          {{ form.executorStr }}
        </el-form-item>

        <el-form-item label="任务截止时间" prop="taskEndTime">
          {{ form.taskEndTime }}
        </el-form-item>

        <el-form-item label="完成情况">
          {{ $getLabel(statusList, form.status) }}
        </el-form-item>

        <template v-if="form.status === 1">
          <el-form-item label="完成结果">{{ form.taskResult }}</el-form-item>
          <el-form-item label="附件"> <FileList :ids="form.fileId" /></el-form-item>
        </template>
        <template v-else>
          <el-button type="primary" @click="showDialog(id)">催办</el-button>
        </template>
      </template>
    </el-form>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
    <AddDialog v-if="visible" :visible.sync="visible" type="urge" :activeId="activeId" />
  </div>
</template>

<script>
import Api from './api'
import statusList from './lib/statusList'
import importList from './lib/importList'
import AddDialog from './components/addDialog'
export default {
  name: 'Detail',
  // import引入的组件
  components: { AddDialog },
  props: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      visible: false,
      form: {
        taskType: 0,
        detailAddDTOList: []
      },
      activeId: null,
      statusList,
      importList
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.id)
      let cloneData = _.cloneDeep(res.data)
      this.form = {
        ...cloneData,
        taskType: cloneData.taskType ? 1 : 0,
        detailAddDTOList: cloneData.taskResultDetailDTOList
      }
    },
    showDialog(id) {
      this.activeId = id
      this.visible = true
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
div.wrap {
  padding-bottom: 40px;
}
</style>

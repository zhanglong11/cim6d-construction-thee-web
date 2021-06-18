<template>
  <el-dialog
    width="800px"
    class="beauty"
    top="10vh"
    :title="!id ? '新建' : '详情'"
    append-to-body
    :close-on-click-modal="false"
    :visible="visible"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="消息标题" prop="title">
        <el-input v-if="!id" v-model="form.title" />
        <span v-else>{{ form.title }}</span>
      </el-form-item>
      <el-form-item v-if="!id || form.content" label="内容" prop="content">
        <el-input v-if="!id" v-model="form.content" type="textarea" />
        <span v-else>{{ form.content }}</span>
      </el-form-item>
      <el-form-item v-if="!id" label="接收人" prop="personId">
        <SelectUser
          :id.sync="form.personId"
          :value="form.personId ? form.personId.split(',').map(id => ({ id })) : []"
          :multiple="true"
          append-to-body
          @input="changeUser"
        />
      </el-form-item>
      <el-form-item v-if="!id || form.fileId" label="附件" prop="fileId">
        <FileEdit v-if="!id" v-model="form.fileId" />
        <FileList v-else :ids="form.fileId" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <template v-if="!id">
        <el-button @click="close">取消</el-button>
        <el-button v-promise-btn type="primary" @click="submit">确认</el-button>
      </template>
      <el-button v-else type="primary" @click="close(true)">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../api'
export default {
  name: 'AddDialog',
  props: {
    visible: {
      type: Boolean
    },
    isRead: {
      type: Boolean
    },
    id: {}
  },
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        title: [{ required: true, message: '必填' }],
        content: [{ required: true, message: '必填' }],
        personId: [{ required: true, message: '必填' }]
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (!this.id) return
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
      if (this.form.readStatus === 0 && this.isRead) {
        this.read()
      }
    },
    //关闭
    close(isFresh) {
      this.$emit('update:visible', false)
      this.$parent.refresh()
    },
    //已读
    async read() {
      await Api.read([this.id])
    },
    changeUser(v) {
      if (!v) return
      let ary = []
      v.map(a => {
        ary.push(a.id)
      })
      this.form = {
        ...this.form,
        receiverIds: ary
      }
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      let cloneData = _.cloneDeep(this.form)
      delete cloneData.personId
      await Api.add(cloneData)
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>

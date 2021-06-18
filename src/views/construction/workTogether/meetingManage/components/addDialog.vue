<template>
  <el-dialog
    width="600px"
    top="10vh"
    :title="title"
    :close-on-click-modal="false"
    append-to-body
    :visible="visible"
    @close="close"
  >
    <!--添加，编辑表单-->
    <el-form
      v-if="type === 'add' || type === 'edit' || type === 'details'"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="会议主题" prop="meetingSubject">
        <el-input v-model="form.meetingSubject" :disabled="type === 'details'" />
      </el-form-item>
      <el-form-item label="会议类型" prop="meetingType">
        <SelectList
          v-model="form.meetingType"
          :self-list="meetingType"
          :has-all-option="false"
          :disabled="type === 'details'"
        />
      </el-form-item>
      <el-form-item label="发起人" prop="initiator">
        <SelectUser
          v-model="form.initiator"
          valueFormat="id"
          :multiple="false"
          append-to-body
          :disabled="type === 'details'"
        />
      </el-form-item>
      <el-form-item label="参与人" prop="participant">
        <SelectUser
          :id.sync="form.participant"
          :disabled="type === 'details'"
          :value="form.participant ? form.participant.split(',').map(id => ({ id })) : []"
          append-to-body
        />
      </el-form-item>
      <el-form-item label="会议时间" prop="date">
        <el-date-picker
          v-model="form.date"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          :disabled="type === 'details'"
          style="width: 100%"
          @input="
            arr => {
              form.startTime = arr ? arr[0] : null
              form.endTime = arr ? arr[1] : null
            }
          "
        />
      </el-form-item>
      <el-form-item label="会议地点" prop="meetingAddress">
        <el-input v-model="form.meetingAddress" type="textarea" :disabled="type === 'details'" />
      </el-form-item>
      <el-form-item v-if="type === 'details'" label="创建人" required>
        <el-input v-model="form.creatorName" :disabled="type === 'details'" />
      </el-form-item>
    </el-form>
    <!--添加，编辑表单-->

    <!--取消-->
    <div v-if="type === 'cancel'" class="cancel">
      <h4>确定取消当前会议吗？</h4>
      <h6>一旦取消，将无法恢复，请慎重</h6>
    </div>
    <!--取消-->

    <!--上传会议记录-->
    <div v-if="type === 'upload'" class="cancel">
      <FileEdit v-model="form.meetingFileId" accept="doc,docx,pdf,jpg,png,ppt,xlsx,txt,xls" :multiple="false" />
      <h6>一旦上传成功，除上传者外，其余所有用户将都无法再上传会议记录</h6>
    </div>
    <!--上传会议记录-->

    <!--上传会议记录-->
    <div v-if="type === 'repeat'" class="cancel">
      <FileList :ids="oldFile" />
      <FileEdit v-model="form.meetingFileId" accept="doc,docx,pdf,jpg,png,ppt,xlsx,txt,xls" :multiple="false" />
      <h6>1、上传新的会议记录后，将自动替换现有会议记录</h6>
      <h6>2、所有与会人员都将仅能看到新的会议记录</h6>
    </div>
    <!--上传会议记录-->

    <footer slot="footer">
      <el-button v-if="type !== 'details'" @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import level from '../lib/level'
import Api from '../api'
export default {
  name: 'AddDialog',
  props: {
    visible: {
      type: Boolean
    },
    repeatData: {},
    activeId: {},
    type: {}
  },
  data() {
    // 这里存放数据
    return {
      form: {},
      level,
      oldFile: null,
      rules: {
        meetingSubject: [{ required: true, message: '必填' }],
        meetingType: [{ required: true, message: '必填' }],
        initiator: [{ required: true, message: '必填' }],
        participant: [{ required: true, message: '必填' }],
        date: [{ required: true, message: '必填' }],
        meetingAddress: [{ required: true, message: '必填' }],
        meetingFileId: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    title() {
      switch (this.type) {
        case 'details':
          return '详情'
        case 'add':
          return '新建'
        case 'edit':
          return '编辑'
        case 'cancel':
          return '取消'
        case 'upload':
          return '上传会议记录'
        case 'repeat':
          return '替换会议记录'
        default:
          return ''
      }
    },
    meetingType() {
      return this.$getArgList('workMeetingType') || []
    }
  },
  // 生命周期 - 挂载完成
  created() {
    if (!this.activeId) return
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.activeId)
      this.form = {
        ...res.data,
        date: [res.data.startTime, res.data.endTime]
      }
      console.log(111, this.form, this.type)
      if (this.type === 'repeat') {
        this.form = {
          ...res.data,
          ...{
            meetingFileId: null
          }
        }
        this.oldFile = res.data.meetingFileId
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      if (this.type === 'details') {
        this.close()
        return
      }
      this.$refs.form && (await this.$refs.form.validate())
      if (this.type === 'add') {
        this.$emit('update:addForm', this.form)
        this.$parent.save()
        return
      }
      if (this.type === 'edit') {
        this.$emit('update:addForm', this.form)
        this.$parent.save()
        return
      }
      if (this.type === 'cancel') {
        await Api.remove([this.activeId])
      }
      if (this.type === 'upload') {
        if (!this.form.meetingFileId) {
          this.$message.error('请上传文件')
          return
        }
        await Api.update({ ...this.form, ...{ hardAdd: true, recorderId: localStorage.getItem('id') } })
      }
      if (this.type === 'repeat') {
        if (!this.form.meetingFileId) {
          this.$message.error('请上传文件')
          return
        }
        await Api.update({ ...this.form, ...{ hardAdd: true, recorderId: localStorage.getItem('id') } })
      }
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.cancel {
  text-align: center;
  /deep/.upload {
    .el-upload--text {
      text-align: center;
    }
  }
  h4 {
    font-size: 20px;
  }
  h6 {
    margin-top: 40px;
    font-size: 16px;
    color: red;
    & + h6 {
      margin: 0;
    }
  }
}
</style>

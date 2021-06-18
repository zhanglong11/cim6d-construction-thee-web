<template>
  <el-dialog
    class="beauty"
    :title="id ? '修改安全教育视频' : '新建安全教育视频'"
    :visible="visible"
    width="850px"
    :close-on-click-modal="false"
    @close="close"
  >
    <div>
      <div class="dialog-content">
        <el-form
          ref="form"
          :model="form"
          style="width: 650px; margin-top: 10px; margin-left: 10px"
          label-width="150px"
          :rules="rules"
        >
          <el-form-item label="视频名称：" prop="videoName">
            <el-input v-model="form.videoName" placeholder="请输入视频名称"></el-input>
          </el-form-item>
          <el-form-item label="视频上传：" prop="attachment">
            <!-- <FileEdit v-model="form.attachment" raw isOnlyButton :limit="1" accept="mp4" /> -->
            <Upload v-model="form.attachment" isOnlyButton accept="mp4" :limit="1" />
          </el-form-item>
          <el-form-item label="是否默认：" prop="defaultFlag">
            <el-radio-group v-model="form.defaultFlag">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="getSubmit">保存</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import api from '../api/index'
export default {
  name: 'EducationEdit',
  components: {},
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      // 表单数据
      form: {},
      btnLoading: false,
      rules: {
        videoName: [{ required: true, message: '必填' }],
        attachment: [{ required: true, message: '必选' }],
        defaultFlag: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {},
  created() {
    if (this.id) {
      api.getEducationDetail(this.id).then(res => {
        this.form = { ...res.data }
      })
    }
  },
  methods: {
    //提交保存
    async getSubmit() {
      try {
        await this.$refs.form.validate()
        this.btnLoading = true
        if (this.id) {
          await api.getEducationUpdate(this.form).then(res => {
            this.btnLoading = false
            this.$message.success('编辑成功')
            this.close()
            this.$parent.refresh()
          })
        } else {
          await api.getEducationAdd(this.form).then(res => {
            this.btnLoading = false
            this.$message.success('新增成功')
            this.close()
            this.$parent.refresh()
          })
        }
      } catch (e) {
        this.btnLoading = false
      }
    },

    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less">
.el-popup-parent--hidden /deep/.vxe-table--tooltip-wrapper.vxe-table--valid-error {
  z-index: 9999 !important;
}
.dia-sp {
  font-size: 16px;
}
</style>

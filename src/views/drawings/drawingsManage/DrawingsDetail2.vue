<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-form label-width="140px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="图纸名称：">{{ drawingsName }}</el-form-item>
            <el-form-item label="图纸：">
              <img :src="drawings.imgSrc" class="preview-img" />
            </el-form-item>
            <el-form-item label="附件：">
              <FileList :ids="attachmentIds" />
            </el-form-item>
            <el-form-item label="备注：">{{ remark }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getDrawingsDetail } from '../api'
export default {
  data() {
    return {
      id: this.$route.params.id || '',
      drawingsName: '',
      drawings: {},
      attachmentIds: '',
      remark: ''
    }
  },
  mounted() {
    if (this.id) {
      this.getDrawingsDetail(this.id)
    }
  },
  methods: {
    // 获取图纸详情
    getDrawingsDetail(id) {
      getDrawingsDetail(id).then(res => {
        let data = res.data
        this.drawingsName = data.drawingsName
        this.attachmentIds = data.attachmentIds
        this.remark = data.remark
        let sourceNames = JSON.parse(data.sourceNames)
        let modelUrls = JSON.parse(data.modelUrls)
        this.drawings = {
          name: sourceNames[0],
          imgSrc: modelUrls[0]
        }
      })
    },
    // 取消
    handleCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.preview-img {
  width: 1060px;
  height: 800px;
  object-fit: contain;
  border: solid 1px #e5e5e5;
}
</style>

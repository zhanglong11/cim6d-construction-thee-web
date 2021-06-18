<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-form label-width="140px">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label="图纸名称：">{{ drawingsName }}</el-form-item>
            <el-form-item label="图纸：">
              <div v-for="(item, index) in drawingsList" :key="index">
                <a @click="showDrawing(item)">{{ item.name }}</a>
              </div>
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
    <!-- 图纸预览模态框 start -->
    <ModalDrawings :imgSrc="imgSrc" :visible.sync="visible" />
    <!-- 图纸预览模态框 end -->
  </div>
</template>

<script>
import { getDrawingsDetail } from '../api'
import ModalDrawings from './ModalDrawings'
export default {
  components: { ModalDrawings },
  data() {
    return {
      id: this.$route.params.id || '',
      drawingsName: '',
      drawingsList: [],
      attachmentIds: '',
      remark: '',
      imgSrc: '',
      visible: false
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
        for (let i = 0; i < sourceNames.length; i++) {
          this.drawingsList.push({
            name: sourceNames[i],
            imgSrc: modelUrls[i]
          })
        }
      })
    },
    // 取消
    handleCancel() {
      this.$router.back()
    },
    // 图纸预览
    showDrawing(item) {
      this.visible = true
      this.imgSrc = ''
      this.imgSrc = item.imgSrc
    }
  }
}
</script>

<style lang="less" scoped></style>

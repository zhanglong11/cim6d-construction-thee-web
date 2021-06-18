<template>
  <el-dialog title="安全教育视频详情" :visible="visible" width="600px" @close="handleCancel">
    <div class="details">
      <div class="details-list">
        <div class="detail-info">
          <el-row>
            <el-col :md="24">
              <span class="label">视频名称</span>
              <span class="label-content">{{ detailInfo.videoName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">视频上传</span>
              <div class="label-content" style="display: inline-block; vertical-align: top">
                <FileEdits :ids="detailInfo.attachment" />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">创建人</span>
              <span class="label-content">{{ detailInfo.creatorName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">创建时间</span>
              <span class="label-content">{{ detailInfo.createTime }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">是否默认</span>
              <span class="label-content">{{ detailInfo.defaultFlag === true ? '是' : '否' }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
import FileEdits from './FileEdits'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EducationDetail',
  components: { FileEdits },
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      detailInfo: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getManageRegimeDetail()
    }
  },
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 获取详情
    getManageRegimeDetail() {
      Api.getEducationDetail(this.id).then(res => {
        this.detailInfo = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.details {
  font-size: 14px;
  .el-col {
    display: flex;
  }
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #999;
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .label-content {
    margin-bottom: 15px;
    flex: 1;
  }
  .details-list {
    border: 1px solid rgba(193, 193, 193, 0.57);
    margin-bottom: 10px;
    padding: 10px 0;
    span {
      display: inline-block;
      margin-left: 10px;
    }
  }

  .detail-info {
    max-height: 340px;
    overflow-y: auto;
    padding: 0px 10px;
  }
}
/deep/.el-dialog__body {
  padding: 20px 20px 30px 20px;
}
</style>

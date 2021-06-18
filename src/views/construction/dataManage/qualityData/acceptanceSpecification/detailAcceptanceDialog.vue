<template>
  <el-dialog title="详情" :visible="visible" width="600px" @close="handleCancel">
    <div class="details">
      <div class="details-list">
        <h4 class="detail-title"><span>验收规范信息</span></h4>
        <div class="detail-info">
          <el-row>
            <el-col :md="24">
              <span class="label">规范编号</span>
              <span class="label-content">{{ detailInfo.specificationNumber }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">规范名称</span>
              <span class="label-content">{{ detailInfo.specificationName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">类别</span>
              <span class="label-content">{{ $getLabel(norm, detailInfo.category) }}</span>
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
              <span class="label">附件</span>
              <div class="label-content" style="display: inline-block; vertical-align: top">
                <FileList :ids="detailInfo.contentFileIds" />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :md="24">
              <span class="label">备注</span>
              <span class="label-content">{{ detailInfo.remark }}</span>
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
import Api from '../../api/index'
import norm from './lib/norm'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'DetailAcceptanceDialog',
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      norm,
      detailInfo: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    if (this.id) {
      this.getCheckSpecificDetail()
    }
  },
  // 方法集合
  methods: {
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 获取验收规范详情
    getCheckSpecificDetail() {
      Api.getCheckSpecificDetail(this.id).then(res => {
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
    color: #ccc;
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
  .detail-title {
    font-size: 16px;
    font-weight: 600;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(193, 193, 193, 0.57);
    margin-bottom: 10px;
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

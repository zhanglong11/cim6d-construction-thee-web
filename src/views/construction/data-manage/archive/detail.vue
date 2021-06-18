<template>
  <div class="container no-padding is-footer">
    <div class="innerContainer">
      <el-card class="box-card" style="margin-top: 20px">
        <div slot="header" class="clearfix details-header">
          <span class="details-title">归档资料</span>
        </div>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">归档文件名称：</div>
              <div class="lrCellValue">{{ info.name }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">所属模块：</div>
              <div class="lrCellValue">{{ $getLabel(archiveTypeList, info.module) }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" style="margin-top: 20px">
        <div slot="header" class="clearfix details-header">
          <span class="details-title">资料目录</span>
        </div>
        <div>
          <vxe-table ref="xTable" :data="info.fileDTOList">
            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
            <vxe-table-column field="fileName" title="文件名称" />
            <vxe-table-column field="createTime" title="上传时间" />
            <!--    <vxe-table-column field="remark" title="备注"></vxe-table-column>-->
            <vxe-table-column label="操作" width="400" fixed="right" align="center">
              <template #default="{ row }">
                <PreviewByFileId :fileId="row.id" title="查看" />
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api'
export default {
  name: 'DataArchiveDetail',
  components: {},
  data() {
    return {
      id: this.$route.params.id || '',
      info: {}
    }
  },
  computed: {
    //所属模块
    archiveTypeList() {
      return this.$getArgList('pigeonhole') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    // 获取详情
    async getDetail() {
      let res = await Api.getDetail(this.id)
      let datas = res.data
      this.info = datas
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.innerContainer {
  padding: 40px 20px;
}
.infoWrapper {
  padding: 10px 40px;
  max-width: 60%;
}
.rowLine {
  margin-bottom: 10px;
}
.lrCellInfo {
  display: flex;
  align-items: flex-start;
  padding: 2px 10px 2px 0;
  min-height: 30px;
  font-size: 16px;
  .lrCellLabel {
    color: #cccccc;
    margin-right: 10px;
    min-width: 130px;
    text-align: right;
  }
  .lrCellValue {
    flex: 1;
  }
}
</style>

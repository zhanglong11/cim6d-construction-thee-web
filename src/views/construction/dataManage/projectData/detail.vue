<template>
  <div class="no-padding">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ detailInfo.name }}</span>
        <el-button
          type="primary"
          size="mini"
          @click="
            $router.push({
              path: `/dataManage/projectDataEdit?id=${id}`
            })
          "
          >编辑</el-button
        >
      </div>
      <div class="details">
        <el-row>
          <el-col :md="8">
            <p class="label">资料名称</p>
            <p class="label-content">{{ detailInfo.name }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="label">资料分类</p>
            <p class="label-content">{{ $getLabelFromArg('informationType', detailInfo.informationType) }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="label">资料描述</p>
            <p class="label-content">{{ detailInfo.desp }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <p class="label">资料备注</p>
            <p class="label-content">{{ detailInfo.remark }}</p>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">资料目录</span>
      </div>
      <div>
        <vxe-table ref="xTable" :data="tableData">
          <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
          <vxe-table-column field="fileName" title="文件名称" />
          <vxe-table-column field="createTime" title="上传时间" />
          <vxe-table-column field="remark" title="备注"></vxe-table-column>
          <vxe-table-column title="操作" fixed="right" align="center">
            <template #default="{ row }">
              <PreviewByFileId :fileId="row.fileId" :fileName="row.fileName"></PreviewByFileId>
              <DownloadByFileId :fileId="row.fileId" :fileName="row.fileName" title="下载" />
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="handleBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api/index'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'ProjectDataDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      tableData: [],
      detailInfo: {}
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getProjectDataDetail(this.id)
  },
  // 方法集合
  methods: {
    // 返回
    handleBack() {
      this.$router.push({ name: 'ProjectDataList' })
    },
    // 获取项目资料详情
    getProjectDataDetail(id) {
      Api.getProjectDataDetail(id).then(res => {
        this.detailInfo = res.data
        this.tableData = res.data.fileList
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
}
</style>

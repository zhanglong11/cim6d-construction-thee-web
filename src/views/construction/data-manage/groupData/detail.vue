<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ info.name }}</span>
        <el-button
          type="primary"
          size="mini"
          @click="
            $router.push({
              path: `/data-manage/group-data-edit/${id}`
            })
          "
          >编辑</el-button
        >
      </div>
      <div class="details">
        <el-row>
          <el-col :md="6">
            <p class="label">资料名称</p>
            <p class="title">{{ info.name }}</p>
          </el-col>
          <el-col :md="6">
            <p class="label">单位类型</p>
            <p class="title">{{ $getLabelFromArg('corpCategory', info.corpCategory) }}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <span class="label">描述</span>
            <span>{{ info.desp }}</span>
          </el-col>
          <el-col :md="16">
            <span class="label">备注</span>
            <span>{{ info.remark }}</span>
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
          <vxe-table-column label="操作" title="400" fixed="right" align="center">
            <template #default="{ row }">
              <DownloadByFileId :fileId="row.fileId" :fileName="row.fileName" title="下载" />
            </template>
          </vxe-table-column>
        </vxe-table>
        <!--<div class="pagination">
          <p class="total">
            共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
            <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
          </p>
          <el-pagination
            background
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            :current-page="queryForm.page"
            :page-size="queryForm.rows"
            :page-sizes="$pageConfig.pageSizes"
            @size-change="changePageSize"
            @current-change="changePageNumber"
          />
        </div>-->
      </div>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '../api/work-bench'
export default {
  name: 'GroupDataDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id,
      info: {},
      tableData: []
    }
  },
  computed: {
    corpCategoryList() {
      return this.$getArgList('corpCategory') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getGroupDataDetail()
  },
  // 方法集合
  methods: {
    //获取详情
    async getGroupDataDetail() {
      const res = await Api.getDataDetail(this.id)
      this.info = res.data
      this.tableData = res.data.fileList
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.details {
  font-size: 14px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
  }
  .title {
    margin-bottom: 30px;
    font-size: 16px;
  }
  .status {
    display: flex;
    align-items: center;
    font-size: 14px;
    i {
      margin-right: 6px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00cc00;
    }
    &.status-2 i {
      background: #999;
    }
    &.status-3 i {
      background: #ff9900;
    }
  }
  .upload-con {
    display: flex;
    .upload-list {
      margin-bottom: 10px;
    }
  }
}
</style>

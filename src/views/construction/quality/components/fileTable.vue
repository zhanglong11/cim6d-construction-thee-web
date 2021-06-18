<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>附件</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <div style="max-width: 1200px">
      <el-table :data="copyTableData">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column show-overflow-tooltip prop="fileName" label="附件名称" width="240"> </el-table-column>
        <el-table-column prop="createTime" label="上传时间" width="180"> </el-table-column>
        <el-table-column prop="creatorName" label="上传人" width="180"> </el-table-column>
        <el-table-column prop="address" label="操作" width="180">
          <template slot-scope="scope">
            <Preview :file="{ fileUrl: scope.row.fileUrl, id: scope.row.id }" style="margin-right: 5px"></Preview>
            <Download :file="{ name: scope.row.fileName, id: scope.row.id }"></Download>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
import api from '@/api/file'
export default {
  name: 'DetailItem',
  components: {},
  props: {
    ids: {
      type: String,
      default: ''
    },
    isFileIds: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      copyTableData: [...this.tableData]
    }
  },
  watch: {
    ids: {
      immediate: true,
      handler(val) {
        if (this.isFileIds) {
          this.getFileList()
        }
      }
    },
    tableData: {
      immediate: true,
      handler(val) {
        this.copyTableData = [...this.tableData]
      }
    }
  },
  created() {},
  methods: {
    //获取文件列表
    async getFileList() {
      let arr = this.ids ? this.ids.split(',') : []
      if (!arr.length) return
      let fileRes = await api.getFileList(arr)
      this.copyTableData = fileRes.data || []
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-card__header {
  padding: 2px 10px;
  min-height: 30px;
}
</style>

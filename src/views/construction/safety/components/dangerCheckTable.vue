<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>危险源检查情况</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <div>
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" width="80" label="序号"> </el-table-column>
        <el-table-column prop="name" label="所在位置" width="250"> </el-table-column>
        <el-table-column prop="name" label="危险源时效性" align="center" min-width="250">
          <template slot-scope="scope">
            <span>{{ `2020-05-01~2020-05-31` }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="责任人" align="center" width="200"> 张三疯 </el-table-column>
        <el-table-column prop="name" label="检查时间" align="center" width="200"> '2020-08-08' </el-table-column>
        <el-table-column prop="address" label="状态">
          <template slot-scope="scope">
            {{ $getLabel(statusList, row.scope - 0) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>
<script>
import Api from '../api'
import statusList from '../lib/issueStatusList'
export default {
  name: 'DangerLocation',
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      statusList,
      tableData: []
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      //let res = await Api.getPlanDetail(this.id)
      //this.tableData = [{ id: 1, name: '222' }]
    },
    //点击添加按钮
    handleAddIssue() {
      this.tableData.push({})
    },
    //删除一行
    handleDelete(index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>

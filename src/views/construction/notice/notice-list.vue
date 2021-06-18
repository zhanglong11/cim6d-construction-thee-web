<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.cateogry" clearable placeholder="公告类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.desc" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.title" style="width: 360px" placeholder="公告标题" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('AddNotice')" type="primary" icon="el-icon-plus" @click="addItem()"
            >新建公告</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="title" label="公告标题" min-width="140px" />
      <el-table-column prop="cateogry" label="类型" min-width="140px">
        <span slot-scope="scope">
          {{ $enum.getDescByValue('NOTICE_TYPE', scope.row.cateogry) }}
        </span>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" min-width="140px" />
      <el-table-column prop="creatorName" label="发布人" min-width="140px" />
      <el-table-column prop="name" label="状态" min-width="140px">
        <template slot-scope="scope">
          <el-switch :value="scope.row.status === 1" disabled />
          {{ scope.row.status === 1 ? '已读' : '未读' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('DetailsNotice')" type="text" size="mini" @click="toDetails(scope.row.id)"
            >查看</el-button
          >
          <el-button v-if="$hasPower('EditNotice')" type="text" size="mini" @click="editItem(scope.row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('NoticeListRemove')" type="text" size="mini" @click="deleteItem(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>
  </div>
</template>

<script>
import { noticeApi } from './api/notice'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'NoticeList',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 公告类型下拉框数据
      typeList: this.$enum.getValueDescList('NOTICE_TYPE'),
      queryForm: {
        // 查询条件
        classification: 2,
        cateogry: '',
        title: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      const result = await noticeApi.queryListNotice(this.queryForm)
      const datas = result.data
      const list = datas.records || []
      this.total = datas.total
      list.map((item, index) => {
        item.receiverName = ''
        // this.getUserInfo(item.receiverId, index)
      })
      this.dataList = list
    },
    // 查询用户详情
    async getUserInfo(id, index) {
      const result = await noticeApi.getUserInfo(id)
      const datas = result.data
      this.dataList[index].receiverName = datas.nickName
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.rows = pageSize
      this.queryList()
    },
    // 查看详情
    toDetails(id) {
      this.$router.push({
        path: `/notice/notice-details/${id}`
      })
    },
    // 新建公告
    addItem() {
      this.$router.push({
        path: '/notice/add-notice'
      })
    },
    // 编辑公告
    editItem(id) {
      this.$router.push({
        path: `/notice/edit-notice?id=${id}`
      })
    },
    // 删除公告
    deleteItem(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItemSuccess(id)
        })
        .catch(() => {})
    },
    // 删除项目 - 异步
    async deleteItemSuccess(id) {
      await noticeApi.deleteNotice(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
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
</style>

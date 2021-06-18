<template>
  <div>
    <div class="tooltips">
      <el-form inline @submit.native.prevent>
        <el-form-item label="产品名称">
          <el-input
            v-model="filterForm.name"
            style="width: 300px"
            placeholder="请输入"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="$hasPower('NewProduct')"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('product/new')"
          >创建产品</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column field="name" title="产品名称"></vxe-table-column>
      <vxe-table-column field="productKey" title="ProductKey"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="节点类型"
        :formatter="({ cellValue }) => $getLabel(productTypeList, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="createTime" title="添加时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('ProductDetail')" type="text" @click="$router.push('productDetail?id=' + row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('DeviceDetailManage')"
            type="text"
            @click="$router.push('device?productId=' + row.id)"
            >管理设备</el-button
          >
          <el-button v-if="$hasPower('ProductRemove')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import productTypeList from '../lib/productTypeList'
import Api from '../api/iot-api'
export default {
  name: 'Product',
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      productTypeList,
      request(body) {
        return Api.getIotProductList(body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(idList => {
        return Api.deleteIotProduct(idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>

<template>
  <el-dialog :visible="visible" title="添加设备" width="920px" @close="close">
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="产品名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid
      ref="table"
      :request="request"
      :filter-form.sync="filterForm"
      @checkboxChange="({ selection }) => (selectedList = selection)"
    >
      <vxe-table-column type="checkbox" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="productName" title="设备所属产品"></vxe-table-column>
      <vxe-table-column field="status" title="状态" width="120px">
        <template #default="{ row }">
          <Status :value="row.status"></Status>
        </template>
      </vxe-table-column>
      <vxe-table-column field="lastAccessTime" title="最后上线时间" width="180px"></vxe-table-column>
    </Grid>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!selectedList.length" @click="submit">添加</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../api/iot-api'
export default {
  name: 'Edit',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      filterForm: {},
      request(body) {
        return Api.getIotDeviceList(body)
      },
      selectedList: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {},
  methods: {
    submit() {
      Api.bindGroupDevice(
        this.id,
        this.selectedList.map(e => e.id)
      ).then(res => {
        this.$message.success('添加成功')
        this.close()
        this.$parent.refresh()
      })
    },
    close() {
      this.selectedList = []
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less"></style>

<template>
  <el-dialog :visible="visible" title="规则复制" width="620px" @close="close">
    <div class="tooltips">
      <el-form inline @submit.native.prevent>
        <el-form-item label="设备名称">
          <el-input v-model="filterForm.name" @keyup.native.enter="refresh"></el-input>
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
      :immediate="false"
      @checkboxChange="({ selection }) => (selectedList = selection)"
    >
      <vxe-table-column type="checkbox" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="设备名称"></vxe-table-column>
      <vxe-table-column field="productName" title="产品名称"></vxe-table-column>
    </Grid>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :disabled="!selectedList.length" :loading="btnSubmitLoading" @click="submit"
        >复制</el-button
      >
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../api/iot-api'
export default {
  name: 'CopyRule',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    device: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      filterForm: {},
      request: body => {
        return Api.getIotDeviceList({ ...body, productId: this.device.productId }).then(res => {
          res.data.records = res.data.records.filter(e => e.id !== this.device.id)
          return res
        })
      },
      selectedList: [],
      btnSubmitLoading: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick().then(() => {
          this.refresh()
        })
      }
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    submit() {
      this.btnSubmitLoading = true
      Api.cloneIotDeviceWarningRule(
        this.device.id,
        this.selectedList.map(e => e.id)
      ).then(res => {
        this.btnSubmitLoading = false
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

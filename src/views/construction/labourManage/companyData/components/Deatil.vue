<template>
  <el-dialog class="beauty" title="查看公司详情" :visible="visible" width="800px" @close="close">
    <div class="dialog-header">
      <div class="dialog-content">
        <!-- <span class="dia-sp">项目基本情况</span> -->
        <el-row :gutter="4">
          <el-col :span="12">
            <span class="desc-label">公司名称:</span>
            <span>{{ form.name }}</span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label">公司类型:</span>
            <span><SelectArg v-model="form.type" arg-group="labourCompanyType" disabled></SelectArg></span>
          </el-col>
          <el-col :span="12">
            <span class="desc-label" style="margin-bottom: 16px; vertical-align: middle">负责人姓名:</span>
            <span style="width: 100px; display: inline-block">
              <SelectUser
                v-model="form.principal"
                value-format="id"
                :multiple="false"
                :name.sync="form.principalName"
                disabled
              ></SelectUser>
            </span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">负责人联系方式:</span>
            <span>{{ form.principalMobile }}</span>
          </el-col>
          <el-col :span="24">
            <span class="desc-label">每月工资发放日期:</span>
            <span>{{ form.payoffTime }}日</span>
          </el-col>
        </el-row>
      </div>
      <div class="dialog-content2" style="margin-top: 20px">
        <span class="dia-sp">关联班组</span>
        <div class="tab" style="padding-left: 20px; padding-top: 20px">
          <el-table
            :data="form.groupList"
            border
            :header-cell-style="{ textAlign: 'center', background: '#fff' }"
            :cell-style="{ 'text-align': 'center' }"
            style="width: 100%"
          >
            <el-table-column prop="name" label="班组名称" width="180"> </el-table-column>
            <el-table-column prop="principal" label="班组负责人" width="180"> </el-table-column>
            <el-table-column prop="principalMobile" label="班组负责人联系方式"> </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <footer slot="footer">
      <el-button type="primary" @click="close">取消</el-button>
    </footer>
  </el-dialog>
</template>
<script>
import api from '../../api/labour-api'
export default {
  name: 'CompanyDetail',
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      //表单数据
      form: {},
      //关联班组信息
      groupList: []
    }
  },
  watch: {
    async visible(val) {
      if (val) {
        if (this.id) {
          this.form = await api.getLabourCompanyDetail(this.id).then(res => res.data)
        } else {
          this.form = {}
        }
      }
    }
  },
  methods: {
    refresh() {},
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
.dia-sp {
  font-size: 16px;
}
.desc-label {
  width: 128px;
  text-align: left;
  margin-right: 20px;
  display: inline-block;
}
.desc-label span {
  text-align: left;
}
.el-col {
  padding-top: 10px;
}
</style>

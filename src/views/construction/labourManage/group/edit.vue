<template>
  <div style="background-color: unset; width: 1130px; margin: 0 auto">
    <el-card>
      <div slot="header" class="card-header">
        <span>{{ $route.meta.title }}</span>
      </div>
      <el-form ref="form" :model="form" style="width: 650px; margin-left: 100px" :rules="rules" label-width="120px">
        <el-form-item label="所属劳务公司" prop="labourCompanyId">
          <el-select v-model="form.labourCompanyId" style="width: 100%">
            <el-option v-for="e in companyList" :key="e.id" :label="e.name" :value="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入班组名称"></el-input>
        </el-form-item>
        <el-form-item label="责任负责人" prop="principal">
          <SelectUser
            v-model="form.principal"
            value-format="id"
            :multiple="false"
            :name.sync="form.principalName"
            placeholder="请选择"
            @update:mobile="handmobile"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="联系电话" prop="principalMobile">
          <el-input v-model="form.principalMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入备注信息"
            type="textarea"
            :autosize="{ minRows: 3 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="footer-divide">
      <el-button size="medium" @click="$router.back()">取消</el-button>
      <el-button size="medium" type="primary" :loading="btnSaveLoading" @click="submit">{{
        id ? '保存' : '创建'
      }}</el-button>
    </div>
  </div>
</template>

<script>
import regular from '@/utils/regular'
import Api from '../api/labour-api'
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        name: [{ required: true, message: '必填' }],
        labourCompanyId: [{ required: true, message: '必填' }],
        principal: [{ required: true, message: '必填' }],
        principalMobile: [{ pattern: regular.phone, message: '手机号不合法' }]
      },
      companyList: [],
      btnSaveLoading: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    'form.principal'(val) {
      if (!val) {
        this.form.principalMobile = ''
      }
    }
  },
  created() {
    if (this.id) {
      Api.getLabourGroupDetail(this.id).then(res => {
        this.form = res.data
      })
    }
    this.getCompanyList()
  },
  methods: {
    handmobile(val) {
      this.form.principalMobile = val
    },
    async getCompanyList() {
      this.companyList = await Api.getLabourCompanyList({
        page: 1,
        rows: 10000,
        projectId: localStorage.getItem('projectId')
      }).then(res => res.data.records)
    },
    async submit() {
      await this.$refs.form.validate()
      this.btnSaveLoading = true
      if (this.id) {
        Api.updateLabourGroup(this.form).then(res => {
          this.btnSaveLoading = false
          this.$message.success('编辑成功')
          this.$router.back()
        })
      } else {
        Api.addLabourGroup(this.form).then(res => {
          this.btnSaveLoading = false
          this.$message.success('新建成功')
          this.$router.back()
        })
      }
    },
    addType() {
      this.$prompt('请输入类型名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{2}/,
        inputErrorMessage: '最小长度2'
      }).then(({ value }) => {
        this.getCompanyList()
      })
    }
  }
}
</script>

<style scoped lang="less">
.add-button {
  position: absolute;
  left: 100%;
  width: 50px;
  display: block;
  top: 0;
  margin-left: 15px;
}
.el-card {
  overflow: visible;
}
</style>

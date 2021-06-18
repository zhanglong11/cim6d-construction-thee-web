<template>
  <div class="main">
    <el-card>
      <div class="tooltips">
        <el-form inline>
          <div class="header-left">
            <el-form-item label="企业名称">
              <el-input v-model.trim="filterForm.name" autocomplete="off" placeholder="请输入企业名称" />
            </el-form-item>
            <el-form-item label="企业法人">
              <el-input v-model.trim="filterForm.legalPerson" autocomplete="off" placeholder="请输入企业法人" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="refresh">查 询</el-button>
              <el-button icon="el-icon-refresh" @click="reset">重 置</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-button v-if="$hasPower('CompanyManageAdd')" type="primary" icon="el-icon-plus" @click="visible = true"
          >添 加</el-button
        >
      </div>

      <Grid ref="table" :request="request" :filter-form.sync="filterForm">
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="unifiedSocialCreditCode" title="统一社会信用代码" width="180" />
        <vxe-table-column field="name" title="企业名称" min-width="150"> </vxe-table-column>
        <vxe-table-column field="legalPerson" title="企业法人" min-width="150" />
        <vxe-table-column field="createTime" title="创建时间" min-width="150" />
        <vxe-table-column v-if="$hasPower('CompanyManageRemove')" title="操作">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="remove(row)">删除</el-button>
          </template>
        </vxe-table-column>
      </Grid>
    </el-card>
    <el-dialog width="550px" title="新建企业" :visible.sync="visible" @close="close">
      <el-form ref="form" :rules="rules" :model="form" label-width="140px">
        <el-form-item label="统一社会信用代码" prop="unifiedSocialCreditCode">
          <el-input v-model="form.unifiedSocialCreditCode"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name" :disabled="unifiedSocialCreditCodeMatched"></el-input>
        </el-form-item>
        <el-form-item label="企业法人" prop="legalPerson">
          <el-input v-model="form.legalPerson" :disabled="unifiedSocialCreditCodeMatched"></el-input>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">创建</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import companyAPI from '../api/company'
import anyRule from '@/lib/anyRule'

export default {
  data() {
    return {
      actionType: null, // 批量操作的类型
      selectedItem: [],
      filterForm: {},
      visible: false,
      request(body) {
        return companyAPI.getCompanyList(body)
      },
      form: {
        unifiedSocialCreditCode: '',
        name: '',
        legalPerson: ''
      },
      rules: {
        unifiedSocialCreditCode: [
          { required: true, message: '必填' },
          { pattern: anyRule.unifiedSocialCreditCode, message: '请输入合法的统一社会信用代码' }
        ],
        name: [{ required: true, message: '必填' }],
        legalPerson: [{ required: true, message: '必填' }]
      },
      // 是否通过社会信用码匹配到了信息
      unifiedSocialCreditCodeMatched: true
    }
  },
  watch: {
    'form.unifiedSocialCreditCode'(val) {
      if (anyRule.unifiedSocialCreditCode.test(val)) {
        companyAPI.getCompanyInfoByCode(val).then(res => {
          this.unifiedSocialCreditCodeMatched = !!res.data
          if (this.unifiedSocialCreditCodeMatched) {
            if (res.data?.name) this.form.name = res.data.name
            if (res.data?.legalPerson) this.form.legalPerson = res.data.legalPerson
            if (res.data?.id) this.form.companyId = res.data.id
          } else {
            this.form.name = ''
            this.form.legalPerson = ''
            this.form.companyId = ''
          }
        })
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    // 重置请求参数，重新请求表格数据
    reset() {
      this.$refs.table.reset()
    },
    async submit() {
      await this.$refs.form.validate()
      await companyAPI.saveCompanyRelation(this.form)
      this.$refs.form.resetFields()
      this.$message.success('创建成功')
      this.visible = false
      this.refresh()
    },
    // 批量删除
    async remove(row) {
      await this.$tipRemove([row])
      await companyAPI.removeCompanyRelation(row.id)
      await this.$message.success('删除成功')
      this.refresh()
    },
    close() {
      this.visible = false
      this.$refs.form.resetFields()
      this.unifiedSocialCreditCodeMatched = true
      this.form.companyId = null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.el-header {
  height: auto !important;
  .el-form {
    display: flex;
    justify-content: space-between;
  }
}
.active-name {
  cursor: pointer;
  color: $menuActiveText;
}
</style>

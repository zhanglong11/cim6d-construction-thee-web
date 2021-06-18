<template>
  <div>
    <el-dialog title="新增自定义表单" class="form-dialog" :visible="visible" @close="handleCancel">
      <div class="container">
        <el-form ref="formRef" label-width="80px">
          <el-form-item label="表单类型">
            <el-radio-group v-model="formType">
              <el-radio :label="1">需审批表单</el-radio>
              <el-radio :label="2">无审批表单</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="model-list">
            <h4>复制现有表单为模板</h4>
            <ul>
              <li :class="{ 'add-class': isActive === '' }" @click="noTemplate()">
                <div class="list">
                  <div class="left-img">
                    <img src="../images/no-temp.png" alt="" />
                  </div>
                  <div class="right-word">
                    <p>不使用模板</p>
                  </div>
                </div>
              </li>
              <li
                v-for="(item, index) in companyModelList"
                :key="item.name"
                :class="{ 'add-class': isActive === index }"
                @click="handleCompanyModelList(item, index)"
              >
                <div class="list">
                  <div class="left-img">
                    <el-image style="width: 100%; height: 100%" :src="item.icon" fit="fill"></el-image>
                  </div>
                  <div class="right-word">
                    <p class="description">{{ item.name }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </span>
    </el-dialog>
    <!-- <SetCustomFormDialog v-if="setCustomFormVisible" :visible.sync="setCustomFormVisible"></SetCustomFormDialog> -->
  </div>
</template>

<script>
import { OaApi } from '../api'
// import SetCustomFormDialog from './SetCustomFormDialog'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'AddRecordDialog',
  components: {
    // SetCustomFormDialog
  },
  props: {
    visible: Boolean,
    id: String
  },
  // 这里存放数据
  data() {
    return {
      setCustomFormVisible: false,
      form: {
        formType: '1'
      },
      projectId: this.$store.state.project.projectId,
      isActive: '',
      isCompanyActive: '',
      list: [], //当前项目模板
      companyModelList: [], //企业级项目模板
      formType: 1,
      formId: ''
    }
  },
  computed: {
    companyId() {
      return this.$store.getters.companyId
    }
  },
  mounted() {
    this.queryList()
  },
  // 方法集合
  methods: {
    async queryList() {
      let params = {
        flag: 1,
        page: 1,
        rows: 1000,
        status: 1,
        companyId: this.companyId
      }
      let result = await OaApi.queryFormList(params)
      let datas = result.data
      let list = datas.records || []
      this.companyModelList = list
    },
    // 不适用模板
    noTemplate() {
      this.isActive = ''
      this.formId = ''
    },
    // 选择模板
    handleCompanyModelList(item, index) {
      this.isActive = index
      this.formId = item.id
      this.formType = item.formType
    },
    // 取消
    handleCancel() {
      this.$emit('update:visible', false)
    },
    // 保存
    async handleSave() {
      this.handleCancel()
      this.$router.push({
        name: this.formId ? 'CompanyEditForm' : 'CompanyAddForm',
        query: {
          formType: this.formType,
          id: this.formId,
          isCopy: true
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/styles/common');
.form-dialog {
  /deep/.el-dialog__body {
    height: 60vh;
    .el-form {
      height: 100%;
      display: flex;
      flex-direction: column;
      .model-list {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}
.container {
  height: 100%;
  .form-title {
    margin-top: 10px;
  }
  .config-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: row;
    li {
      display: inline-block;
      margin: 10px 20px 10px 0;
      width: 30%;
      padding: 10px;
      box-shadow: 2px 2px 5px #bac9e3;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      .list {
        display: flex;
        align-items: center;
        .left-img {
          width: 60px;
          height: 60px;
          img {
            width: 100%;
          }
        }
        .right-word {
          margin-left: 8px;
          flex: 1;
          overflow: hidden;
          p:last-child {
            font-size: 13px;
            color: #68758a;
            margin-top: 3px;
          }
          .description {
            max-height: 40px;
            line-height: 20px;
            .ellipsis;
            white-space: initial;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
    }
    .add-class {
      border: 1px solid #eb4435;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
.model-list {
  margin-left: 15px;
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
  }
  h4 {
    font-weight: normal;
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>

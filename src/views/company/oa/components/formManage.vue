<template>
  <div class="container">
    <el-button v-if="$hasPower('AddGroup')" type="primary" icon="el-icon-plus" @click="addGroup()">新增分组</el-button>
    <el-card v-if="menuList && menuList.length" class="box-card">
      <div class="config-list">
        <div class="edit-btn">
          <el-button v-if="$hasPower('CompanyAddForm')" type="primary" icon="el-icon-plus" @click="addCustomForm"
            >新增自定义表单</el-button
          >
          <el-button
            v-if="$hasPower('CompanyEditForm')"
            :type="customFormEdit ? 'danger' : 'primary'"
            icon="el-icon-setting"
            @click="customFormEdit = !customFormEdit"
            >{{ customFormEdit ? '退出编辑模式' : '管理自定义表单' }}</el-button
          >
        </div>
      </div>
      <div v-for="(items, index) in menuList" :key="index" class="menu-list">
        <h4 class="form-title">
          <span>{{ items.name }}</span>
          <div v-if="customFormEdit" class="form-edit-btn">
            <el-button
              v-if="$hasPower('DeleteFormGroup') && !items.children.length"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteFormGroup(items)"
              >删除分组</el-button
            >
            <el-button
              v-if="$hasPower('EditGroup')"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editGroup(items)"
              >编辑分组</el-button
            >
          </div>
        </h4>
        <ul>
          <li v-for="item in items.children" :key="item.name">
            <div v-if="items.flag === 1">
              <template v-if="!item.status">
                <span class="circle draft"></span>
                <span class="sign draft">草稿</span>
              </template>
              <!-- <template v-else>
                <span class="circle" :class="item.projectId ? 'blue' : 'company'"></span
                ><span class="sign">{{ !item.projectId ? '企业' : '项目' }}</span>
              </template> -->
            </div>
            <div v-if="item.formType === 1">
              <span class="approval-square">1</span><span class="approval-sign">需审批</span>
            </div>
            <div class="list">
              <div class="left-img">
                <el-image style="width: 100%; height: 100%" :src="item.icon" fit="fill"></el-image>
              </div>
              <div class="right-word">
                <p class="title">
                  <span class="title-name">{{ item.name }} </span>
                  <template v-if="item.editFlag === 1 && (customFormEdit || !item.status)">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click.stop="editForm(item)"></el-button>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click.stop="deleteForm(item)"></el-button>
                  </template>
                </p>
                <el-tooltip v-if="item.description" :content="item.description" placement="bottom">
                  <p class="description">{{ item.description }}</p>
                </el-tooltip>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
    <EditFormGroup :visible.sync="editModal" :modalParams="editModalParams" @change="changeEditModal" />
    <addCustomForm v-if="addCustomFormVisible" :visible.sync="addCustomFormVisible"></addCustomForm>
  </div>
</template>

<script>
import { OaApi } from '../api'
import EditFormGroup from './editFormGroup'
import addCustomForm from './addCustomFormDialog'
export default {
  name: 'FormManage',
  components: {
    EditFormGroup,
    addCustomForm
  },
  data() {
    return {
      addCustomFormVisible: false,
      editModal: false,
      editModalParams: {
        title: '',
        isEdit: false,
        data: ''
      },
      queryData: {
        name: '',
        flag: 1,
        projectType: ''
      },
      menuList: [],
      customFormEdit: false
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    // 查询列表
    async queryList() {
      const result = await OaApi.queryFormGroupList(this.queryData)
      const datas = result.data || []
      console.log('查询表单及列表', datas)
      this.menuList = datas
    },
    addCustomForm() {
      this.addCustomFormVisible = true
    },
    // 编辑分组
    addGroup() {
      this.editModalParams.title = '新增分组'
      this.editModalParams.isEdit = false
      this.editModalParams.data = ''
      this.editModal = true
    },
    // 编辑分组
    editGroup(item) {
      this.editModalParams.title = '编辑分组'
      this.editModalParams.isEdit = true
      this.editModalParams.data = item
      this.editModal = true
    },
    // 删除分组
    deleteFormGroup(item) {
      let msg = `确定要删除 <b>${item.name}</b> 分组吗？`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.deleteFormGroupSuccess(item.id)
        })
        .catch(() => {})
    },
    // 删除模板 - 异步
    async deleteFormGroupSuccess(id) {
      await OaApi.deleteFormGroup(id)
      this.$message({
        type: 'success',
        message: '操作成功!'
      })
      this.queryList()
    },
    // 保存成功
    changeEditModal() {
      this.editModal = false
      this.queryList()
    },
    // 编辑表单
    editForm(item) {
      console.log(444444, item)
      this.$router.push({
        name: 'CompanyEditForm',
        query: {
          id: item.id,
          formType: 1
        }
      })
    },
    // 删除表单
    deleteForm(item) {
      let msg = `确定要删除 <b>${item.name}</b> 表单吗？`
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          this.deleteFormSuccess(item.id)
        })
        .catch(() => {})
    },
    // 删除表单 - 异步
    async deleteFormSuccess(id) {
      await OaApi.deleteForm(id)
      this.$message({
        type: 'success',
        message: `操作成功!`
      })
      this.queryList()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
.menu-mask {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
  top: 0;
  left: 0;
}
.container {
  .box-card {
    margin-top: 15px;
  }
  .form-title {
    margin-top: 10px;
    display: flex;
    align-items: center;
    .form-edit-btn {
      margin-left: 10px;
    }
  }
  .config-list {
    position: relative;
    .edit-btn {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
    }
  }
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: row;
    li {
      display: inline-block;
      margin: 10px 30px 10px 0;
      width: 18%;
      min-width: 290px;
      max-width: 100%;
      padding: 20px;
      box-shadow: 2px 2px 5px #bac9e3;
      border-radius: 5px;
      position: relative;
      overflow: hidden;
      background: #fff;
      transition: all 0.2s;
      &:hover {
        transform: scale(1.05);
        box-shadow: 1px 1px 5px #bac9e3;
      }
      .circle {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(to right, #38b44c, #38b44c);
        position: absolute;
        top: -21px;
        left: -11px;
        &.draft {
          border-radius: 5px 0 5px 0;
          top: 0;
          left: 0;
          height: 19px;
          text-align: center;
        }
      }
      .company {
        background: linear-gradient(to right, #ff7272, #eb4435);
      }
      .blue {
        background: linear-gradient(to right, #55a3ff, #1558d6);
      }
      .sign {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        position: absolute;
        top: 0;
        left: 0;
        &.draft {
          width: 40px;
          text-align: center;
        }
      }
      .approval-square {
        display: inline-block;
        width: 60px;
        height: 40px;
        background: linear-gradient(to right, #ff8972, #fdd122);
        position: absolute;
        top: -12px;
        right: -23px;
        transform: rotate(45deg);
      }
      .approval-sign {
        color: #fff;
        display: inline-block;
        font-size: 9px;
        position: absolute;
        top: 8px;
        right: -3px;
        transform: rotate(45deg);
      }
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
          .title {
            margin-right: 5px;
            display: flex;
            align-items: center;
            /deep/.el-button {
              margin-left: 5px;
              .el-icon-delete {
                color: #f36357;
              }
            }
            .title-name {
              flex: 1;
              font-size: 16px;
              .ellipsis;
            }
          }
          .description {
            max-height: 28px;
            line-height: 14px;
            .ellipsis;
            white-space: initial;
          }
          p:last-child {
            font-size: 12px;
            color: #68758a;
            margin-top: 3px;
          }
        }
      }
    }
  }
}
</style>

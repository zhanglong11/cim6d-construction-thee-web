<template>
  <div class="is-footer">
    <el-row :gutter="15" class="message-push">
      <el-col :md="6" class="message-menu">
        <el-card class="box-card" shadow="hover">
          <el-input v-model="keyword" placeholder="请输入" class="input-with-select" @input="searchTree">
            <el-button slot="append" icon="el-icon-search" @click="searchTree" />
          </el-input>
          <div class="power-roll tree-roll">
            <el-tree
              ref="treeRef"
              highlight-current
              :data="treeList"
              node-key="id"
              :props="defaultProps"
              :filter-node-method="filterNode"
              :expand-on-click-node="true"
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node }" class="custom-tree-node">
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :md="18">
        <el-card v-if="powerId" shadow="hover">
          <div slot="header" class="clearfix">
            <span>{{ powerName }}</span>
          </div>
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span>推送规则</span>
            </div>
            <el-form :model="formData">
              <el-form-item label="推送机制">
                <el-select v-model="formData.mechanismType" placeholder="请选择" @change="handleChange">
                  <el-option
                    v-for="(item, i) in mechanismList"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="推送状态">
                <el-switch v-model="formData.status"></el-switch>
              </el-form-item>
              <el-form-item label="推送人员">
                <div class="push-personnel">
                  <div class="personnel">
                    <!--<el-checkbox v-model="formData.roleType">按角色</el-checkbox>-->
                    <el-button type="text" icon="el-icon-plus" @click="addRole()">添加角色</el-button>
                    <div class="personnel-item">
                      <el-tag v-for="item in formData.selectRole" :key="item.id">{{ item.name }}</el-tag>
                    </div>
                    <!-- 添加角色 模态框 start -->
                    <SelectRole ref="selectRoleRef" v-model="formData.selectRole" :max="20" @change="changeRole" />
                    <!-- 添加角色 模态框 end -->
                  </div>
                  <div class="personnel">
                    <!--<el-checkbox v-model="formData.personnelType">按人员</el-checkbox>-->
                    <el-button type="text" icon="el-icon-plus" @click="addMember()">添加人员</el-button>
                    <div class="personnel-item">
                      <el-tag v-for="item in formData.selectUser" :key="item.id">{{ item.name }}</el-tag>
                    </div>
                    <!-- 添加人员 模态框 start -->
                    <SelectUser
                      ref="selectUserRef"
                      v-model="formData.selectUser"
                      :max="20"
                      @change="changeUser"
                    ></SelectUser>
                    <!-- 添加人员 模态框 end -->
                  </div>
                  <div class="personnel">
                    <el-button type="text" icon="el-icon-plus" @click="addLabourMember()">添加劳务人员</el-button>
                    <div class="personnel-item">
                      <el-tag v-for="item in formData.selectLabourUser" :key="item.id">{{ item.name }}</el-tag>
                    </div>
                    <!-- 添加劳务人员 模态框 start -->
                    <SelectLabourUser
                      ref="selectLabourUserRef"
                      v-model="formData.selectLabourUser"
                      :max="20"
                      @change="changeLabourUser"
                    ></SelectLabourUser>
                    <!-- 添加劳务人员 模态框 end -->
                  </div>
                  <div class="personnel">
                    <!--<el-checkbox v-model="formData.fieldType">关联字段</el-checkbox>-->
                    <el-button type="text" icon="el-icon-plus" @click="addField">添加字段</el-button>
                    <div class="personnel-item">
                      <el-tag v-for="item in formData.selectField" :key="item.key">{{ item.name }}</el-tag>
                    </div>
                    <!-- 添加字段 模态框 start -->
                    <SelectField
                      v-model="formData.selectField"
                      :visible.sync="selectFieldVisible"
                      :powerKey="powerKey"
                      :serviceId="serviceId"
                      :type="formData.mechanismType"
                      @change="changeField"
                    />
                    <!-- 添加字段 模态框 end -->
                  </div>
                </div>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="lg" :disabled="!formData.mechanismType" @click="handleSave">保存</el-button>
          </el-card>
        </el-card>
        <el-card v-else shadow="never">
          <div class="no-config">
            <p>当前模块暂未设置推送配置，如需设置，请联系管理员设置</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { projectApi } from '../api/project'
import SelectRole from '@/views/construction/workflow/components/CustomProperties/SelectRole'
import SelectUser from '@/views/construction/workflow/components/CustomProperties/SelectUser'
import SelectLabourUser from './components/SelectLabourUser'
import toTree from '@/utils/toTree'
import SelectField from './components/selectField'
export default {
  components: {
    SelectRole,
    SelectUser,
    SelectLabourUser,
    SelectField
  },
  data() {
    //这里存放数据
    return {
      keyword: '',
      treeList: [
        {
          id: 1,
          powerName: '',
          children: null
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'powerName'
      },
      formData: {
        mechanismType: '',
        status: false,
        roleType: false,
        selectRole: [],
        personnelType: false,
        selectUser: [],
        fieldType: false,
        selectField: [],
        selectLabourUser: []
      },
      powerId: '',
      powerName: '',
      powerKey: '',
      serviceId: '',
      mechanismList: [],
      selectFieldVisible: false,
      pushMechanism: [],
      pushMessageConfig: {}
    }
  },
  computed: {
    projectType() {
      return this.$store.state.project.projectType
    },
    projectId() {
      return this.$store.state.project.projectId
    },
    companyId() {
      return this.$store.state.user.companyId
    }
  },
  mounted() {
    this.init()
  },
  //方法集合
  methods: {
    init() {
      this.$store.dispatch('workflow/getRoleList')
      this.getWxMessagePowerList()
      // 获取所有的机制信息
      this.pushMechanism = this.$getArgList('push_mechanism') || []
    },
    // 查询已配置权限(左侧树菜单)
    async getWxMessagePowerList() {
      console.log('查询已配置权限', this.$store.state, this.projectType, this.companyId)
      let result = await projectApi.getWxMessagePowerList(this.projectType, this.companyId)
      let datas = result.data
      // console.log('查询已配置权限', datas)
      let treeList = toTree(
        datas.filter(e => e.type !== 3),
        'parentId',
        '',
        'powerId'
      )
      this.treeList = treeList
    },
    // 添加角色
    addRole() {
      this.$refs.selectRoleRef.modalStatus = true
    },
    // 选择角色
    changeRole(array) {
      console.log('选择角色', array)
      this.formData.selectRole = array
    },
    // 添加人员
    addMember() {
      this.$refs.selectUserRef.modalStatus = true
    },
    // 添加劳务人员
    addLabourMember() {
      this.$refs.selectLabourUserRef.modalStatus = true
    },
    // 选择人员
    changeUser(array) {
      console.log('选择人员', array)
      this.formData.selectUser = array
    },
    // 选择劳务人员
    changeLabourUser(array) {
      console.log('选择劳务人员', array)
      this.formData.selectLabourUser = array
    },
    // 点击锚点
    handleNodeClick(data) {
      if (!data.children) {
        console.log(data)
        this.powerId = data.powerId
        this.powerName = data.powerName
        this.powerKey = data.powerKey
        this.serviceId = data.serviceId
        // 状态清除
        this.mechanismList = []
        this.formData.mechanismType = ''
        this.formData.status = false
        this.formData.selectRole = []
        this.formData.selectUser = []
        this.formData.selectField = []
        this.formData.selectLabourUser = []
        this.pushMessageConfig = {}
        // 根据选择的不同节点，初始化相应的机制列表
        this.queryWxMessageConfig(data.powerKey)
      }
    },
    // 查询推送配置
    async queryWxMessageConfig(powerKey) {
      let params = {
        powerKey,
        projectId: this.projectId
      }
      let result = await projectApi.queryWxMessageConfig(params)
      this.pushMessageConfig = result.data
      console.log('查询推送配置', this.pushMessageConfig)
      this.mechanismList = []
      for (let key in this.pushMessageConfig) {
        for (let i = 0; i < this.pushMechanism.length; i++) {
          if (this.pushMechanism[i].value === key) {
            this.mechanismList.push(this.pushMechanism[i])
          }
        }
      }
    },
    // 搜索树
    searchTree() {
      this.$refs.treeRef.filter(this.keyword)
    },
    // 根据关键字搜索
    filterNode(value, data) {
      if (!value) return true
      return data.powerName.toLowerCase().includes(value.toLowerCase())
    },
    // 添加字段
    addField() {
      if (this.formData.mechanismType) {
        this.selectFieldVisible = true
      } else {
        this.$message.error('请选择推送机制')
      }
    },
    // 选择字段
    changeField(array) {
      console.log('选择字段', array)
      this.formData.selectField = array
    },
    // 保存
    handleSave() {
      console.log(this.formData)

      let receiveParamKeys = ''
      if (this.formData.selectField.length) {
        this.formData.selectField.map(item => {
          receiveParamKeys += ',' + item.key
        })
        receiveParamKeys = receiveParamKeys.substr(1)
      }
      let receiveRoleIds = ''
      if (this.formData.selectRole.length) {
        console.log(444, this.formData.selectRole)
        this.formData.selectRole.map(e => (e.targetId = e.targetId || e.id))
        receiveRoleIds = _.map(this.formData.selectRole, 'targetId').join(',')
      }
      let receiveUserIds = ''
      if (this.formData.selectUser.length) {
        this.formData.selectUser.map(item => {
          receiveUserIds += ',' + item.targetId
        })
        receiveUserIds = receiveUserIds.substr(1)
      }
      let receiveLabourIds = ''
      if (this.formData.selectLabourUser.length) {
        receiveLabourIds = _.map(this.formData.selectLabourUser, 'id').join(',')
      }

      // 保存参数封装
      let param = {
        projectId: localStorage.getItem('projectId'),
        powerKey: this.powerKey,
        sendStatus: this.formData.status ? 1 : 0,
        receiveParamKeys,
        receiveRoleIds,
        receiveUserIds,
        receiveLabourIds,
        mechanismType: this.formData.mechanismType
      }

      // 判断是否封装推送规则id
      for (let key in this.pushMessageConfig) {
        if (key === this.formData.mechanismType) {
          if (this.pushMessageConfig[key] && this.pushMessageConfig[key].id) {
            param.id = this.pushMessageConfig[key].id
          }
        }
      }

      // 保存提交
      projectApi.saveSendConfig(param).then(res => {
        this.$message.success('操作成功')
        this.queryWxMessageConfig(this.powerKey)
      })
    },
    // 推送机制选择事件
    handleChange() {
      // 清处状态
      this.formData.status = false
      this.formData.selectRole = []
      this.formData.selectUser = []
      this.formData.selectField = []
      this.formData.selectLabourUser = []
      // 勾选数据恢复
      for (let key in this.pushMessageConfig) {
        if (key === this.formData.mechanismType) {
          let mechanismInfo = this.pushMessageConfig[key]
          if (mechanismInfo) {
            this.formData.status = mechanismInfo.sendStatus ? true : false
            if (mechanismInfo.receiveParamKeyList && mechanismInfo.receiveParamKeyList.length) {
              this.formData.selectField = mechanismInfo.receiveParamKeyList
            }
            if (mechanismInfo.receiveRoleIdList && mechanismInfo.receiveRoleIdList.length) {
              this.formData.selectRole = mechanismInfo.receiveRoleIdList
            }
            if (mechanismInfo.receiveLabourIdList && mechanismInfo.receiveLabourIdList.length) {
              this.formData.selectLabourUser = mechanismInfo.receiveLabourIdList
            }
            if (mechanismInfo.receiveUserIdList && mechanismInfo.receiveUserIdList.length) {
              let roleList = this.$store.state.workflow.roleList
              for (let i = 0; i < mechanismInfo.receiveUserIdList.length; i++) {
                let userInfo = this.findUserInfo(mechanismInfo.receiveUserIdList[i].id, roleList)
                mechanismInfo.receiveUserIdList[i].targetId = userInfo.targetId
                mechanismInfo.receiveUserIdList[i].newId = userInfo.parentId + '_' + userInfo.targetId
              }
              this.formData.selectUser = mechanismInfo.receiveUserIdList
            }
          }
          console.log('推送机制选择事件', mechanismInfo, this.formData)
          break
        }
      }
    },
    // 查找用户信息，取出该信息里的parentId，来拼接成newId，方便勾选框状态回显
    findUserInfo(userId, data) {
      for (let i = 0; i < data.length; i++) {
        if (userId === data[i].targetId) {
          return data[i]
        } else if (data[i].children && data[i].children.length) {
          let result = this.findUserInfo(userId, data[i].children)
          if (result) {
            return result
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');
.push-personnel {
  display: inline-flex;
  flex-direction: column;
  .personnel {
    display: flex;
    align-items: center;
    /deep/.el-checkbox {
      width: 120px;
    }
  }
}
.message-push {
  height: 100%;
  .message-menu {
    height: 100%;
    /deep/.el-card {
      height: 100%;
      .el-card__body {
        height: 100%;
        display: flex;
        flex-direction: column;
        .power-roll {
          margin-top: 15px;
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
          .scrollbar;
          font-size: 14px;
        }
      }
    }
  }
}

.no-config {
  color: #909399;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 500px;
  /deep/.el-button {
    font-size: 14px;
  }
}

.personnel-item {
  padding: 0px 10px;
  /deep/ span {
    margin-right: 10px;
  }
}
</style>

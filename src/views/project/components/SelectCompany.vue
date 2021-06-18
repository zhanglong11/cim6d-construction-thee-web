<template>
  <div>
    <el-dialog
      title="选择单位"
      :visible="visible"
      width="600px"
      top="10vh"
      append-to-body
      :close-on-click-modal="false"
      @close="$emit('update:visible', false)"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="formRule" class="dialogForm">
        <el-form-item label="已选择：" prop="name">
          <div class="aa">
            <template v-if="checkNodes.length">
              <el-tag v-for="item of checkNodes" :key="item.id" class="tag" closable @close="handleClose(item)">
                {{ item.dataName }}
              </el-tag>
            </template>
            <template v-else> 还没有选择的数据 </template>
          </div>
        </el-form-item>
        <div class="selectContainer">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤"> </el-input>
          <el-tree
            ref="tree"
            :data="copyCompanyList"
            :default-checked-keys="selectedCompanyKeys"
            show-checkbox
            default-expand-all
            :props="{
              label: 'dataName',
              value: 'dataUnicode',
              disabled: node => node.organType !== 3
            }"
            check-strictly
            node-key="participantCompanyId"
            :filter-node-method="filterTree"
            @check-change="handleCheckChange"
          >
          </el-tree>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="handleEmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleApi } from '@/views/company/api/role'
import { mapGetters } from 'vuex'
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
import toTree from '@/utils/toTree'
export default {
  name: 'SelectCompany',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectedCompany: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      form: {},
      value: '',
      formRule: {
        name: [{ message: '请输入名称', trigger: 'blur' }]
      },
      companyList: [],
      copyCompanyList: [],
      checkNodes: [],
      filterText: ''
    }
  },
  computed: {
    // 公司信息
    companyInfo() {
      return this.$store.state.system.companyInfo
    },
    selectedCompanyKeys() {
      return this.selectedCompany.map(item => item.id)
    },
    checkNodesKeys() {
      return this.checkNodes.map(item => item.id)
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    setTimeout(() => {
      this.$refs.tree.setCheckedKeys(this.selectedCompanyKeys)
      this.checkNodes = this.$refs.tree.getCheckedNodes()
    }, 500)
  },
  created() {
    this.getCompanyList()
  },
  // 方法集合
  methods: {
    //获取公司列表
    async getCompanyList() {
      let { data } = await roleApi.getCompanyList({ typeList: [1, 2, 3] })
      data = _.reject(data, ({ participantType, organType }) => participantType === 2 && organType === 1)
      let treeData = toTree(data, 'parentId')
      _.pullAllWith(treeData, { participantType: 2 }, _.isEqual)
      console.log(treeData)
      this.companyList = treeData
      this.copyCompanyList = _.cloneDeep(this.companyList)
    },
    filterTree(value, data) {
      if (!value) return true
      let name = data.participantCompanyName || data.participantTypeName
      return name.indexOf(value) !== -1
    },
    handleCheckChange() {
      let checkedNodes = this.$refs.tree.getCheckedNodes()
      this.checkNodes = checkedNodes
    },
    handleClose(item) {
      this.checkNodes = this.$refs.tree.getCheckedNodes().filter(e => e.id !== item.id)
      this.$refs.tree.setCheckedKeys(this.checkNodesKeys)
    },
    handleEmit() {
      this.$emit('submit', this.checkNodes)
    }
  }
}
</script>
<style lang="less" scoped>
.formInput {
  width: 400px;
}
.dialogForm {
  padding: 10px 20px;
}
.tag {
  margin: 0 10px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.selectContainer {
  //max-height: 500px;
  //min-height: 300px;
  height: 400px;
  overflow: auto;
  border: 1px #999 solid;
  padding: 20px 20px;
}
.el-tree {
  margin-top: 10px;
}
</style>

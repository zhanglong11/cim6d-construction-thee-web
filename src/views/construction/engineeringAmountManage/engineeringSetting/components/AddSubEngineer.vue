<template>
  <el-dialog
    :title="_.isEmpty(info) ? '新建分项工程' : '修改分项工程'"
    width="600px"
    class="middle-v"
    :visible="visible"
    :close-on-click-modal="false"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="分项工程名称" prop="name">
        <el-input v-model="form.name" class="from-item" placeholder="请输入分项工程名称" />
      </el-form-item>
      <el-form-item label="所属工程" prop="engineerId">
        <el-select v-model="form.engineerId" class="from-item">
          <el-option
            v-for="(item, index) of engineerList"
            :key="'EL' + index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属结构" prop="pid">
        <el-select v-model="form.pid" class="from-item">
          <el-option
            v-for="(item, index) of structureList"
            :key="'sl' + index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <div>{{ groupList.groupList }}</div>
      <el-form-item label="施工班组" prop="constructionTeamIds">
        <el-checkbox-group v-model="form.constructionTeamIds">
          <el-checkbox v-for="(item, index) of groupList" :key="'gl' + index" :label="item.id">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-input v-model="form.unit" class="from-item" placeholder="请输入单位" />
      </el-form-item>
      <el-form-item label="分项工程特征">
        <el-input
          v-model="form.features"
          class="from-item"
          type="textarea"
          :rows="3"
          placeholder="请输入分项工程特征"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button v-promise-btn type="primary" @click="handleSave">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/views/construction/engineeringAmountManage/api'
export default {
  name: 'AddSubEngineer',
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {}
    },
    engineerList: {
      type: Array,
      default: () => []
    },
    defaultStructureList: {
      type: Array,
      default: () => []
    },
    selectEngineer: {
      type: Object,
      default: () => {}
    },
    selectStructure: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        ...this.info,
        engineerId: this.selectEngineer.id || '',
        pid: this.selectStructure.id || '',
        constructionTeamIds: this.info.constructionTeamIds?.split(',') || []
      },
      structureList: [...this.defaultStructureList],
      groupList: [],
      rules: {
        name: [{ required: true, message: '必填' }],
        engineerId: [{ required: true, message: '必选' }],
        pid: [{ required: true, message: '必选' }],
        constructionTeamIds: [{ required: true, message: '必选' }],
        unit: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    'form.engineerId': {
      deep: true,
      handler() {
        if (!this.form.engineerId) return
        this.getStructureList()
      }
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    async getGroupList() {
      let res = await Api.getAllGroupList()
      this.groupList = res.data || []
    },
    //获取结构列表
    async getStructureList() {
      let res = await Api.getESSList(this.form.engineerId)
      this.structureList = res.data || []
    },
    //点击确定
    async handleSave() {
      await this.$refs['form'].validate()
      this.$emit('submit', { ...this.form, constructionTeamIds: this.form.constructionTeamIds.join(',') })
    }
  }
}
</script>

<style lang="less" scoped>
.from-item {
  width: 400px;
}
</style>

<template>
  <el-dialog top="10vh" title="添加字段" width="50%" append-to-body :visible="visible" @close="handleCancel">
    <el-form ref="formRef">
      <el-form-item v-if="selectFieldList.length > 0" label="已选字段">
        <div class="tags">
          <template v-for="(item, i) in selectFieldList">
            <el-tag :key="i" size="small" closable @close="deleteField(item, i)">{{ item.name }}</el-tag>
          </template>
        </div>
      </el-form-item>
      <el-form-item label="请选择">
        <el-checkbox-group v-model="selectFieldKeys" @change="handleChange">
          <el-checkbox v-for="(item, index) in allFieldList" :key="index" :label="item.key">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleEnter">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { projectApi } from '../../api/project'
export default {
  name: 'SelectField',
  components: {},
  props: {
    visible: Boolean,
    powerKey: {
      type: String,
      default: ''
    },
    serviceId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      selectFieldKeys: [], // 选择的字段key
      selectFieldList: [], // 选择的字段列表
      allFieldList: [] // 查询的字段列表
    }
  },
  watch: {
    visible(val) {
      if (val) {
        projectApi.getWxPushFields(this.type, { powerKey: this.powerKey, serviceId: this.serviceId }).then(res => {
          // console.log(res)
          this.allFieldList = res.data
          // 配置勾选状态回显
          this.selectFieldKeys = _.map(this.value, 'key')
          this.selectFieldList = this.value
        })
      }
    }
  },
  // 方法集合
  methods: {
    // 复选框变化
    handleChange() {
      let selectFieldList = []
      for (let i = 0; i < this.selectFieldKeys.length; i++) {
        for (let j = 0; j < this.allFieldList.length; j++) {
          if (this.selectFieldKeys[i] === this.allFieldList[j].key) {
            selectFieldList.push(this.allFieldList[j])
            break
          }
        }
      }
      this.selectFieldList = selectFieldList
    },
    // 取消
    handleCancel() {
      this.selectFieldKeys = []
      this.selectFieldList = []
      this.$emit('update:visible', false)
    },
    // 确定
    handleEnter() {
      this.$emit('change', this.selectFieldList)
      this.$emit('update:visible', false)
    },
    // 删除字段
    deleteField(item, index) {
      let newSelectFieldList = _.cloneDeep(this.selectFieldList)
      newSelectFieldList.splice(index, 1)
      let newSelectFieldKeys = _.cloneDeep(this.selectFieldKeys)
      newSelectFieldKeys.splice(index, 1)
      this.selectFieldList = newSelectFieldList
      this.selectFieldKeys = newSelectFieldKeys
    }
  }
}
</script>

<style lang="less" scoped>
.tags {
  .el-tag {
    margin-right: 10px;
  }
}
</style>

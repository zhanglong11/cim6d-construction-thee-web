<template>
  <el-dialog title="详情" width="1600px" top="5vh" :visible="visible" @close="$emit('update:visible', false)">
    <div class="body-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="工种" :value="$getLabel(workTypeList, info.workType)"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="施工部位" :value="info.constructionArea"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="作业类型/内容" :value="info.taskContentType"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="施工负责人" :value="info.constructionMangerName"></DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="计划起始日期">{{ info.planStartDate | ymd }}~{{ info.planEndDate | ymd }} </DetailItem>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <DetailItem label="安全防护措施" :value="info.safetyPrecautions"></DetailItem>
        </el-col>
      </el-row>
      <!--附件-->
      <FileTable :ids="info.fileId"></FileTable>
    </div>
    <span slot="footer" class="dialog-footer">
      <template v-if="true">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button v-promise-btn type="primary" @click="handleSave">保 存</el-button>
      </template>
      <el-button @click="$emit('update:visible', false)">返 回</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api'
import DetailItem from '@/views/construction/quality/components/detailItem'
import FileTable from '@/views/construction/quality/components/fileTable' //附件
export default {
  name: 'SpecialDetail',
  components: { DetailItem, FileTable },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {
        code: 111,
        fileIds: '1,2,3'
      }
    }
  },
  computed: {
    //工种类型
    workTypeList() {
      return this.$getArgList('workType') || [{ value: 1, label: '架子工' }]
    }
  },
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getSpecialDetail(this.id)
      this.info = res.data
    },
    async handleSave() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
</style>

<template>
  <div v-loading="removeModelLoading" element-loading-text="正在删除模型，请耐心等待，请勿关闭此页面">
    <div class="tooltips">
      <div>
        <el-button v-if="$hasPower('BIMAdd')" type="primary" class="el-icon-plus" @click="uploadDialogVisible = true"
          >新建</el-button
        >
        <el-button @click="handlePreviewModel()">预览合成模型</el-button>
        <el-button @click="handlePreviewModel(null, true)">设置视角</el-button>
      </div>
    </div>
    <vxe-table :data="list">
      <vxe-table-column title="模型名称" field="singleModelName">
        <template #default="{ row }">
          <a @click="handlePreviewModel(row.singleModelId)">{{ row.singleModelName }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column title="模型id" field="singleModelId"></vxe-table-column>
      <vxe-table-column width="60" title="版本" field="version"></vxe-table-column>
      <vxe-table-column width="80" title="创建人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('BIMUpdate')" type="text" @click="handleOverwrite(row)">更新模型</el-button>
          <el-button v-if="list.length && $hasPower('BIMUpdate')" type="text" @click="handleRemove(row)"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>

    <el-dialog
      width="600px"
      :title="overwritingModel ? '覆盖模型' : '上传模型'"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form ref="form" label-width="100px">
        <el-form-item v-if="overwritingModel" label="旧模型">
          {{ overwritingModel.singleModelName }}
        </el-form-item>
        <el-form-item v-show="!processing" label="模型文件">
          <Upload
            ref="upload"
            v-model="file"
            :limit="1"
            raw
            accept=".zip,.rvt,.skp,.3dm,.fbx,.s3d,.rfa,.ifc,.stl,.m3d"
          ></Upload>
        </el-form-item>
        <el-form-item label="模型名称">
          <el-input v-model="form.name">
            <template slot="append">{{ suffix }}</template>
          </el-input>
        </el-form-item>
        <el-form-item v-if="uploadPercentage">
          <div>
            <span>进度</span>
            <el-progress :stroke-width="14" :text-inside="true" :percentage="uploadPercentage"></el-progress>
            <p v-html="progressHtml"></p>
          </div>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button @click="close">关闭</el-button>
        <el-button v-promise-btn type="primary" @click="submit">{{ overwritingModel ? '覆盖' : '上传' }}</el-button>
      </footer>
    </el-dialog>
    <el-dialog
      v-if="bimPreviewDialogVisible"
      width="80vw"
      class="beauty"
      :visible.sync="bimPreviewDialogVisible"
      @close="closeModel"
    >
      <div style="height: 70vh">
        <BimView ref="bim111" :model-id="modelId" @ready="modelReady = true" />
      </div>
      <footer slot="footer">
        <el-button @click="closeModel">取消</el-button>
        <el-button v-if="showBtn && $hasPower('BIMCamera')" :disabled="!modelReady" type="primary" @click="saveCamera"
          >确认</el-button
        >
      </footer>
    </el-dialog>
    <BimView ref="bim" :noModel="true" />
  </div>
</template>

<script>
import { createModel, getActiveMergerModel, getModelList, overwriteModel, removeModel, saveCamera } from '@/api/modelo'
import delay from 'delay'
// 等待模袋云处理模型
function waitModelConvert(modelId) {
  let status = ''
  return new Promise(async (resolve, reject) => {
    while (!['ERROR', 'CONVERTED'].includes(status)) {
      const res = await Modelo.Model.get(modelId)
      status = res.status
      await delay(1000)
    }
    if (status === 'ERROR') {
      reject(new Error('模型转换失败'))
    }
    if (status === 'CONVERTED') {
      resolve()
    }
  })
}
// 获取合并模型的新旧模型关系
function getBIMMappings(combineModelId) {
  return Modelo.BIM.getTreeInfo(combineModelId).then(res => {
    let mappings = _.values(res.models)
    // 新旧模型映射关系
    mappings = mappings.map(model => ({
      singleModelId: model.originModelId,
      singleModelDocId: model.docId,
      singleModelName: decodeURI(decodeURIComponent(model.name))
    }))
    return mappings
  })
}
export default {
  name: 'Manage',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      list: [],
      uploadDialogVisible: !!+this.$route.query.showAdd || false,
      bimPreviewDialogVisible: false,
      form: {
        modelId: '',
        name: ''
      },
      file: null,
      // 文件后缀
      suffix: '',
      // 正在覆盖中的model,弹框关闭之后重置为null
      overwritingModel: null,
      uploadPercentage: 0,
      mergePercentage: 0,
      progressHtml: '',
      selectedModelList: [],
      removeModelLoading: false,
      // 此次模型任务是否进行中
      processing: false,
      modelId: localStorage.getItem('bimModelId'),
      showBtn: false,
      modelReady: false
    }
  },
  computed: {
    mergedModelName() {
      return this.$store.state.project.projectName
    }
  },
  watch: {
    file(val) {
      if (val) {
        this.form.name = _.head(this.file.name.split('.'))
        this.suffix = _.last(this.file.name.split('.'))
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  destroyed() {
    if (this.modeloApp) {
      this.modeloApp.destroy()
    }
  },
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    async refresh() {
      this.list = await getModelList().then(res => res.data)
      this.$store.dispatch('bim/setBimModelId')
    },
    // 处理覆盖
    handleOverwrite(model) {
      this.overwritingModel = model
      this.uploadDialogVisible = true
    },
    close() {
      if (this.processing) {
        this.$message.error('模型处理完成之前，禁止关闭')
        return false
      }
      this.uploadDialogVisible = false
      this.file = null
      this.form = {
        modelId: '',
        name: ''
      }
      this.overwritingModel = null
      this.progressHtml = ''
      this.uploadPercentage = 0
      this.mergePercentage = 0
      this.$refs.upload.$refs.upload.clearFiles()
    },
    //提交
    async submit() {
      this.processing = true
      try {
        await this.$refs.form.validate()
        this.progressHtml += '正在上传... <br>'
        let file = this.file
        if (this.file.name !== this.form.name) {
          file = new File([file], this.form.name + '.' + this.suffix)
        }
        const { id: modelId } = await Modelo.Model.upload(file, percentage => {
          this.uploadPercentage = _.round(percentage * 100)
        })
        this.progressHtml += '上传完成 <br>'
        this.progressHtml += '正在处理模型... <br>'
        await waitModelConvert(modelId)
        this.progressHtml += '模型处理完毕 <br>'
        this.progressHtml += '正在同步数据 <br>'
        this.progressHtml += '正在合并模型 <br>'
        let combineModelId
        if (this.list.length) {
          combineModelId = await Modelo.Model.merge(
            this.mergedModelName,
            _.chain(this.list)
              .reject({ singleModelId: this.overwritingModel?.singleModelId })
              .map('singleModelId')
              .concat(modelId)
              .value()
          )
          await waitModelConvert(combineModelId)
        } else {
          // 只有一个模型的是时候，把新模型当成合模ID
          combineModelId = modelId
        }
        this.progressHtml += '合并模型完成 <br>'
        let mappings = await getBIMMappings(combineModelId)
        if (this.overwritingModel) {
          mappings.forEach(e => (e.oldModelId = e.singleModelId))
          _.find(mappings, { singleModelId: modelId }).oldModelId = this.overwritingModel.singleModelId
        }
        const body = {
          combineModelId,
          combineModelName: this.mergedModelName,
          singleModelList: mappings
        }
        if (this.overwritingModel) {
          await overwriteModel(body)
        } else {
          await createModel(body)
        }
        await this.$refs.bim.cacheModel(combineModelId)
        this.processing = false
        this.close()
        this.refresh()
      } catch (err) {
        console.log(err)
        this.processing = false
      }
    },
    async handleRemove(model) {
      try {
        await this.$tipRemove(
          [model],
          'singleModelName',
          `<p style="font-weight:bold;color:#e31515;">删除模型会一并删除该模型关联的数据 ！！</p>`
        )
        this.removeModelLoading = true
        const remainingModelList = _.reject(this.list, { singleModelId: model.singleModelId })
        let combineModelId
        if (remainingModelList.length > 1) {
          combineModelId = await Modelo.Model.merge(
            this.mergedModelName,
            _.chain(this.list).reject({ singleModelId: model.singleModelId }).map('singleModelId').value()
          )
          await waitModelConvert(combineModelId)
        } else if (remainingModelList.length === 1) {
          // 只有一个模型的是时候，把新模型当成合模ID
          combineModelId = remainingModelList[0].singleModelId
        } else {
          combineModelId = null
        }
        await removeModel({
          combineModelId,
          ...(combineModelId
            ? { combineModelName: this.mergedModelName, singleModelList: await getBIMMappings(combineModelId) }
            : {})
        })
        await Modelo.Model.remove(model.singleModelId)
        this.$message.success('删除成功')
        await this.refresh()
        this.removeModelLoading = false
      } catch (err) {
        console.log(err)
        this.removeModelLoading = false
        this.refresh()
      }
    },
    async handlePreviewModel(modelId, showBtn) {
      if (!modelId) {
        modelId = await getActiveMergerModel().then(res => res.data.combineModelId)
      }
      if (!modelId) {
        this.$message.error('暂无模型')
      }
      this.modelId = modelId
      this.bimPreviewDialogVisible = true
      this.showBtn = showBtn
    },
    //保存当前视角
    async saveCamera() {
      let defaultView = this.$refs.bim111.getCameraData()
      await saveCamera({ defaultView: JSON.stringify(defaultView) })
      this.$message.success('操作成功')
      this.$store.dispatch('bim/setBimModelId')
      this.closeModel()
    },
    closeModel() {
      this.modelReady = false
      this.bimPreviewDialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>

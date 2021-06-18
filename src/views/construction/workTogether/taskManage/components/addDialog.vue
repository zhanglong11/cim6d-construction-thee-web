<template>
  <el-dialog
    class="beauty"
    width="600px"
    top="10vh"
    :title="title"
    :close-on-click-modal="false"
    append-to-body
    :visible="visible"
    @close="close"
  >
    <!--添加，编辑表单-->
    <el-form v-if="type === 'add' || type === 'edit'" ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="任务内容" prop="taskContent">
        <el-input v-model="form.taskContent" type="textarea" />
      </el-form-item>
      <el-form-item label="任务重要性" prop="taskLevel">
        <SelectList v-model="form.taskLevel" :self-list="importList" :has-all-option="false"></SelectList>
      </el-form-item>

      <el-form-item v-if="type !== 'edit'" label="任务类型" prop="taskType">
        <el-radio-group v-model="form.taskType">
          <el-radio :label="0">单一任务</el-radio>
          <el-radio :label="1">多任务</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.taskType">
        <el-card v-for="(item, index) in form.detailAddDTOList" :key="index" style="margin-top: 10px">
          <div slot="header" class="card-header">
            子任务{{ index + 1 }} <el-button type="danger" @click="removeSub(index)">删除</el-button>
          </div>

          <el-form-item
            label="子任务内容"
            :prop="'detailAddDTOList.' + index + '.taskContent'"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-input v-model="item.taskContent" type="textarea" />
          </el-form-item>

          <el-form-item
            label="任务接收人"
            :prop="'detailAddDTOList.' + index + '.executor'"
            :rules="[{ required: true, message: '必填' }]"
          >
            <SelectUser v-model="item.executor" :multiple="false" value-format="id" append-to-body />
          </el-form-item>

          <el-form-item
            label="任务截止时间"
            :prop="'detailAddDTOList.' + index + '.taskEndTime'"
            :rules="[{ required: true, message: '必填' }]"
          >
            <el-date-picker
              v-model="item.taskEndTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-card>

        <el-button type="primary" style="display: block; margin: 20px auto" @click="addSum">新增子任务</el-button>
      </template>
      <template v-else>
        <el-form-item label="任务接收人" prop="executor" :rules="[{ required: true, message: '必填' }]">
          <SelectUser v-model="form.executor" :multiple="false" value-format="id" append-to-body />
        </el-form-item>

        <el-form-item label="任务截止时间" prop="taskEndTime" :rules="[{ required: true, message: '必填' }]">
          <el-date-picker
            v-model="form.taskEndTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </template>
    </el-form>
    <!--添加，编辑表单-->

    <!--取消-->
    <div v-if="type === 'cancel'" class="cancel">
      <h4>确定取消当前任务吗？</h4>
      <h6>一旦取消，将无法恢复，请慎重</h6>
    </div>
    <!--取消-->

    <!--取消-->
    <el-form v-if="type === 'urge'" label-width="120px">
      <el-form-item label="任务内容" prop="content">{{ form.taskContent }}</el-form-item>
      <el-form-item label="执行人">
        {{ form.executorStr }}
      </el-form-item>
      <el-form-item label="任务截止时间">
        {{ form.taskEndTime }}
      </el-form-item>
    </el-form>
    <!--取消-->

    <!--填报表单-->
    <el-form v-if="type === 'result'" ref="resultForm" :model="resultForm" :rules="resultRules" label-width="120px">
      <el-form-item label="任务内容">
        {{ form.taskContent }}
      </el-form-item>
      <el-form-item label="填报内容" prop="taskResult">
        <el-input v-model="resultForm.taskResult" type="textarea" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="resultForm.remark" type="textarea" />
      </el-form-item>
      <el-form-item label="附件" prop="fileId">
        <FileEdit v-model="resultForm.fileId" />
      </el-form-item>
    </el-form>
    <!--填报表单-->

    <!--填报详情-->
    <el-form v-if="type === 'resultDetail'" label-width="120px">
      <el-form-item label="任务内容" prop="taskContent">{{ form.taskContent }}</el-form-item>
      <el-form-item label="填报内容">
        {{ form.taskResult }}
      </el-form-item>
      <el-form-item label="备注">
        {{ form.remark }}
      </el-form-item>
      <el-form-item label="附件">
        <FileList :ids="form.fileId" />
      </el-form-item>
    </el-form>
    <!--填报详情-->

    <footer slot="footer">
      <template v-if="type !== 'resultDetail'">
        <el-button @click="close">取消</el-button>
        <el-button v-promise-btn type="primary" @click="submit">确认</el-button>
      </template>
      <el-button v-else @click="close">返回</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import level from '../lib/level'
import importList from '../lib/importList'
import Api from '../api'
export default {
  name: 'AddDialog',
  props: {
    visible: {
      type: Boolean
    },
    activeId: {},
    type: {},
    taskType: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    // 这里存放数据
    return {
      form: {
        taskType: this.taskType,
        detailAddDTOList: [{}, {}]
      },
      resultForm: {},
      level,
      importList,
      rules: {
        taskContent: [{ required: true, message: '必填' }],
        taskLevel: [{ required: true, message: '必填' }],
        taskType: [{ required: true, message: '必填' }]
      },
      resultRules: {
        taskResult: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    title() {
      switch (this.type) {
        case 'add':
          return '新建'
        case 'edit':
          return '编辑'
        case 'cancel':
          return '取消'
        case 'urge':
          return '催办'
        case 'result':
          return '结果填报'
        case 'resultDetail':
          return '查看结果填报'
        default:
          return ''
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    console.log('一月又一月', this.taskType)
    if (!this.activeId) return
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      const res = await Api.detail(this.activeId)
      let cloneData = _.cloneDeep(res.data)
      this.form = {
        ...cloneData,
        taskType: cloneData.taskType ? 1 : 0,
        detailAddDTOList: cloneData.taskResultDetailDTOList
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    //添加子任务
    addSum() {
      this.form.detailAddDTOList.push({})
    },
    //删除子任务
    removeSub(i) {
      this.form.detailAddDTOList.splice(i, 1)
    },
    //保存
    async save() {
      this.$refs.form && (await this.$refs.form.validate())
      let param = _.cloneDeep(this.form)
      if (param.taskType) {
        if (param.detailAddDTOList.length < 2) {
          this.$message.error('子任务不能小于2个')
          return
        }
        if (param.detailAddDTOList.length > 20) {
          this.$message.error('子任务最多20个')
          return
        }
        let dateAry = param.detailAddDTOList.map(r => r.taskEndTime)
        let maxDate = dateAry.sort((a, b) => (moment(a).isAfter(b) ? 1 : -1))[0]
        param = {
          ...param,
          ...{
            taskEndTime: maxDate
          }
        }
      } else {
        delete param.detailAddDTOList
      }
      this.activeId ? await Api.update(param) : await Api.add(param)
      this.success()
    },
    //取消
    async cancel() {
      await Api.remove(this.activeId)
      this.success()
    },
    //催办
    async urge() {
      await Api.urge({ idList: [this.activeId] })
      this.success()
    },
    //结果填报
    async result() {
      await this.$refs.resultForm.validate()
      let param = _.cloneDeep(this.resultForm)
      await Api.result({ ...param, id: this.activeId })
      this.success()
    },
    async submit() {
      switch (this.type) {
        case 'add':
          this.save()
          break
        case 'edit':
          this.save()
          break
        case 'cancel':
          this.cancel()
          break
        case 'urge':
          this.urge()
          break
        case 'result':
          this.result()
          break
        case 'resultDetail':
          return '查看结果填报'
        default:
          return ''
      }
    },
    success() {
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.cancel {
  text-align: center;
  /deep/.upload {
    .el-upload--text {
      text-align: center;
    }
  }
  h4 {
    font-size: 20px;
  }
  h6 {
    margin: 40px 0;
    font-size: 16px;
    color: red;
  }
}
.childTask {
  h6 {
    padding: 10px 40px;
  }
  .content {
    border: 1px solid #8f8f8f;
  }
}
</style>

<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="路线名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入路线名称" style="width: 50%" />
        </el-form-item>
        <el-form-item label="步骤说明">
          <p class="step-p">1、请先新增图纸，并选择图纸</p>
          <p class="step-p">2、在图纸上，使用鼠标左键单击，设置巡更点，每一个巡更点需绑定一台打卡设备或巡更二维码</p>
          <p class="step-p">3、可以在右侧的巡更点表格中，修改和删除巡更点信息</p>
          <p class="step-p">4、相邻添加的巡更点之间，自动进行连线，形成巡更路线</p>
        </el-form-item>
      </el-form>

      <div v-for="(formItem, index) in forms" :key="index" class="drawing-item">
        <div class="item-head">
          <div>包含图纸{{ index + 1 }}</div>
          <el-button type="danger" @click="handleRemove(index)">删除</el-button>
        </div>
        <div class="item-con">
          <div class="left">
            <el-form label-width="120px">
              <el-form-item label="选择图纸" required>
                <div style="display: flex">
                  <el-input v-model="formItem.drawingsName" disabled />
                  <el-button style="margin-left: 10px" @click="showDrawingDialog(index)">选择</el-button>
                </div>
              </el-form-item>
            </el-form>
            <div v-if="formItem.imgUrl" class="img-con">
              <img :src="formItem.imgUrl" />
              <canvas :id="'canvas_' + index" width="800" height="600" @click.left="canvasDown($event, index)">
              </canvas>
            </div>
          </div>
          <div class="right">
            <div class="table-con">
              <div class="table-title">巡更点位表格</div>
              <el-table :data="formItem.tableData" border size="mini">
                <el-table-column type="index" width="60" label="序号" />
                <el-table-column prop="patrolPointName" min-width="180" label="点位名称" />
                <el-table-column prop="equipmentName" width="180" label="绑定设备名称">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bindType === 1">{{
                      deviceList.filter(deviceItem => deviceItem.value === scope.row.deviceId)[0].label
                    }}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column prop="codeName" width="180" label="绑定二维码名称">
                  <template slot-scope="scope">
                    <span v-if="scope.row.bindType === 2">{{
                      codeList.filter(codeItem => codeItem.value === scope.row.deviceId)[0].label
                    }}</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row, scope.$index, index)">修改</el-button>
                    <el-button type="text" @click="handleDelete(scope.row, scope.$index, index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <div class="footer-btn">
      <el-button @click="handleCancel">取消</el-button>
      <el-button icon="el-icon-plus" @click="handleAdd">新增图纸</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleSave">保存</el-button>
    </div>

    <!-- 巡更点(新增、编辑)模态框组件 start -->
    <ModalPatrolPoint :visible.sync="visible" :item="item" @operationSuccess="operationSuccess" />
    <!-- 巡更点(新增、编辑)模态框组件 end -->

    <!-- 图纸选择模态框组件 start -->
    <DrawingSelectDialog :visible.sync="drawingVisible" @getSelectDrawing="getSelectDrawing" />
    <!-- 图纸选择模态框组件 end -->
  </div>
</template>

<script>
import ModalPatrolPoint from './ModalPatrolPoint'
import Api from '../api'
import { drawPatrolPath } from './drawPatrolPath'
import deviceList from './lib/deviceList' // 巡更设备假数据
import codeList from './lib/codeList' // 巡更二维码假数据
import DrawingSelectDialog from './components/drawingSelect'
export default {
  components: { ModalPatrolPoint, DrawingSelectDialog },
  data() {
    return {
      deviceList,
      codeList,
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '必填' }]
      },
      btnLoading: false,
      forms: [],
      // drawingsList: [],
      visible: false,
      eventObj: null,
      canvasIdx: null,
      item: {}, // 点位信息
      rowIndex: null, // 点位信息索引
      drawingVisible: false,
      activeIndex: null
    }
  },
  mounted() {},
  methods: {
    // 取消
    handleCancel() {
      this.$router.back()
    },
    // 保存
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.forms.length === 0) {
            this.$message.error('请新增图纸后，再做该操作')
            return
          }
          let flag = false
          for (let i = 0; i < this.forms.length; i++) {
            if (!this.forms[i].drawingsId) {
              this.$message.error('请在【包含图纸' + (i + 1) + '】选择图纸后，再做该操作')
              flag = true
              break
            }
          }
          if (flag) {
            return
          }
          for (let i = 0; i < this.forms.length; i++) {
            if (this.forms[i].tableData.length <= 1) {
              this.$message.error('请在【包含图纸' + (i + 1) + '】绘制巡更路线后，再做该操作')
              flag = true
              break
            }
          }
          if (flag) {
            return
          }

          // 请求参数封装
          let params = {
            routeDrawingsList: [],
            routeName: this.form.name
          }
          for (let i = 0; i < this.forms.length; i++) {
            let drawingsObj = {
              drawingsId: this.forms[i].drawingsId,
              pointList: []
            }
            let tableData = this.forms[i].tableData
            for (let j = 0; j < tableData.length; j++) {
              let row = tableData[j]
              drawingsObj.pointList.push({
                bindType: row.bindType,
                deviceId: row.deviceId,
                patrolPointLocation: this.forms[i].coordinate[j].join(','),
                patrolPointName: row.patrolPointName,
                sort: j + 1
              })
            }
            params.routeDrawingsList.push(drawingsObj)
          }
          /*console.log(this.form)
          console.log(this.forms)*/
          // console.log(params)
          this.btnLoading = true
          Api.addPatrolRoute(params).then(
            res => {
              this.$message.success('操作成功')
              this.$router.back()
              this.btnLoading = false
            },
            err => {
              this.btnLoading = false
            }
          )
        }
      })
    },
    // 新增图纸
    handleAdd() {
      this.forms.push({
        drawingsId: undefined,
        imgUrl: '',
        canvasContext: null,
        coordinate: [], // 点位坐标集
        tableData: []
      })
    },
    // 删除图纸
    handleRemove(index) {
      this.forms.splice(index, 1)
    },
    // 鼠标按下
    canvasDown(e, index) {
      // console.log(e)
      // console.log(index)
      this.rowIndex = null
      this.item = {}
      this.visible = true
      this.eventObj = e
      this.canvasIdx = index
    },
    // 巡更点(新增、修改)模态框操作成功的后续操作
    operationSuccess(pointObj) {
      if (this.rowIndex === null) {
        this.forms[this.canvasIdx].tableData.push(pointObj) // 新增点位表格数据
        this.startDrawPath(this.eventObj, this.forms[this.canvasIdx]) // 绘制路线准备
      } else {
        this.forms[this.canvasIdx].tableData.splice(this.rowIndex, 1, pointObj) // 修改点位表格数据
      }
    },

    // 绘制路线准备
    startDrawPath(e, formItem) {
      const canvasX = e.offsetX
      const canvasY = e.offsetY
      // console.log(canvasX, canvasY)
      const coordinate = formItem.coordinate
      coordinate.push([canvasX, canvasY]) // 保存坐标
      drawPatrolPath(coordinate, formItem) // 绘制路线
    },

    // 点位表格修改操作
    handleUpdate(row, rowIndex, index) {
      // console.log(row)
      // console.log(index)
      this.rowIndex = rowIndex
      this.item = row
      this.visible = true
      this.canvasIdx = index
    },
    // 点位表格删除操作
    handleDelete(row, rowIndex, index) {
      // console.log(rowIndex)
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.forms[index].tableData.splice(rowIndex, 1)
          this.forms[index].coordinate.splice(rowIndex, 1)
          drawPatrolPath(this.forms[index].coordinate, this.forms[index])
        })
        .catch(() => {})
    },
    // 显示选择图纸模态框
    showDrawingDialog(index) {
      this.activeIndex = index
      this.drawingVisible = true
    },
    // 模态框选定图纸的后续操作
    getSelectDrawing(row) {
      // console.log(row)

      let activeIndex = this.activeIndex
      this.forms[activeIndex].drawingsName = row.name
      this.forms[activeIndex].imgUrl = row.previewUrl // 图底重置
      this.forms[activeIndex].tableData = [] // 点位表格清空
      this.forms[activeIndex].drawingsId = row.id // 图纸id

      this.$nextTick(() => {
        // 初始化画布
        const canvas = document.getElementById('canvas_' + activeIndex)
        this.forms[activeIndex].canvasContext = canvas.getContext('2d')
        this.forms[activeIndex].canvasContext.lineWidth = 2
        this.forms[activeIndex].canvasContext.lineColor = 'red'

        this.forms[activeIndex].canvasContext.clearRect(0, 0, 800, 600) // 清空画布内容
        this.forms[activeIndex].coordinate = [] // 清空已保存的坐标
      })
    },
    // 验证多个包含图纸不允许重复
    noRepeatDrawings(curDrawingsId) {
      let activeIndex = this.activeIndex
      let flag = true
      for (let i = 0; i < this.forms.length; i++) {
        if (curDrawingsId === this.forms[i].drawingsId && activeIndex !== i) {
          this.$message.error('当前选择图纸已重复，请重新选择')
          flag = false
          break
        }
      }
      return flag
    }
  }
}
</script>

<style lang="less" scoped>
@import './form';
</style>

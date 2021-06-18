<template>
  <div class="is-footer">
    <div class="wrap">
      <el-card class="aside">
        <div style="padding: 30px">
          <el-form ref="form" :model="form" :rules="formRules" label-width="140px">
            <el-form-item label="电子围栏名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="围栏类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in fenceType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item label="半径:" prop="circleR">
              <el-input v-model="circleR" placeholder="请输入" :disabled="disabled" />
            </el-form-item>
            <el-form-item label="围栏行为" prop="type1">
              <el-select v-model="form.type1" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in fenceXwType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item label="报警次数" prop="railSosCount">
              <el-select v-model="form.railSosCount" placeholder="请选择" style="width: 100%">
                <el-option v-for="item in numType" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item label="报警时间:">
              <div v-for="(item, index) of railTimes" :key="index">
                <el-time-picker
                  v-model="item.reportDate"
                  value-format="HH:mm"
                  is-range
                  range-separator="至"
                  start-placeholder="请选择"
                  end-placeholder="请选择"
                  placeholder="选择时间范围"
                  @change="getReportDate"
                />
              </div>
              <el-button @click="addItem()">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card style="flex: 1" class="gantt-card">
        <div style="width: 900px; height: 700px">
          <!-- 地图 -->
          <OLMap
            ref="olmap"
            edit
            style="height: 500px"
            multipleEdit
            :value="activeId"
            :multiplePoint.sync="mapData.multiplePoint"
            :mapAdd="mapAdd"
            :point.sync="form.eara"
            :mapDelete="mapDelete"
            :type="type"
            @girdClick="girdClick"
          ></OLMap>
          <!-- <OLMap
            ref="olmap"
            edit
            style="height: 500px"
            multiple
            multipleEdit
            :value="activeId"
            :multiplePoint.sync="mapMultiplePoint"
            :mapAdd="mapAdd"
            :mapDelete="mapDelete"
            :gridName="form.name"
            :color="form.color"
            :point.sync="form.points"
            :center.sync="form.centerPoint"
            :area.sync="form.area"
            @girdClick="girdClick"
          ></OLMap> -->
        </div>
      </el-card>
    </div>
    <div class="footer-btn">
      <el-button @click="$router.back()">返回</el-button>
      <el-button size="lg" type="primary" :loading="btnLoading" @click="submit()">保存</el-button>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Api from '../api'
import OLMap from '../component/index'
import { fenceType, fenceXwType } from '../lib/sosType'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'FenceAdd',
  components: { OLMap },
  data() {
    // 这里存放数据
    return {
      id: '',
      form: {
        projectId: localStorage.getItem('projectId')
      },
      type: '2',
      circleR: '0',
      activeId: null,
      disabled: true,
      mapData: {
        color: '#ff0000',
        multiplePoint: []
      },
      fenceType,
      fenceXwType,
      btnLoading: false,
      numType: [
        { value: '0', label: '0' },
        { value: '1', label: '5' },
        { value: '2', label: '10' },
        { value: '3', label: '15' },
        { value: '4', label: '20' }
      ],
      // reportDate: [],
      formRules: {
        name: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必选' }],
        // circleR: [{ required: true, message: '必填' }],
        type1: [{ required: true, message: '必选' }],
        railSosCount: [{ required: true, message: '必选' }]
      },
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      mapAdd: true,
      mapDelete: false,
      railTimes: [{}],
      railTime: []
    }
  },
  watch: {
    'form.type'(e) {
      this.type = e
      this.disabled = e === '1' ? false : true
    }
  },
  mounted() {
    this.id = this.$route.query.id
    if (this.id) {
      this.getFenceDetail()
    }
  },
  // 方法集合
  methods: {
    async submit() {
      await this.$refs.olmap.saveDrawPolygon()
      await this.$refs.form.validate()
      const form = _.cloneDeep(this.form)
      console.log(form)
      // return
      let aa = _.map(_.chunk(form.eara.split(','), 2), item => {
        return {
          x_point: item[0],
          y_point: item[1]
        }
      })
      form.eara = JSON.stringify(aa)
      form.railTime = this.railTime
      this.btnLoading = true
      this.form.id ? await Api.getUpdateFence(form) : await Api.getaddFence(form)
      this.btnLoading = false
      this.$message.success(this.form.id ? '修改成功' : '新建成功')
      this.$router.back()
    },
    // 网格点击事件
    girdClick(wbsCode, id) {
      // this.mapDelete = false
      // if (id === this.activeId) {
      //   this.mapDelete = true
      // }
      // console.log(111, wbsCode, id, this.activeId)
    },
    //获取时间
    getReportDate(e) {
      let a = e[0] + '-' + e[1]
      this.railTime.push(a)
    },
    addItem() {
      this.railTimes.push({ reportDate: '' })
    },
    getFenceDetail() {
      Api.getFenceDetail(this.id).then(res => {
        this.form = res.data
        this.activeId = this.form.id
        const formPoint = JSON.parse(this.form.eara)
        this.formPoint = _.flattenDeep(
          formPoint.map(item => {
            return [item.x_point, item.y_point]
          })
        )
        this.form.eara = _.join(this.formPoint)
        const multiplePoint = []
        multiplePoint.push({
          id: this.form.id,
          color: `#409eff`,
          points: this.formPoint
        })
        this.mapData.multiplePoint = multiplePoint
        this.mapDelete = true
        this.railTimes = JSON.parse(this.form.railTime).map(item => {
          return {
            reportDate: item.split('-')
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.wrap {
  display: flex;
  height: 800px;
  .aside {
    margin-right: 20px;
    width: 40%;
    /deep/ .el-card__body {
      padding: 0;
    }
  }
}
</style>

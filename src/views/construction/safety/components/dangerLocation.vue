<template>
  <el-card class="box-card" shadow="never" style="margin: 10px">
    <div slot="header" class="clearfix">
      <span>所在位置</span>
      <el-button style="float: right; padding: 3px 0" type="text"></el-button>
    </div>
    <div>
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" width="60" label="序号"> </el-table-column>
        <el-table-column prop="placeName" label="所在位置" min-width="250">
          <template slot-scope="scope">
            <template v-if="isEdit">
              <el-form-item
                class="form-item"
                label=""
                :prop="`placeList[${scope.$index}].placeName`"
                :rules="{ required: true, message: '必填', trigger: 'blur' }"
              >
                <el-input v-model="scope.row.placeName" placeholder="请输入所在位置" @blur="handleChange"> </el-input>
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.placeName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dangerDate" label="危险源时效性" align="center" width="400">
          <template slot-scope="scope">
            <template v-if="isEdit">
              <el-form-item
                class="form-item-width"
                label=""
                :prop="`placeList[${scope.$index}].timelinessEndTime`"
                :rules="{ required: true, message: '必填', trigger: 'change' }"
              >
                <el-date-picker
                  v-model="scope.row.dangerDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="报告开始时间"
                  end-placeholder="报告结束时间"
                  value-format="yyyy-MM-dd"
                  @change="e => handlePickerChange(e, scope.row)"
                >
                </el-date-picker>
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.timelinessStartTime | ymd }}~{{ scope.row.timelinessEndTime | ymd }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="principal" label="责任人" align="center" width="250">
          <template slot-scope="scope">
            <template v-if="isEdit">
              <el-form-item
                label=""
                :prop="`placeList[${scope.$index}].principal`"
                :rules="{ required: true, message: '必选', trigger: 'change' }"
                class="form-item"
              >
                <SelectUser
                  v-model="scope.row.principal"
                  valueFormat="id"
                  :multiple="false"
                  append-to-body
                  @change="handleChange"
                ></SelectUser>
              </el-form-item>
            </template>
            <span v-else>{{ scope.row.principalName }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="isEdit" class="add-btn" @click="handleAddIssue()"><i class="el-icon-plus"></i>添加</div>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'DangerLocation',
  props: {
    value: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tableData = [
          ...val.map(item => {
            return {
              ...item,
              dangerDate: item.timelinessStartTime ? [item.timelinessStartTime, item.timelinessEndTime] : []
            }
          })
        ]
      }
    }
  },
  created() {},
  methods: {
    //点击添加按钮
    handleAddIssue() {
      console.log(this.tableData)
      this.tableData.push({ placeName: '', dangerDate: [] })
      this.$emit('input', this.tableData)
    },
    //日期改变
    handlePickerChange(e, row) {
      if (!e) {
        row.timelinessStartTime = ''
        row.timelinessEndTime = ''
      }
      if (e && e.length) {
        row.timelinessStartTime = this.moment(e[0]).format('YYYY-MM-DD 00:00:00')
        row.timelinessEndTime = this.moment(e[1]).format('YYYY-MM-DD 23:59:59')
      }
      this.$emit('input', this.tableData)
    },
    handleChange() {
      this.$emit('input', this.tableData)
    },

    //删除一行
    handleDelete(index) {
      this.tableData.splice(index, 1)
      this.$emit('input', this.tableData)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
/deep/ .cell {
  padding-right: 40px;
  .el-form-item {
    margin-bottom: 0;
    .el-form-item__content {
      position: relative;
      .el-form-item__error {
        position: absolute;
        top: 7px;
        min-width: 30px;
        left: calc(100% + 5px);
        //background-color: #00bfff;
      }
    }
  }
  .form-item {
    width: 200px;
  }
  .form-item-width {
    width: 350px;
  }
}
</style>

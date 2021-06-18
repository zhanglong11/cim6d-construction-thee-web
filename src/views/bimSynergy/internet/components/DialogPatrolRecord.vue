<template>
  <el-dialog class="custom-dialog" :visible="visible" title="点位巡更记录" append-to-body width="80%" @close="close">
    <div class="patrol-record">
      <div class="patrol-title">
        <p>
          <b>巡更点名称：</b>
          <span v-text="dataValue.patrolPointName"></span>
        </p>
        <p>
          <b>巡更点位置：</b>
          <span v-text="dataValue.drawingsName"></span>
        </p>
        <p>
          <b>归属巡更路线：</b>
          <span v-text="dataValue.routeName"></span>
        </p>
      </div>
      <div class="tooltips">
        <el-form inline>
          <el-form-item>
            <el-input
              v-model="filterForm.search"
              style="width: 200px"
              placeholder="巡更人员"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="巡更时间">
            <el-date-picker
              v-model="filterForm.startDate"
              type="daterange"
              range-separator="至"
              start-placeholder="巡更开始时间"
              end-placeholder="巡更结束时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-search">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-refresh-left">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-wrap">
        <el-table ref="table" class="table" :data="tableData" height="99%" stripe>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column prop="createTime" label="巡更时间" align="center"></el-table-column>
          <el-table-column prop="groupMemberName" label="巡更人员" align="center"></el-table-column>
          <el-table-column prop="result" label="巡更结果" align="center">
            <template #default="{ row }">
              <span v-if="row.patrolResult" class="gold">正常</span>
              <span v-if="row.patrolResult === false" class="red">异常</span>
            </template>
          </el-table-column>
        </el-table>
        <Pagination class="pagination" :page="filterForm.page" :rows="total" :total="total" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogPatrolRecord',
  props: {
    visible: {},
    dataValue: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    // 这里存放数据
    return {
      filterForm: {
        status: null,
        lines: null
      },
      total: 20,
      tableData: []
    }
  },
  mounted() {
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询巡更记录
    queryList() {
      let list = []
      for (let i = 0; i < this.total; i++) {
        list.push({
          createTime: '2021-04-09 14:58:34',
          groupMemberName: '吴明民,祁浩',
          patrolResult: true
        })
      }
      this.tableData = list
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@green: #38f820;
@red: #f82020;
@gold: #71edff;
@import url('./dialogElevator');
.patrol-record {
  display: flex;
  flex-direction: column;
  height: 700px;
  .patrol-title {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    font-size: 16px;
    p {
      flex: 1;
      text-align: center;
      b {
        font-weight: normal;
        color: @gold;
      }
    }
  }
  .tooltips {
    /deep/.el-form-item__label {
      color: #fff;
    }
  }
  .table-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    /deep/.el-table {
      flex: 1;
      td {
        color: rgba(255, 255, 255, 0.8);
      }
    }
    .gold {
      color: @gold;
    }
    .red {
      color: @red;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    /deep/.el-pagination {
      .el-pagination__total,
      .el-pagination__jump {
        color: #fff;
      }
      .el-pagination__jump {
        margin-left: 15px;
      }
      .el-pager li {
        background: none;
        color: #fff;
      }
      button {
        padding: 0;
        background: #274465;
        border: 1px #396683 solid;
        color: #fff;
        &[disabled='disabled'] {
          color: rgba(255, 255, 255, 0.4);
        }
      }
    }
  }
}
@import url('../../table');
</style>

<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 18">
          <div class="item-body">
            <div class="titles">
              <h3 class="title-h3">中交天航2a标段安全隐患检查记录单</h3>
            </div>
            <div class="item-main">
              <el-row>
                <el-col>
                  <div class="item-hdc">
                    <h3>{{ form.checkDate | dateFonts }}施工现场安全隐患清单</h3>
                    <h4>建设单位:{{ form.buildCompany }}</h4>
                    <h4>施工单位:{{ form.constructionCompany }}</h4>
                    <h4>监理单位:{{ form.supervisionCompany }}</h4>
                  </div>
                  <el-table
                    :data="form.details"
                    style="width: 100%"
                    border
                    :header-cell-style="{ background: '#fff', borderColor: '#fff' }"
                  >
                    <el-table-column type="index" label="序号" align="center"></el-table-column>
                    <el-table-column label="隐患排查" align="center">
                      <el-table-column prop="safetyHiddenDangerType" label="隐患分类"> </el-table-column>
                      <el-table-column prop="locationActivity" label="位置/活动"> </el-table-column>
                      <el-table-column prop="hiddenDangerProblemDescribe" label="存在隐患或问题描述"> </el-table-column>
                      <el-table-column prop="hiddenDangerFileIds" label="隐患照片" width="300">
                        <template #default="{ row }">
                          <ImgList :ids="row.hiddenDangerFileIds"></ImgList>
                        </template>
                      </el-table-column>
                      <el-table-column prop="basisSuggestion" label="依据或建议"> </el-table-column>
                    </el-table-column>
                    <el-table-column label="隐患整改" align="center">
                      <el-table-column prop="rectificationPerson" label="整改人"> </el-table-column>
                      <el-table-column prop="rectificationMeasures" label="整改措施"> </el-table-column>
                      <el-table-column prop="afterRectificationFileIds" label="整改后照片" width="300">
                        <template #default="{ row }">
                          <ImgList :ids="row.afterRectificationFileIds" />
                        </template>
                      </el-table-column>
                    </el-table-column>
                    <el-table-column label="整改验收" align="center">
                      <el-table-column prop="qualifiedStatus" label="是否合格">
                        <template #default="{ row }">
                          {{ $getLabel(quaStatus, row.qualifiedStatus) }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="acceptanceTime" label="验收时间">
                        <template #default="{ row }">
                          {{ row.acceptanceTime ? moment(row.acceptanceTime).format('YYYY-MM-DD') : '' }}
                        </template>
                      </el-table-column>
                      <el-table-column prop="" label="验收人（笔签）"> </el-table-column>
                    </el-table-column>
                  </el-table>
                  <div class="f-o">
                    <span>检查组长:{{ form.checkGroupLeader }}</span>
                    <span>检查员:{{ form.checkGroupMembers }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>
      <el-button size="lg" @click="goDwon()">下载</el-button>
    </div>
  </div>
</template>

<script>
import { quaStatus } from '../lib/safetyStauas'
import ImagePreview from '@/components/ImagePreview'
import ImgList from '../components/imgList' //附件
import Api from '../api'
export default {
  name: 'PerilDetail',
  components: {
    // SelectLabourWorker
    ImgList,
    ImagePreview
  },
  data() {
    return {
      quaStatus,
      id: this.$route.query.id || this.$route.query.targetId || '',
      form: {},
      inDialog: false,
      fileName: '安全隐患检查明细记录.doc'
    }
  },
  computed: {},
  created() {
    if (this.id) {
      Api.getsafetyHiddenDetail(this.id).then(res => {
        this.form = { ...res.data }
      })
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.back()
    },
    async goDwon() {
      let res = await Api.getSafetyHiddenDwon(this.id)
      saveAs(res.data, this.fileName ? this.fileName : 'download.doc')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-table .cell {
  max-height: 200px;
  overflow: auto;
}
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
}
.el-input.temperature {
  display: flex;
  border-radius: 4px;
  padding: 0 15px;
  border: 1px solid #dcdfe6;
  .el-input__inner {
    border: none;
    width: 66px;
    text-align: center;
    padding: 0 3px;
  }
}
.item-body {
  .titles {
    text-align: center;
    margin-bottom: 5px;
    width: 100%;
    .title-h3 {
      margin: 0 auto;
      width: 350px;
      border-bottom: 2px solid #000;
    }
  }
}
.item-main {
  border: 1px solid #ccc;
  font-size: 14px;
  overflow: hidden;
  margin-bottom: 0px;
  background-color: #f4f4f4;
  .item-hdc {
    h3 {
      text-align: center;
      border-bottom: 1px solid #ccc;
      padding: 10px;
    }
    h4 {
      border-bottom: 1px solid #ccc;
      font-size: 16px;
      padding: 10px;
      font-weight: normal;
    }
    .b-t {
      display: inline-block;
      margin-left: 40px;
      padding: 8px 30px;
      background: red;
      border: none;
      color: #fff;
      border-radius: 10%;
    }
  }
  .f-o {
    span {
      display: inline-block;
      padding: 20px;
    }
  }
}
</style>

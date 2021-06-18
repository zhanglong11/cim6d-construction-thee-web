<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix code-title">
        <strong>设备详情</strong>
      </div>
      <el-form :model="formData" label-width="140px" class="form-con">
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="设备名称">
              {{ formData.name }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="设备编码">
              {{ formData.code }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="规格型号">
              {{ formData.models }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="设备类别">
              {{ $getLabel(equipmentType, formData.type) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="单位">
              {{ formData.unit }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="使用状态">
              {{ $getLabel(equipmentStatus, formData.useStatus) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="设备来源">
              {{ $getLabel(sourceList, formData.source) }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="使用位置">
              {{ formData.location }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="品牌">
              {{ formData.brand }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="供应商">
              {{ formData.supplier }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="生产厂家">
              {{ formData.manufacturer }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="使用人">
              {{ formData.userName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="责任人">
              {{ formData.principalName }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="使用人联系电话">
              {{ formData.userPhone }}
            </el-form-item>
          </el-col> </el-row
        ><el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="使用人身份证号">
              {{ formData.userIdentityCard }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="特种设备使用证号">
              {{ formData.specialEquipmentCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="车牌号">
              {{ formData.plateNumber }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="创建人">
              {{ formData.creatorName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="创建时间">
              {{ formData.createTime }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="备注">
              {{ formData.remark }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="24" :md="12">
            <el-form-item label="附件" class="code-file">
              <!--              <FileList :ids="formData.fileIds" />-->
              <div>
                <ul v-if="formData.files && formData.files.length">
                  <li v-for="(item, index) in formData.files" :key="index" class="fileItem">
                    <span>{{ item.fileName }}</span>
                    <PreviewUrl :fileUrl="item.fileUrl" />
                    <!--                    <DownloadByFileId :file-id="item.id" :file-name="item.fileName" />-->
                  </li>
                </ul>
                <ul v-else>
                  <li style="margin-left: 10px">无附件</li>
                </ul>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix code-title">
        <span>设备保养记录</span>
      </div>
      <div v-if="formData.equipmentMaintenanceRecords.length">
        <ul v-for="(item, index) in formData.equipmentMaintenanceRecords" :key="index" class="code-record-list">
          <li>{{ item.maintenancePersonName }}</li>
          <li>{{ item.times }}</li>
        </ul>
      </div>
      <div v-else class="code-no-data">暂无数据</div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix code-title">
        <span>设备维修记录</span>
      </div>
      <div v-if="formData.equipmentRepairRecords.length">
        <ul v-for="(item, index) in formData.equipmentRepairRecords" :key="index" class="code-record-list">
          <li>{{ item.maintenancePersonName }}</li>
          <li>{{ item.times }}</li>
        </ul>
      </div>
      <div v-else class="code-no-data">暂无数据</div>
    </el-card>
  </div>
</template>

<script>
import Api from '../../api/equipment/list'
import sourceList from './lib/sourceList'
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from './lib/equipmentType'
export default {
  name: 'EquipmentDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      // id: '60070636687638144', // 模拟数据
      formData: {
        equipmentMaintenanceRecords: [],
        equipmentRepairRecords: []
      },
      sourceList,
      equipmentStatus,
      equipmentType
    }
  },
  created() {},
  mounted() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.infoQrcodeDetail(this.id)
      this.formData = res.data
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.box-card {
  margin-bottom: 8px;
}

.code-record-list {
  display: flex;
  padding: 2px 0px;
  li {
    flex: 1;
    text-align: center;
  }
}

.code-no-data {
  padding: 8px;
  text-align: center;
}

.code-file {
  /deep/ li {
    margin: 0px !important;
  }
}

@media (max-width: 500px) {
  .code-title {
    text-align: center;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  /deep/ .el-form-item__label {
    text-align: left;
    padding-left: 10px;
  }
  /deep/ .el-card__body {
    padding: 4px;
  }
  /deep/ .el-dialog__wrapper {
    .el-dialog {
      width: 600rpx;
    }
  }
  .preview-image {
    width: 100%;
  }
  /deep/ .el-form-item--small .el-form-item__content {
    word-break: break-all;
  }
  .code-no-data {
    font-size: 14px;
    color: #999;
  }
}
</style>

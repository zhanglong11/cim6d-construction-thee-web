<template>
  <div>
    <div class="project-intro">
      <p style="width: 100%">
        <span>项目名称:</span> <span>{{ details.name }}</span>
      </p>
      <p>
        <span>项目类型:</span> <span>{{ $getLabelFromArg('projectType', details.type) }}</span>
      </p>
      <p>
        <span>项目负责人:</span> <span>{{ details.principalName }}</span>
      </p>
      <p>
        <span>联系电话:</span> <span>{{ details.telephone }}</span>
      </p>
      <p>
        <span>项目地址:</span> <span>{{ details.province }}{{ details.city }}{{ details.county }}</span>
      </p>
      <p>
        <span>详细地址:</span> <span>{{ details.detailAddress }}</span>
      </p>
      <p>
        <span>项目规模:</span> <span>{{ $getLabelFromArg('projectScale', details.scale) }}</span>
      </p>
      <p>
        <span>建筑总规模:</span> <span>{{ details.totalBuildingScale }}</span>
      </p>
      <p>
        <span>建筑高度:</span> <span>{{ details.buildingHeight }} 米</span>
      </p>
      <p>
        <span>建筑面积:</span> <span>{{ details.buildingArea }} ㎡</span>
      </p>
      <p>
        <span>结构形式:</span> <span>{{ details.structuralStyle }}</span>
      </p>
      <p>
        <span>工程造价:</span> <span>{{ details.constructionCosts }} 万元</span>
      </p>
      <p>
        <span>抗震等级:</span> <span>{{ $getLabelFromArg('seismicLevel', details.seismicLevel) }}</span>
      </p>
      <p>
        <span>合同开工时间:</span> <span>{{ details.startTime }}</span>
      </p>
      <p>
        <span>合同竣工时间:</span> <span>{{ details.endTime }}</span>
      </p>
      <p>
        <span>项目状态:</span> <span>{{ $getLabelFromArg('projectStatus', details.projectStatus) }}</span>
      </p>
      <p>
        <span>备注:</span> <span>{{ details.remark }}</span>
      </p>
    </div>
    <el-card class="card-item">
      <div slot="header" class="clearfix">
        <span>项目图片</span>
      </div>
      <!-- 宣传图 start -->
      <el-card class="card-item" shadow="hover">
        <div slot="header" class="clearfix">
          <span>宣传图</span>
        </div>
        <div class="one-img">
          <template v-for="(item, i) in imageListGroup[1]">
            <div :key="item.fileId + '_' + i" class="mask-title">
              <p>
                <span>{{ item.fileName }}</span>
                <span class="time">{{ item.createTime }}</span>
              </p>
              <p v-if="item.remark" class="remark" v-text="item.remark"></p>
            </div>
            <el-image :key="i" :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
          </template>
        </div>
      </el-card>
      <!-- 宣传图 end -->
      <!-- 全景图 start -->
      <el-card v-show="imageListGroup[2].length > 0" class="card-item" shadow="hover">
        <div slot="header" class="clearfix">
          <span>全景图</span>
        </div>
        <div class="one-img">
          <template v-for="(item, i) in imageListGroup[2]">
            <div :key="item.fileId + '_' + i" class="mask-title">
              <p>
                <span>{{ item.fileName }}</span>
                <span class="time">{{ item.createTime }}</span>
              </p>
              <p v-if="item.remark" class="remark" v-text="item.remark"></p>
            </div>
            <el-image :key="i" :src="item.fileUrl" :preview-src-list="[item.fileUrl]" />
          </template>
        </div>
      </el-card>
      <!-- 全景图 end -->
      <!-- 形象进度图 start -->
      <el-card v-show="imageListGroup[3].length > 0" class="card-item" shadow="hover">
        <div slot="header" class="clearfix">
          <span>形象进度图</span>
          <!-- <div class="card-extend">
            <el-button
              type="text"
              icon="el-icon-picture"
              class="type-icon"
              :class="{ active: !progressImgType }"
              @click="progressImgType = 0"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-tickets"
              class="type-icon"
              :class="{ active: progressImgType }"
              @click="progressImgType = 1"
            ></el-button>
          </div> -->
        </div>
        <div v-if="!progressImgType" class="roll-img" :class="{ open: isPreviewProgress }">
          <carousel :perPage="4" :scrollPerPage="false" navigationEnabled :paginationEnabled="false">
            <slide v-for="(item, i) in imageListGroup[3]" :key="i">
              <div class="mask-title">
                <p>
                  <span>{{ item.fileName }}</span>
                  <span class="time">{{ item.createTime }}</span>
                </p>
                <p v-if="item.remark" class="remark" v-text="item.remark"></p>
              </div>
              <el-image
                :src="item.fileUrl"
                :preview-src-list="_.map(imageListGroup[3], 'fileUrl')"
                @click="previewImage('isPreviewProgress')"
              />
            </slide>
          </carousel>
        </div>
        <el-table
          v-else
          :data="imageListGroup[3]"
          style="width: 100%"
          element-loading-background="rgba(0, 0, 0, 0.5)"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column type="index" label="编号" width="55" align="center" />
          <el-table-column prop="fileName" label="图片名称" />
          <!-- <el-table-column prop="remark" label="备注" /> -->
          <el-table-column prop="uploadTime" width="120" align="center" label="上传时间">
            <template slot-scope="{ row }">
              {{ row.uploadTime | formatData }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="imgView"
                >预览
                <el-image :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 形象进度图 end -->

      <!-- 平面图 start -->
      <el-card v-show="imageListGroup[4].length > 0" class="card-item" shadow="hover">
        <div slot="header" class="clearfix">
          <span>平面图</span>

          <!-- <div class="card-extend">
            <el-button
              type="text"
              icon="el-icon-picture"
              class="type-icon"
              :class="{ active: !planeImgType }"
              @click="planeImgType = 0"
            ></el-button>
            <el-button
              type="text"
              icon="el-icon-tickets"
              class="type-icon"
              :class="{ active: planeImgType }"
              @click="planeImgType = 1"
            ></el-button>
          </div> -->
        </div>
        <div v-if="!planeImgType" class="roll-img" :class="{ open: isPreviewPlane }">
          <carousel :perPage="4" :scrollPerPage="false" navigationEnabled :paginationEnabled="false">
            <slide v-for="(item, i) in imageListGroup[4]" :key="i">
              <div class="mask-title">
                <p>
                  <span>{{ item.fileName }}</span>
                  <span class="time">{{ item.createTime }}</span>
                </p>
                <p v-if="item.remark" class="remark" v-text="item.remark"></p>
              </div>
              <el-image
                :src="item.fileUrl"
                :preview-src-list="_.map(imageListGroup[4], 'fileUrl')"
                @click="previewImage('isPreviewPlane')"
              />
            </slide>
          </carousel>
        </div>
        <el-table
          v-else
          :data="imageListGroup[4]"
          style="width: 100%"
          element-loading-background="rgba(0, 0, 0, 0.5)"
          element-loading-text="数据加载中..."
          element-loading-spinner="el-icon-loading"
        >
          <el-table-column type="index" label="编号" width="55" align="center" />
          <el-table-column prop="fileName" label="图片名称" />
          <!-- <el-table-column prop="remark" label="备注" /> -->
          <el-table-column prop="uploadTime" width="120" align="center" label="上传时间">
            <template slot-scope="{ row }">
              {{ row.uploadTime | formatData }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60" align="center">
            <template slot-scope="scope">
              <el-button type="text" class="imgView"
                >预览
                <el-image :src="scope.row.fileUrl" :preview-src-list="[scope.row.fileUrl]" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 平面图 end -->
    </el-card>
    <!-- 项目参与方 start -->
    <h6 v-if="partiesRecordList.length > 0">项目参与方</h6>
    <el-card v-for="(item, i) in partiesRecordList" :key="i" class="card-item" shadow="hover">
      <div slot="header" class="clearfix">
        <i class="image-icon icon-image-company-group"></i><span v-text="item.dataName"></span>
      </div>
      <el-table :data="item.children" style="width: 100%" border>
        <el-table-column prop="dataName" label="参与方名称" min-width="180" align="center"></el-table-column>
        <el-table-column prop="userNumber" label="参项人员数量" min-width="180" align="center"></el-table-column>
      </el-table>
    </el-card>
    <!-- 项目参与方 end -->
  </div>
</template>

<script>
import { getProjectById } from '@/api/project'
import { Carousel, Slide } from 'vue-carousel'
import treeForEach from '@/utils/treeForEach'
import { roleApi } from '@/views/company/api/role'
import toTree from '@/utils/toTree'

export default {
  name: 'SystemProjectDetails',
  components: {
    Carousel,
    Slide
  },
  props: {
    projectId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeName: '1',
      tableLoading: false,
      imgList: [
        { id: 1, name: 'fdsfe' },
        { id: 2, name: 'ffefsfe' }
      ],
      projectUserCategory: this.$route.query.projectUserCategory || '', // 参项单位类型
      details: {},
      imageListGroup: {
        1: [], // 宣传图
        2: [], // 全景图
        3: [], // 形象进度图
        4: [] // 平面图
      }, // 未确认的图片列表
      progressImgType: 1, // 形象进度图展示类型
      planeImgType: 1, // 平面图展示类型
      isPreviewProgress: false,
      isPreviewPlane: false,
      partiesRecordList: [] // 参与方数据
    }
  },
  watch: {
    projectId(val) {
      if (val) {
        this.getProject()
        this.getPartiesRecordList()
      }
    }
  },
  mounted() {},
  methods: {
    // 查询项目详情
    async getProject() {
      if (!this.projectId) {
        return
      }
      const { data } = await getProjectById(this.projectId)
      this.imageListGroup = {
        1: [], // 宣传图
        2: [], // 全景图
        3: [], // 形象进度图
        4: [] // 平面图
      }
      data.imageList = data.imageList || []
      data.imageList.forEach(item => {
        this.imageListGroup[item.imageType].push(item)
      })
      data.address = data.address ? data.address.split('_') : []
      this.details = data
    },
    // 获取项目参与方数据
    async getPartiesRecordList() {
      let { data } = await roleApi.getCompanyList({ typeList: [1, 2, 3] }, this.projectId)
      data = _.filter(data, ({ participantType, organType }) => participantType === 2 && organType !== 1)
      let treeData = toTree(data, 'parentId')
      _.pullAllWith(treeData, { participantType: 2 }, _.isEqual)
      this.partiesRecordList = treeData
    },
    // 图片预览 - 兼容轮播图处理
    previewImage(key) {
      this[key] = true
      this.$nextTick(() => {
        let closeDom = document.getElementsByClassName('el-icon-circle-close')
        closeDom[0].onclick = () => {
          this[key] = false
        }
        document.addEventListener(
          'keydown',
          e => {
            if (e.which === 27) {
              this[key] = false
            }
          },
          false
        )
      })
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.project-intro {
  background: #f5f8f9;
  padding: 25px 0;
  font-size: 12px;
  color: #313131;
  display: flex;
  flex-wrap: wrap;
  > p {
    width: 50%;
    padding: 0 15px;
    &:not(:nth-last-child(-n + 2)) {
      margin-bottom: 10px;
    }
    > span:first-child {
      color: #888;
      margin-right: 5px;
    }
  }
}

h6 {
  font-size: 14px;
  margin: 10px 0 10px;
  font-weight: bold;
}
.imgView {
  position: relative;
  /deep/.el-image {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  /deep/.el-image__preview {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
  }
}
.card-item {
  position: relative;
  & + .card-item {
    margin-top: 15px;
  }
}
.one-img {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  img {
    width: auto;
    max-width: 100%;
    height: 400px;
  }

  &:hover {
    .mask {
      opacity: 1;
      visibility: visible;
    }
  }
}
.mask-title {
  position: absolute;
  padding: 0 10px;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 2;
  p {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 0 10px;
    .time {
      color: #ccc;
    }
    &.remark {
      padding-bottom: 10px;
      height: auto;
      color: #ccc;
    }
  }
}

/deep/.el-image {
  width: 100%;
  height: 100%;
  display: block;
}

.card-extend {
  float: right;
  .type-icon {
    font-size: 18px;
    color: #999;
    &.active {
      color: #409eff;
    }
  }
}
.image-icon {
  display: inline-block;
  vertical-align: center;
  width: 14px;
  height: 14px;
  transform: scale(1.4);
  background-size: cover;
  margin-right: 10px;
  & + & {
    margin-left: 8px;
  }
  &.icon-image-company-group {
    background-image: url(~@/assets/images/project/company-group.png);
  }
}
</style>

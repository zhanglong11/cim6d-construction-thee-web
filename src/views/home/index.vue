<template>
  <div class="no-padding">
    <div class="home-main">
      <div class="home-main-wrap">
        <div class="left-container">
          <el-card class="banner-wrap" :header="companyInfo.name">
            <el-image
              v-if="companyInfo.companyImage"
              :src="companyInfo.companyImageUrl"
              :preview-src-list="[companyInfo.companyImageUrl]"
            />
            <img v-else style="width: 100%" src="~@/assets/images/company-banner.png" alt="" />
            <article v-html="companyInfo.companyIntroductionHtml"></article>
          </el-card>
          <el-card class="project-list" header="我的项目">
            <el-table border stripe height="99%" size="mini" :data="projectList">
              <el-table-column align="center" prop="code" label="项目编号" width="100px"></el-table-column>
              <el-table-column align="center" label="项目名称" show-overflow-tooltip min-width="200" prop="name">
                <template slot-scope="{ row }">
                  <span
                    v-if="row.projectUserCategory === 1"
                    class="el-icon-star-on"
                    style="color: green; font-size: 18px; margin-right: 5px"
                  />
                  <router-link to="" @click.native="handleEnterProject(row)">{{ row.name }}</router-link>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="companyName"
                show-overflow-tooltip
                min-width="150"
                label="所属企业"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="principalName"
                show-overflow-tooltip
                label="项目负责人"
                width="100px"
              ></el-table-column>
              <el-table-column align="center" label="项目地址" show-overflow-tooltip width="160">
                <template #default="{ row }"> {{ row.province }} {{ row.city }} {{ row.county }} </template>
              </el-table-column>
              <!-- <el-table-column align="center" label="项目类型" width="80">
                <template slot-scope="scope">{{ $getLabelFromArg('projectType', scope.row.type) }}</template>
              </el-table-column> -->
              <el-table-column align="center" prop="projectStatus" label="项目状态" width="80">
                <template slot-scope="scope">{{ $getLabelFromArg('projectStatus', scope.row.projectStatus) }}</template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="250" fixed="right">
                <template #default="{ row }">
                  <el-button type="text" @click="handleEnterProject(row)">进入项目</el-button>
                  <el-button v-if="row.directorFlag" type="text" @click="handleProjectSettings(row)">配置</el-button>
                  <el-button type="text" @click="activeProjectId = row.id">详情</el-button>
                  <el-button
                    v-if="row.projectUserCategory === 1 && row.directorFlag"
                    type="text"
                    @click="handleRemoveProject(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
        <div class="right-aside">
          <el-card header="项目介绍">
            <ProjectDetail :projectId="activeProjectId"></ProjectDetail>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { removeProject } from '@/api/project'
import api from '@/api'
import ProjectDetail from './components/ProjectDetail'
import fileApi from '@/api/file'
export default {
  name: 'Home',
  // import引入的组件需要注入到对象中才能使用
  components: { ProjectDetail },
  data() {
    // 这里存放数据
    return {
      companyInfo: {},
      activeProjectId: null
    }
  },
  computed: {
    projectList() {
      return this.$store.state.project.projectList
    }
  },
  watch: {
    projectList(val) {
      this.activeProjectId = this.projectList.length > 0 ? this.projectList[0].id : ''
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      this.$store.dispatch('user/getInfo')
      api.getCompanyInfo().then(res => {
        let datas = res.data
        datas.companyIntroductionHtml = datas.companyIntroduction
          ? datas.companyIntroduction.replace(/<.*?>/g, '').replace(/↵|\n/g, '<br>')
          : ''
        this.getFileUrl(datas)
      })
      this.$store.dispatch('queryProjectList').then(res => {
        this.activeProjectId = this.projectList.length > 0 ? this.projectList[0].id : ''
      })
    },
    // 获取文件url
    async getFileUrl(data) {
      if (!data.companyImage) return false
      let ids = [data.companyImage]
      let result = await fileApi.getFileList(ids)
      let datas = result.data
      let companyInfo = data
      companyInfo.companyImageUrl = datas.length > 0 ? datas[0].fileUrl : ''

      this.companyInfo = companyInfo
    },
    // 进入项目
    handleEnterProject(project) {
      this.$store.commit('setProjectLocalStorage', project)
      this.$store.dispatch('bim/setBimModelId')
      // this.$store.dispatch('getDepartmentUserList')
    },
    // 项目配置
    handleProjectSettings(project) {
      this.$store.commit('setProjectType', project.type)
      this.$store.commit('setProjectId', project.id)
      this.$store.commit('setProjectDetail', project)
      localStorage.setItem('currentProjectSettingsId', project.id)
      localStorage.setItem('currentProjectSettingsType', project.type)
      /*if (project.projectUserCategory === 2) {
        this.$router.push({ name: 'SystemProjectEdit', query: { projectId: project.id } })
      } else {
        this.$router.push({
          name: 'SystemProjectDepartmentManage'
        })
      }*/
      this.$router.push({
        name: 'SystemProjectDepartmentManage'
      })
    },
    //删除项目
    async handleRemoveProject(row) {
      await this.$tipRemove([row])
      await removeProject(row.id)
      await this.refresh()
      await this.$message.success('删除成功')
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
@import '~@/styles/common.less';
.home-main {
  margin-top: 20px;
  .home-main-wrap {
    display: flex;
  }
}
.left-container {
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  article {
    font-size: 12px;
    line-height: 30px;
  }
  .banner-wrap {
    overflow: auto;
    flex: 2;
    .scrollbar();
  }
  .project-list {
    flex: 1;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    /deep/.el-card__body {
      flex: 1;
    }
    .el-table {
      /deep/ .el-table__body-wrapper {
        .scrollbar();
      }
    }
  }
}
.right-aside {
  width: 600px;
  min-width: 600px;
  margin-left: 15px;
  .scrollbar();
  max-height: calc(100vh - 90px);
  overflow: auto;
}
.el-card + .el-card {
  margin-top: 15px;
}
.el-card {
  /deep/ .el-card__header {
    border-bottom: none;
    font-weight: bold;
    padding-bottom: 0;
    min-height: unset;
  }
  /deep/ .el-card__body {
    padding-top: 10px;
  }
}
</style>

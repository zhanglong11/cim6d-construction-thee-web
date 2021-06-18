<template>
  <div class="navbar">
    <hamburger
      v-if="!$route.meta.hiddenSidebar"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <img
      v-else
      style="height: 30px; margin: 0 0 0 20px; cursor: pointer"
      src="~@/assets/images/logo-full.png"
      alt="返回首页"
      @click="toHome()"
    />
    <div class="menu-list">
      <breadcrumb class="breadcrumb-container" />
      <!-- <el-menu
        :default-active="'/' + $route.path.split('/')[1]"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#409eff"
        router
        v-if="isShowHeaderMenu"
      >
        <template v-for="item in menuList">
          <el-menu-item :key="item.path" :index="item.path" v-if="item.name !== 'WorkBench'">{{ item.meta.title }}</el-menu-item>
        </template>
      </el-menu> -->
    </div>

    <div class="right-menu clearfix">
      <template v-if="isShowHeaderMenu">
        <el-switch
          v-if="ignorePermissionsVisible"
          v-model="ignorePermissions"
          title="显示所有菜单和按钮"
          inactive-text="开发者模式"
          style="margin-right: 15px"
        >
        </el-switch>
        <template v-if="!$route.meta.hiddenNavProjectSelect">
          当前项目：
          <el-select
            v-model="projectId"
            :disabled="!ignorePermissionsVisible"
            placeholder="请选择"
            style="margin-right: 15px"
            @change="changeProject"
          >
            <el-option v-for="item in projectData" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </template>
      <el-badge
        v-if="!$route.meta.hiddenBimSynergy && $hasPower('NoticeManage')"
        :value="unreadNum"
        :hidden="!unreadNum"
        :max="99"
        style="margin-right: 10px"
      >
        <el-button plain icon="el-icon-bell" @click="toMessage()"></el-button>
      </el-badge>
      <div class="background-wrap">
        <template v-if="$route.meta.isHome">
          <router-link to="/userCenter">个人中心</router-link>
          <router-link v-if="companyAdminFlag || systemPower.length > 0" to="" @click.native="toCompany()"
            >企业配置</router-link
          >
        </template>
        <template v-if="!$route.meta.hiddenBimSynergy && $hasPower('BimSynergy')">
          <a style="display: flex; align-items: center; font-weight: bold" @click="toBimSynergy">
            <span class="el-icon-office-building" style="margin-right: 5px"></span>
            项目展示
          </a>
        </template>

        <a v-if="appInfo" href="/download" target="_blank">APP下载</a>
        <el-avatar
          :size="26"
          :src="avatar || '/img/default-user.png' + '?imageView2/1/w/80/h/80'"
          class="user-avatar"
        />
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <span class="user-name">{{ userName }}</span>
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <router-link to="/home">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      v-if="$store.state.project.addProjectDialog"
      width="80%"
      class="beauty"
      :visible="$store.state.project.addProjectDialog"
      title="新建项目"
      @close="$store.commit('setAddProjectDialog', false)"
    >
      <ProjectAdd ref="projectAdd" isHome></ProjectAdd>
      <footer slot="footer">
        <el-button @click="$store.commit('setAddProjectDialog', false)">取消</el-button>
        <el-button type="primary" @click="() => $refs.projectAdd.saveProject()">提交</el-button>
      </footer>
    </el-dialog>

    <!-- 扫码下载APP start -->
    <el-dialog title="扫码下载APP" :visible.sync="downloadApp" width="540px">
      <el-form>
        <el-form-item label="安卓版" :label-width="formLabelWidth">
          <ImagePreview :id="appInfo.androidQrCode"></ImagePreview>
        </el-form-item>
        <br />
        <br />
        <el-form-item label="IOS版" :label-width="formLabelWidth">
          <ImagePreview :id="appInfo.iosQrCode"></ImagePreview>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="downloadApp = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 扫码下载APP end -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb/old-breadcrumb'
import { messageApi } from '@/api/message'
import { workBenchApi } from '@/api/work-bench'
import { getOrigin } from '@/utils/'
import ProjectAdd from '@/views/project/project-add'
import ImagePreview from '@/components/ImagePreview'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ProjectAdd,
    ImagePreview
  },
  data() {
    return {
      unreadNum: 0,
      projectId: '',
      projectData: [],
      projectIdList: [],
      getOrigin,
      formLabelWidth: '150px',
      downloadApp: false,
      appInfo: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
    menuList() {
      return this.$store.state.app.menuList.filter(e => !e.hidden && e.meta)
    },
    userName() {
      return this.$store.state.user.name
    },
    // 是否显示头部菜单
    isShowHeaderMenu() {
      return this.$route.path.indexOf('/work-bench/') < 0
    },
    //是否显示开发者模式按钮
    ignorePermissionsVisible() {
      return process.env.NODE_ENV === 'development'
    },
    // 忽视权限,显示所有菜单和按钮
    ignorePermissions: {
      get() {
        return process.env.NODE_ENV === 'development' && localStorage.getItem('ignorePermissions') === 'true'
      },
      set(val) {
        localStorage.setItem('ignorePermissions', '' + val)
        location.reload()
      }
    },
    // 当前项目id
    currentProjectId() {
      return this.$store.state.project.projectId
    },
    token() {
      return this.$store.state.user.token
    },
    companyAdminFlag() {
      return this.$store.state.user.companyAdminFlag
    },
    systemPower() {
      return this.$store.state.userPower.systemPower
    }
  },
  watch: {
    // 监听路由改变
    $route(to, from) {
      this.getUnread()
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.projectId = this.currentProjectId
      this.queryProjectList()
      this.getUnread()
      this.queryAppList()
      this.queryOrganizationTree()
      this.$store.dispatch('userPower/getSystemPower')
    },
    // 跳转企业配置
    toCompany() {
      if (this.systemPower.length < 2) {
        return
      }
      this.$router.push({
        name: this.systemPower[1]
      })
    },
    // 企业组织架构树
    async queryOrganizationTree() {
      if (!this.projectId) {
        return
      }
      let result = await workBenchApi.getOrganizationTree()
      let datas = result.data
      let list = []
      const formatDataArray = array => {
        array.map(e => {
          if (e.child && e.child.length > 0) {
            if (e.organType === 3) {
              list.push(e)
            }
            formatDataArray(e.child)
          }
        })
      }
      formatDataArray(datas)
      const formatArray = array => {
        array.map(e => {
          e.name = e.dataName
          e.type = e.organType === 6 ? 3 : null
          e.targetId = e.dataUnicode
          e.children = e.child
          e.label = e.dataName
          e.value = e.dataUnicode
          e.userId = e.dataUnicode
          if (e.child) {
            formatArray(e.child)
          }
        })
      }
      formatArray(list)
      // console.log('企业组织架构树', list)
      this.$store.commit('userPower/setOrganizationTree', list)
    },
    // 查询APP信息
    async queryAppList() {
      let params = {
        appCode: '__UNI__24AA3C2',
        page: 1,
        rows: 10
      }
      let result = await workBenchApi.queryAppList(params)
      let datas = result.data.records || []
      if (datas.length > 0) {
        this.appInfo = datas[0]
      }
    },
    // 获取项目消息
    async getUnread() {
      if (this.$route.meta.isHome) {
        return
      }
      let res = await messageApi.getUnreadMessage()
      this.unreadNum = res.data || 0
    },
    // 跳转消息列表
    toMessage() {
      this.$router.push({
        name: 'NoticeManage',
        query: {
          readStatus: 0
        }
      })
    },
    toBimSynergy() {
      const lastLeaveUrl = sessionStorage.getItem('lastLeaveUrl')
      if (lastLeaveUrl) {
        sessionStorage.setItem('lastLeaveUrl', this.$route.fullPath)
        this.$router.push(lastLeaveUrl)
      } else {
        this.$router.push('/bimSynergy')
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      //this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 跳转路由
    goToUrl(path) {
      this.$router.push({ path })
    },
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      const projectIdList = []
      datas.map(item => {
        item.value = item.id
        item.label = item.name
        // 只加载当前项目
        if (process.env.NODE_ENV === 'development' || item.id === this.currentProjectId) {
          projectIdList.push(item.id)
        }
      })
      this.projectIdList = projectIdList
      if (process.env.NODE_ENV === 'development') {
        this.projectData = datas
        this.$store.dispatch('setSystemConfigStorage')
      } else {
        this.$store.dispatch('setSystemConfigStorage')
        this.projectData = datas.filter(e => e.id === this.currentProjectId)
      }
    },
    // 选择项目
    changeProject(id) {
      const index = this.projectIdList.indexOf(id)
      this.toProject(this.projectData[index])
    },
    // 跳转项目详情
    toProject(item) {
      this.$store.commit('setProjectLocalStorage', item)
    },
    // 跳转首页
    toHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.info {
  font-size: 20px;
  display: inline-block;
  margin-right: 30px;
  cursor: pointer;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .menu-list {
    flex: 1;
    white-space: nowrap;
    overflow-x: auto;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 50px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .background-wrap {
      height: 100%;
      padding-left: 30px;
      clip-path: polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 100%);
      display: flex;
      align-items: center;
      background-color: $--color-primary;
      color: #eee;
      font-size: 14px;
      > a {
        color: #fff;
        &:hover {
          color: #ddd;
        }
      }
      > * {
        margin-right: 10px;
      }

      .user-name {
        cursor: pointer;
        padding-right: 6px;
        color: #eee;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      display: flex;
      align-items: center;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
          padding-right: 12px;
        }
      }
    }
  }
}
.to-admin {
  margin-right: 10px;
  padding: 9px 15px;
  color: #fff;
  background-color: #409eff;
  border: #409eff 1px solid;
  line-height: 1;
  font-size: 12px;
  border-radius: 20px;
  transition: 0.4s;
  display: inline-flex;
  align-items: center;
  span {
    margin-right: 5px;
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>

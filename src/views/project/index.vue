<template>
  <div class="app-wrapper">
    <navbar />
    <el-tabs v-model="tabIndex" class="custom-menu" type="card" @tab-click="clickTab">
      <el-tab-pane label="首页" name="CompanyHome"></el-tab-pane>
      <el-tab-pane v-for="{ label, name } in tabs" :key="name" :name="name" :label="label"></el-tab-pane>
    </el-tabs>
    <div class="main-wrap">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
  </div>
</template>

<script>
import { Navbar } from '@/layout/components'
import projectRouter from './router'
export default {
  components: {
    Navbar
  },
  data() {
    //这里存放数据
    return {
      tabIndex: this.$route.name
    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    routerName() {
      return this.$route.name
    },
    companyAdminFlag() {
      return this.$store.state.user.companyAdminFlag
    },
    projectDetail() {
      return this.$store.state.project.projectDetail
    },
    projectUserCategory() {
      return this.$store.state.project.projectDetail.projectUserCategory
    },
    tabs() {
      return projectRouter
        .filter(item => !item.hidden)
        .filter(item => !item.onlyHostVisible || this.projectUserCategory === 1)
        .map(item => ({
          name: item.name,
          label: item.meta?.title
        }))
    }
  },
  watch: {
    routerName(val) {
      this.tabIndex = val
    }
  },
  created() {
    this.$store.dispatch('userPower/getSystemPower')
  },
  //方法集合
  methods: {
    // 选项卡切换
    clickTab() {
      if (this.tabIndex === 'CompanyHome') {
        this.$router.push('/home')
        return
      }
      this.$router.push({
        name: this.tabIndex
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/companyBase');
</style>

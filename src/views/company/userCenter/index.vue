<template>
  <div class="app-wrapper">
    <navbar />
    <el-card>
      <el-tabs :tab-position="tabPosition" class="menuList">
        <el-tab-pane label="企业信息">
          <h4>企业信息</h4>
          <EnterpriseInfo />
        </el-tab-pane>
        <el-tab-pane label="个人信息">
          <h4>个人信息</h4>
          <CenterInfo />
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          修改密码
          <ChangePassword />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import EnterpriseInfo from './components/EnterpriseInfo'
import CenterInfo from './components/CenterInfo'
import ChangePassword from './components/ChangePassword'
import { Navbar } from '@/layout/components'
export default {
  name: 'SystemCenter',
  components: {
    EnterpriseInfo,
    CenterInfo,
    ChangePassword,
    Navbar
  },
  data() {
    return {
      tabPosition: 'left'
      // fit: 'fill',
      // src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  }
}
</script>

<style scoped lang="less">
.menuList {
  overflow-y: auto;
  /deep/.el-tabs__item.is-active {
    background: #e6f7ff;
  }
  h4 {
    font-size: 18px;
  }
}
.title {
  background: #f2f2f2;
  border: 3px;
  padding: 5px 10px;
  margin: 10px 0;
  font-size: 15px;
}
</style>

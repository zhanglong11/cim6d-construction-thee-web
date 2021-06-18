<template>
  <div id="tabList" class="container tabList">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="智能设备" name="first">
        <Elevator></Elevator>
      </el-tab-pane>
      <el-tab-pane label="智能巡更" name="five">
        <Inspection v-if="activeName === 'five'"></Inspection>
      </el-tab-pane>
      <el-tab-pane label="绿色施工" name="six">
        <GreenConstruction v-if="activeName === 'six'"></GreenConstruction>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Elevator from './components/Elevator'
// import Monitoring from './components/Monitoring'
// import Ammeter from './components/Ammeter'
// import WaterMeter from './components/WaterMeter'
import Inspection from './components/Inspection'
import GreenConstruction from './components/GreenConstruction'
import bimConfig from '../bimConfig' // bim模型配置
export default {
  name: 'BimSynergyInternet',
  components: {
    Elevator,
    // Monitoring,
    Inspection,
    // Ammeter,
    // WaterMeter,
    GreenConstruction
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  watch: {
    activeName(val) {
      if (val === 'first') {
        this.formatBim()
      } else {
        this.$parent.disableBim = true
      }
    }
  },
  mounted() {
    this.formatBim()
  },
  beforeDestroy() {
    this.formatBim('-')
  },
  methods: {
    // 处理bim是否显示
    formatBim(type = '+') {
      let parent = this.$parent
      let rightWidth = type === '+' ? 500 : 400
      let defaultHeight = 45
      parent.rightWidth = rightWidth
      parent.disableBim = false
      parent.bimConHeight = bimConfig.bimConHeight + defaultHeight
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./internet');
</style>

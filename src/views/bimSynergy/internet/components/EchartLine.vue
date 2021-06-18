<template>
  <div :id="container" style="height: 100%"></div>
</template>

<script>
import Echarts from 'echarts'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 图表容器
    container: {
      type: String,
      default: 'PictorialBar'
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    //这里存放数据
    return {
      myChart: null
    }
  },
  watch: {
    dataList(val) {
      this.initChart()
    }
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose()
    }
  },
  //方法集合
  methods: {
    initChart() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: '#007ae5',
        grid: {
          left: '2%',
          right: '0',
          bottom: '4%',
          top: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#15205B'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: '#fff', // x轴颜色
              fontWeight: 'normal',
              fontSize: '14',
              lineHeight: 22
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#15205B'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.2)' //左侧显示线
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: 'rgba(255,255,255,0.5)',
              fontSize: 14
            }
          }
        },
        series: this.dataList
      }

      this.$nextTick(() => {
        this.myChart = Echarts.init(document.getElementById(this.container))
        this.myChart.setOption(option)
        window.addEventListener('resize', () => {
          this.myChart.resize()
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>

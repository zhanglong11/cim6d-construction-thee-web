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
      default: 'Pictorial3DBar'
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
      // 多系列无法定位

      let colors = [
        {
          type: 'linear',
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#007ae5'
            },
            {
              offset: 0.5,
              color: '#007ae5'
            },
            {
              offset: 0.5,
              color: '#00b4f2'
            },
            {
              offset: 1,
              color: '#00b4f2'
            }
          ]
        },
        {
          type: 'linear',
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#0076e0'
            },
            {
              offset: 0.5,
              color: '#0076e0'
            },
            {
              offset: 0.5,
              color: '#00a5eb'
            },
            {
              offset: 1,
              color: '#00a5eb'
            }
          ]
        },
        {
          type: 'linear',
          x: 0,
          x2: 1,
          y: 0,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: '#0076e0'
            },
            {
              offset: 0.5,
              color: '#0076e0'
            },
            {
              offset: 0.5,
              color: '#00a5eb'
            },
            {
              offset: 1,
              color: '#00a5eb'
            }
          ]
        }
      ]

      let barWidth = 35

      let option = {
        tooltip: {
          show: false,
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color: '#fab72e',
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
        series: [
          {
            z: 1,
            name: '高一',
            type: 'bar',
            barWidth: barWidth,
            data: this.dataList,
            itemStyle: {
              normal: {
                color: colors[0]
              }
            }
          },
          {
            z: 2,
            name: '左底部',
            type: 'pictorialBar',
            data: this.dataList,
            symbol: 'diamond',
            symbolOffset: ['0', '50%'],
            symbolSize: [barWidth, 10],
            itemStyle: {
              normal: {
                color: colors[1]
              }
            }
          },
          {
            z: 3,
            name: '左上部1',
            type: 'pictorialBar',
            symbolPosition: 'end',
            data: this.dataList,
            symbol: 'diamond',
            symbolOffset: ['0', '-50%'],
            symbolSize: [barWidth - 4, (10 * (barWidth - 4)) / barWidth],
            itemStyle: {
              normal: {
                borderColor: '#218bd1',
                borderWidth: 2,
                color: colors[2]
              }
            }
          }
        ]
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

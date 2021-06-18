<template>
  <div :id="container" :style="{ height: height }"></div>
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
      default: 'bargraphChart'
    },
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    height: {
      type: String,
      default: '230px'
    }
  },
  data() {
    //这里存放数据
    return {
      myChart: null
    }
  },
  watch: {
    options: {
      handler: function () {
        this.initChart()
      },
      deep: true
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.initChart()
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose()
    }
  },
  //方法集合
  methods: {
    initChart() {
      let lineData = [
        280,
        240,
        328,
        360,
        447,
        504,
        560,
        595,
        180,
        240,
        328,
        360,
        447,
        504,
        398,
        447,
        484,
        504,
        500,
        326,
        495,
        328
      ]
      let barData = [
        146,
        155,
        175,
        185,
        125,
        215,
        232,
        252,
        46,
        55,
        65,
        85,
        225,
        215,
        99,
        125,
        140,
        215,
        232,
        244,
        252,
        75
      ]
      let barData1 = [
        115,
        232,
        252,
        146,
        155,
        165,
        146,
        155,
        175,
        85,
        125,
        85,
        225,
        115,
        99,
        125,
        140,
        215,
        232,
        244,
        252,
        75
      ]
      let rateData = []
      let circleData = []
      for (let i = 0; i < 33; i++) {
        let rate = (barData[i] / lineData[i]) * 100
        let rate1 = (barData1[i] / lineData[i]) * 89
        rateData[i] = rate.toFixed(2)
        circleData[i] = rate1.toFixed(2)
      }
      let option = {
        title: {
          text: '',
          x: 'center',
          y: 0,
          textStyle: {
            color: '#B4B4B4',
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        // backgroundColor: '#0d235e',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.1)',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              backgroundColor: '#ffb126'
            }
          }
        },
        legend: {
          data: ['用电', '环比', '同比'],
          textStyle: {
            color: '#B4B4B4'
          },
          top: '7%'
        },
        grid: {
          top: '15%',
          x: '12%',
          width: '82%',
          y: '12%'
        },
        xAxis: {
          data: this.options.xAxisData || ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
          axisLine: {
            lineStyle: {
              color: '#B4B4B4'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: [
          {
            name: '单位（kwh）',
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#B4B4B4'
              }
            },

            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#B4B4B4'
              }
            },
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],

        series: [
          {
            name: '同比',
            type: 'line',
            smooth: true,
            // showAllSymbol: true,
            // symbol: 'emptyCircle',
            // symbolSize: 8,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#fc3333'
              }
            },
            data: rateData
          },
          {
            name: '环比',
            type: 'line',
            smooth: true,
            // showAllSymbol: true,
            // symbol: 'emptyCircle',
            // symbolSize: 8,
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#1b826e'
              }
            },
            data: circleData
          },

          {
            name: '用电',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#ffb126' },
                  { offset: 1, color: 'rgba(255,177,38,0.1)' }
                ])
              }
            },
            data: barData
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
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>

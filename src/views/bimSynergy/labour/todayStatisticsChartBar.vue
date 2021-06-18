<template>
  <div id="today-statistics-chart" style="width: 340px; height: 100%"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {}
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        legend: {
          top: '5%',
          right: '5%',
          itemWidth: 20,
          itemHeight: 5,
          icon: 'horizontal',
          textStyle: {
            color: '#ffffff',
            fontSize: 10
          },
          data: ['进场人数', '离场人数']
        },
        grid: {
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.5)'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#b8b8b8',
                fontSize: '14'
              }
            },
            data: [
              '0:00',
              '1:00',
              '2:00',
              '3:00',
              '4:00',
              '5:00',
              '6:00',
              '7:00',
              '8:00',
              '9:00',
              '10:00',
              '11:00',
              '12:00',
              '13:00',
              '14:00',
              '15:00',
              '16:00',
              '17:00',
              '18:00',
              '19:00',
              '20:00',
              '21:00',
              '22:00',
              '23:00'
            ]
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: 'rgba(255,255,255,1)',
              fontSize: 10
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '离场人数',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 10,
            barGap: '10%',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(52,237,209)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(17,45,61)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            data: []
          },
          {
            name: '进场人数',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(49,170,218,.9)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(49,170,218,.4)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                },
                barBorderRadius: 0
              }
            },
            data: []
          }
        ]
      }
    }
  },
  watch: {
    option: {
      handler: function (val) {
        if (this.chart) {
          // this.chart.clear()
          this.chart.setOption(val)
        }
      },
      deep: true
    },
    chartData: {
      handler: function (val) {
        console.log(val)
        this.initData()
      },
      deep: true
    }
  },

  mounted() {
    this.drawChart()
    this.initData()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun)
    this.resizeFun = null
  },
  methods: {
    drawChart() {
      this.chart = echarts.init(document.getElementById('today-statistics-chart'))
      this.chart.setOption(this.option)
      window.addEventListener('resize', this.resizeFun)
      this.resizeFun()
    },
    resizeFun() {
      this.chart.resize()
    },
    initData() {
      const { into, out } = this.chartData
      this.option.series[0].data = out
      this.option.series[1].data = into
      this.drawChart()
    }
  }
}
</script>

<style lang="less" scoped></style>

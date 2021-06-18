<template>
  <div :id="id" style="width: 100%; height: 100%"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {},
    id: {
      default: 'zhu-chart'
    }
  },
  data() {
    return {
      chart: null,
      option: {
        xAxis: {
          data: [],
          axisLabel: {
            color: '#b6aeae',
            fontSize: 14
          }
        },
        yAxis: {
          max: 100,
          axisLabel: {
            color: '#b6aeae',
            fontSize: 16
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#2d3d53'
            }
          },
          axisLine: {
            show: false
          }
        },
        grid: {
          top: 40,
          right: 20,
          left: 50,
          bottom: 30
        },
        series: [
          {
            type: 'bar',
            barWidth: 20,
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(86,86,90,0.1)'
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: '#2BB8FC'
                    },
                    {
                      offset: 1,
                      color: '#0F70DD'
                    }
                  ],
                  false
                )
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
          this.chart.setOption(val)
        }
      },
      deep: true
    },
    chartData: {
      handler: function () {
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
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.option)
      window.addEventListener('resize', this.resizeFun)
      this.resizeFun()
    },
    resizeFun() {
      this.chart.resize()
    },
    initData() {
      const { xData, data } = this.chartData
      this.option.xAxis.data = xData
      this.option.series[0].data = data
      this.drawChart()
    }
  }
}
</script>

<style lang="less" scoped></style>

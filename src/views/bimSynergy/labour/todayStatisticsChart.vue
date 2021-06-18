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
          trigger: 'axis'
        },
        legend: {
          icon: 'roundRect',
          textStyle: {
            color: '#b8b8b8'
          },
          formatter: function (name) {
            return name
          },
          data: ['进场', '退场']
        },
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(225,195,45, 1)'
            },
            {
              offset: 1,
              color: 'rgba(225,195,45, 0.2)'
            }
          ]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(21,254,244, 1)'
            },
            {
              offset: 1,
              color: 'rgba(21,254,244, 0.2)'
            }
          ])
        ],
        grid: {
          left: '4%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#495153'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          //轴线上的字
          axisLabel: {
            show: true,
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
        },
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,
            axisTick: {
              show: false
            },
            //轴线上的字
            axisLabel: {
              textStyle: {
                fontSize: '12',
                color: '#cecece'
              }
            },
            axisLine: {
              show: false
            },
            //网格线
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#495153'
              }
            }
          }
        ],
        series: [
          {
            name: '进场',
            type: 'line',
            smooth: false, //是否平滑曲线显示
            showSymbol: false,
            lineStyle: {
              color: '#ffc32d'
            },
            areaStyle: {},
            data: []
          },
          {
            name: '退场',
            type: 'line',
            smooth: false, //是否平滑曲线显示
            showSymbol: false,
            lineStyle: {
              color: '#15fff4'
            },
            areaStyle: {},
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
      this.option.series[0].data = into
      this.option.series[1].data = out
      this.drawChart()
    }
    //获取公共数据,勿删
    // initData() {
    //   const { into, out } = this.chartData
    //   let outMin = 0
    //   let outMax = out.length
    //   let inMin = 0
    //   let inMax = into.length
    //   _.forEach(out, function (v, i) {
    //     if (v !== 0) {
    //       outMin = i
    //       return false
    //     }
    //   })
    //   _.forEachRight(out, function (v, i) {
    //     if (v !== 0) {
    //       outMax = i
    //       return false
    //     }
    //   })
    //   _.forEach(into, function (v, i) {
    //     if (v !== 0) {
    //       inMin = i
    //       return false
    //     }
    //   })
    //   _.forEachRight(into, function (v, i) {
    //     if (v !== 0) {
    //       inMax = i
    //       return false
    //     }
    //   })
    //   let dateAry = []
    //   let minNum = inMin <= outMin ? inMin : outMin
    //   let maxNum = outMax <= inMax ? inMax : outMax
    //   let initInAry = into.slice(minNum, maxNum + 1)
    //   let initOutAry = out.slice(minNum, maxNum + 1)
    //   for (let i = minNum; i <= maxNum; i++) {
    //     dateAry.push(`${i}:00`)
    //   }
    // }
  }
}
</script>

<style lang="less" scoped></style>

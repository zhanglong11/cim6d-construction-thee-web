<template>
  <div id="water-elevator" style="width: 100%; height: 100%"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    isWater: {
      type: Boolean,
      default: false
    },
    type: {},
    chartData: {}
  },
  data() {
    return {
      chart: null,
      option: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLabel: {
            fontSize: 10,
            color: '#EAF2FA'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 10,
            color: '#EAF2FA'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            showSymbol: false,
            lineStyle: {
              normal: {
                color: this.isWater ? '#00e4ff' : '#FFD357'
              }
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: this.isWater ? 'rgba(0, 228, 255,0.1)' : 'rgba(255,211,87,0.1)'
                },
                {
                  offset: 1,
                  color: this.isWater ? 'rgba(0, 228, 255,0.9)' : 'rgba(255,211,87,0.9)'
                }
              ])
            },
            smooth: true
          }
        ]
      },
      xDayData: [
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
      ],
      xMonthData: [],
      xYearData: []
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
      this.chart = echarts.init(document.getElementById('water-elevator'))
      this.chart.setOption(this.option)
      window.addEventListener('resize', this.resizeFun)
      this.resizeFun()
    },
    resizeFun() {
      this.chart.resize()
    },
    initData() {
      const { time, data } = this.chartData
      this.option.xAxis.data = time
      this.option.series[0].data = data
      this.drawChart()
    }
  }
}
</script>

<style lang="less" scoped></style>

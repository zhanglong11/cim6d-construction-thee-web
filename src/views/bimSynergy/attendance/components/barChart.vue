<template>
  <div :id="id" style="width: 100%; height: 100%"></div>
</template>

<script>
import echarts from 'echarts'
const color = ['#DF8769', '#EAA01E', '#EACC1C', '#A9FC85', '#00FFD4', '#03E2FF']
export default {
  props: {
    chartData: {},
    id: {}
  },
  data() {
    return {
      chart: null,
      option: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: 'center',
          right: '4%',
          itemWidth: 10,
          itemHeight: 5,
          itemGap: 20,
          icon: 'horizontal',
          data: [],
          formatter: name => {
            let data = this.option.series[0].data || []
            let value, index
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                value = data[i].value
                index = i
              }
            }
            return `{title|${name}}{value${index}|${value}}`
          },
          textStyle: {
            rich: {
              title: {
                color: '#fff'
              },
              value0: {
                padding: [0, 4, 0, 30],
                color: '#DF8769'
              },
              value1: {
                padding: [0, 4, 0, 30],
                color: '#EAA01E'
              },
              value2: {
                padding: [0, 4, 0, 30],
                color: '#EACC1C'
              },
              value3: {
                padding: [0, 4, 0, 30],
                color: '#A9FC85'
              },
              value4: {
                padding: [0, 4, 0, 30],
                color: '#00FFD4'
              },
              value5: {
                padding: [0, 4, 0, 30],
                color: '#03E2FF'
              }
            }
          }
        },
        series: [
          {
            type: 'pie',
            radius: ['48%', '60%'],
            center: ['30%', '50%'],
            color,
            itemStyle: {
              normal: {
                borderWidth: 4,
                borderColor: '#031845'
              }
            },
            label: {
              show: false
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
      this.option.legend.data = xData || []
      this.option.series[0].data = data || []
      this.drawChart()
    }
  }
}
</script>

<style lang="less" scoped></style>

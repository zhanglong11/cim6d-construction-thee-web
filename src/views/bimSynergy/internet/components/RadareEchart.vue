<template>
  <div :id="container" style="width: 100%; height: 100%"></div>
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
      default: 'radar'
    },
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: String,
      default: '50'
    },
    dataList: {
      type: Object,
      default: () => {
        return {}
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
    options: {
      handler: function () {
        this.initChart()
      },
      deep: true
    },
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
      let data = [
        this.dataList.fineCts,
        this.dataList.graveCts,
        this.dataList.mediumCts,
        this.dataList.goodCts,
        this.dataList.mildCts,
        this.dataList.seriousCts
      ]
      // let data = [582, 421.2, 622.1, 625.3, 265, 224]
      console.log(1111, data)
      let maxNumber = _.max(data) * 1.2
      let indicator = [
        {
          name: `优秀`,
          value: this.dataList.fineCts,
          max: maxNumber
        },
        {
          name: '严重',
          value: this.dataList.graveCts,
          max: maxNumber
        },
        {
          name: '中度',
          value: this.dataList.mediumCts,
          max: maxNumber
        },
        {
          name: '良好',
          value: this.dataList.goodCts,
          max: maxNumber
        },
        {
          name: '轻度',
          value: this.dataList.mildCts,
          max: maxNumber
        },
        {
          name: '重度',
          value: this.dataList.seriousCts,
          max: maxNumber
        }
      ]
      let mainColor = '#81dcf3'
      let mainBorderColor = '#229be1'
      let option = {
        radar: {
          center: ['50%', '50%'],
          radius: '75%',
          name: {
            formatter: function (name, indicator, index, e) {
              let value = indicator.value || 0
              let arr
              arr = [`{a| ${name} }\n{b| ${value}}`]

              return arr.join('\n')
            },
            textStyle: {
              rich: {
                //根据文字的组设置格式
                a: {
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 300,
                  fontFamily: 'Source Han Sans CN',
                  align: 'center'
                },
                //根据文字的组设置格式
                b: {
                  color: mainColor,
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: 'Source Han Sans CN',
                  align: 'center',
                  lineHeight: 15
                }
              }
            }
          },
          radius: 120,
          startAngle: 90,
          splitNumber: 4,
          indicator: indicator,
          splitArea: {
            areaStyle: {
              color: [
                'rgba(34, 155, 225,0.8)',
                'rgba(34, 155, 225,0.5)',
                'rgba(34, 155, 225,0.3)',
                'rgba(34, 155, 225,0.12)'
              ],
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 10
            }
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(34, 155, 225, 0.1)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(34, 155, 225, 0.1)'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        series: [
          {
            type: 'radar',
            data: [data],
            symbol: 'rect',
            symbolSize: 4,
            label: {
              show: false,
              formatter: function (params) {
                return params.value
              },
              color: mainColor,
              // position: [20, 20, -20, -50],
              align: 'center',
              distance: 0,
              textStyle: {
                fontWeight: 'bold'
              }
            },
            // symbolSize: [4, 4],
            lineStyle: {
              //边缘颜色
              width: 1,
              type: 'dashed',
              opacity: 0.4
            },
            itemStyle: {
              borderWidth: 1,
              color: mainColor,
              borderColor: mainBorderColor
            },
            areaStyle: {
              color: mainBorderColor,
              opacity: 0.6
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
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>

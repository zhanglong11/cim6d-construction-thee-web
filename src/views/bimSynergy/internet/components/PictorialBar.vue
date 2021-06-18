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
      default: 'pictorialBar'
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
      // 计划产值
      let zzx1 = [45, 50, 41, 21, 27, 45, 50, 41, 21, 27]
      let zx = zzx1.map(item => {
        return 100 - item
      })
      // 实际产值
      let wgx1 = [37, 40, 63, 61, 64, 37, 40, 63, 61, 64]
      let wg = wgx1.map(item => {
        return 100 - item
      })

      let barWidth = 20
      let mainColor = '#fab72e'
      let subColor = '#37aff4'
      let option = {
        // backgroundColor: '#010243',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (e) {
            // console.log(1111, e)
            var str =
              e[4].axisValue +
              '<br>' +
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" +
              e[4].color.colorStops[0].color +
              ";'></span>" +
              '' +
              e[4].seriesName +
              ' : ' +
              e[4].value +
              '%<br>' +
              "<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:" +
              e[5].color.colorStops[0].color +
              ";'></span>" +
              '' +
              e[5].seriesName +
              ' : ' +
              e[5].value +
              '%'
            return str
          }
        },
        grid: {
          left: '2%',
          right: '4%',
          bottom: '4%',
          top: '8%',
          containLabel: true
        },
        legend: {
          data: ['计划产值', '实际产值'],
          top: 10,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          itemWidth: 12,
          itemHeight: 10,
          itemGap: 35,
          color: '#242424',
          selectedMode: false
        },
        xAxis: {
          type: 'category',
          data: ['02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
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
            // interval: 0,
            // rotate: 40,
            textStyle: {
              fontFamily: 'Microsoft YaHei',
              color: '#fff', // x轴颜色
              fontWeight: 'normal',
              fontSize: '14',
              lineHeight: 22
            },
            interval: 0, //标签设置为全部显示
            margin: 15,
            lineHeight: 15
            // fontSize: 11,
            // formatter: function (params) {
            //   var a = params.substring(0, params.length - 5)
            //   //   console.log(params.substring(0, params.length - 3));
            //   var newParamsName = a + '\n质量合格率'
            //
            //   //将最终的字符串返回
            //   return newParamsName
            // }
          }
        },
        yAxis: {
          min: 0,
          max: 100,
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
            formatter: '{value}%',
            textStyle: {
              color: '#c9c9c9',
              fontSize: 14
            }
          }
        },
        series: [
          // 计划产值中间正方形
          {
            type: 'pictorialBar',
            symbol: 'diamond',

            symbolSize: [barWidth, 8],
            symbolOffset: [-13, -4],
            symbolPosition: 'end',
            z: 12,
            color: mainColor,
            data: zzx1
          },
          // 实际产值中间正方形
          {
            type: 'pictorialBar',
            symbol: 'diamond',
            symbolSize: [barWidth, 8],
            symbolOffset: [13, -4],
            symbolPosition: 'end',
            z: 12,
            color: subColor,
            data: wgx1
          },
          //  计划产值底部正方形
          {
            type: 'pictorialBar',
            symbol: 'diamond',
            symbolSize: [barWidth, 8],
            symbolOffset: [-13, 4],
            z: 12,
            color: 'rgba(250,183,46,0.2)',
            data: zzx1
          },
          // 实际产值底部正方形
          {
            name: '',
            type: 'pictorialBar',
            symbol: 'diamond',
            symbolSize: [barWidth, 8],
            symbolOffset: [13, 4],
            color: 'rgba(41,119,161,0.24)',
            z: 12,
            data: wgx1
          },
          // 计划产值进度柱子
          {
            name: '计划产值',
            type: 'bar',
            barWidth: barWidth,
            // zlevel: 2,
            stack: '1',
            itemStyle: {
              normal: {
                opacity: 0.7,
                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: mainColor
                  },
                  {
                    offset: 1,
                    color: 'rgba(250,183,46,0.1)'
                  }
                ]),
                barBorderRadius: 0
              }
            },
            label: {
              show: true,
              position: ['0', '-18'],
              color: mainColor,
              fontSize: 12
            },
            data: zzx1
          },
          // 实际产值进度柱子
          {
            name: '实际产值',
            type: 'bar',
            stack: '2',
            barWidth: barWidth,
            itemStyle: {
              normal: {
                opacity: 0.7,
                color: new Echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: subColor
                  },
                  {
                    offset: 1,
                    color: 'rgba(41,119,161,0.1)'
                  }
                ]),
                barBorderRadius: 0
              }
            },
            label: {
              show: true,
              position: ['5', '-18'],
              color: subColor,
              fontSize: 12
            },
            data: wgx1
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

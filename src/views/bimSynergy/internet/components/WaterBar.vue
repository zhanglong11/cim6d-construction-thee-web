<template>
  <div :id="container" style="height: calc(60vh); width: 400px"></div>
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
      default: 'waterBar'
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
      let option = {
        // backgroundColor: '#1c1c1d',
        // tooltip: {
        //   trigger: 'item',
        //   backgroundColor: 'rgba(0,0,0,0.5)',
        //   borderColor: 'rgba(89,211,255,1)',
        //   borderWidth: 2,
        //   padding: 5,
        //   textStyle: {
        //     color: 'rgba(89,211,255,1)',
        //     fontSize: 18,
        //     width: 300,
        //     height: 40
        //   },
        //   formatter: '{c}' + '%',
        //   extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
        //
        //   // 自定义的 CSS 样式
        // },
        grid: {
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          data: this.options.name.split(',') || ['智能水表1'],
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            },
            margin: 30 //刻度标签与轴线之间的距离。
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        series: [
          // 头
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [300, 55],
            symbolOffset: [0, -25],
            z: 12,
            itemStyle: {
              normal: {
                color: new Echarts.graphic.LinearGradient(
                  1,
                  0,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: '#f0b54e'
                    },
                    {
                      offset: 0,
                      color: '#1b1a1b'
                    },
                    {
                      offset: 1,
                      color: '#e3ab4b'
                    }
                  ],
                  false
                )
              }
            },
            data: [
              {
                name: '1栋一单元1楼管道井',
                value: '100',
                symbolPosition: 'end'
              }
            ]
          },
          //底部立体柱
          {
            name: 'vvvv',
            stack: '1',
            type: 'bar',
            silent: true,
            barWidth: 300,
            barGap: '-100%', // Make series be overlap
            data: [
              {
                value: this.options.parent
              }
            ],
            itemStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  type: 'linear',
                  global: false,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#f0b54e'
                    },
                    {
                      offset: 0,
                      color: '#1b1a1b'
                    },
                    {
                      offset: 1,
                      color: '#e3ab4b'
                    }
                  ]
                }
              }
            }
          },
          //三个最低下的圆片
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [300, 40],
            symbolOffset: [0, 19],
            z: 12,
            itemStyle: {
              normal: {
                color: new Echarts.graphic.LinearGradient(1, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#f0b54e'
                  },
                  {
                    offset: 0,
                    color: '#1b1a1b'
                  },
                  {
                    offset: 1,
                    color: '#e3ab4b'
                  }
                ])
              }
            },
            data: [
              {
                name: '',
                value: '100'
              }
            ]
          },
          // 中间圆片
          {
            name: '',
            type: 'pictorialBar',
            symbolSize: [300, 52],
            symbolOffset: [0, -25],
            // label: {
            //   show: true,
            //   position: ['45%', '45%'],
            //   // position: 'top', //top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
            //   distance: 20,
            //   color: '#fff',
            //   fontSize: 30,
            //   formatter: function (item) {
            //     console.log(this)
            //     return '吨'
            //   }
            // },
            itemStyle: {
              normal: {
                color: new Echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(240,181,78,0.68)'
                    },
                    {
                      offset: 1,
                      color: '#e9b04c'
                    }
                  ],
                  false
                )
              }
            },
            z: 12,
            data: [
              {
                name: '',
                value: this.options.parent,
                symbolPosition: 'end'
              }
            ]
          },
          //上部立体柱
          {
            //上部立体柱
            stack: '1',
            type: 'bar',
            itemStyle: {
              // normal: {
              //   color: '#1b1a1b',
              //   opacity: 0.7
              // }
              normal: {
                color: new Echarts.graphic.LinearGradient(
                  1,
                  0,
                  0,
                  0,
                  [
                    {
                      offset: 0,
                      color: 'rgba(240,181,78,0.68)'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(27,26,27,0.56)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(233,176,76,0.34)'
                    }
                  ],
                  false
                )
              }
            },
            label: {
              show: true,
              position: ['40%', '40%'],
              // position: 'top', //top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
              distance: 20,
              color: '#fff',
              fontSize: 30,
              formatter: function (item) {
                var a = 100
                return a - item.value + '%'
              }
            },
            silent: true,
            barWidth: 300,
            barGap: '-100%', // Make series be overlap
            data: [
              {
                name: 'a',
                value: 100 - this.options.parent
              }
            ]
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

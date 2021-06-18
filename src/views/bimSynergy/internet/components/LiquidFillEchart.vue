<template>
  <div :id="container" style="height: 100%; width: 100%"></div>
</template>

<script>
import Echarts from 'echarts'
import 'echarts-liquidfill'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 图表容器
    container: {
      type: String,
      default: 'liquidFillEchart'
    },
    // 配置
    options: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: [String, Number],
      default: 0
    },
    status: {
      type: String,
      default: '良好'
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
    value(val) {
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
      this.myChart && this.myChart.dispose()
      let status = this.status
      let option = {
        // backgroundColor: '#050038',
        title: {
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 14,
            color: '#00a9bb'
          }
        },
        series: [
          {
            type: 'liquidFill',
            radius: '60%',
            center: ['50%', '50%'],
            color: ['#267cb3'],
            data: [
              {
                value: this.value / 500,
                direction: 'left', //水波移动的方向，默认right,top 和bottom时，单条水波静止
                itemStyle: {
                  normal: {
                    //正常样式
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#00a5ba' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#fff' // 100% 处的颜色
                        }
                      ]
                    },
                    // new Echarts.graphic.LinearGradient(
                    //           1,
                    //           0,
                    //           0,
                    //           1,
                    //           [
                    //             {
                    //               offset: 0,
                    //               color: '#00a5ba'
                    //             },
                    //             {
                    //               offset: 1,
                    //               color: '#fff'
                    //             },
                    //             {
                    //               offset: 1,
                    //               color: '#fff'
                    //             }
                    //           ],
                    //           false
                    //         )
                    opacity: 0.2
                  }
                }
              },
              {
                value: this.value / 500,
                direction: 'left', //水波移动的方向，默认right,top 和bottom时，单条水波静止
                itemStyle: {
                  normal: {
                    //正常样式
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [
                        {
                          offset: 0,
                          color: '#00a5ba' // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: '#fff' // 100% 处的颜色
                        }
                      ]
                    },
                    opacity: 0.2
                  }
                }
              }
            ],
            backgroundStyle: {
              borderWidth: 1,
              color: new Echarts.graphic.LinearGradient(
                1,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: '#00566d'
                  },
                  {
                    offset: 1,
                    color: '#0d1e29'
                  },
                  {
                    offset: 1,
                    color: '#fff'
                  }
                ],
                false
              )
            },
            label: {
              normal: {
                rich: {
                  a: {
                    color: '#fff',
                    align: 'center',
                    fontSize: 60,
                    padding: [0, 0, 0, 0],
                    fontWeight: 'bold'
                  },
                  b: {
                    color: '#fff',
                    align: 'center',
                    fontSize: 14,
                    fontWeight: '400'
                  },
                  c: {
                    color: '#79CEFF',
                    align: 'center',
                    fontSize: 18,
                    padding: [0, 0, 0, 0],
                    fontWeight: '400'
                  }
                },
                formatter: function (params) {
                  return '{c|' + 'AQI' + '}\n\n' + '{a|' + params.value * 500 + '}\n\n' + '{b|' + status + '}'
                },
                textStyle: {
                  fontSize: 18,
                  color: '#b7e5ff'
                }
              }
            },
            outline: {
              show: false
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

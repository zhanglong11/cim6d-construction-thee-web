<template>
  <div :id="container" style="height: calc(70vh)"></div>
</template>

<script>
import Echarts from 'echarts'
var cost = [0.6, 0.3, 0.2] //电表的百分率
var totalCost = [1, 1, 1] //比例综合
// var img =
//   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABPcAAACCCAYAAAAqui2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjMxODJDQjQ2NjZCQjExRUI5REQwRUEzNjgyNkI4MzI1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjMxODJDQjQ3NjZCQjExRUI5REQwRUEzNjgyNkI4MzI1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzE4MkNCNDQ2NkJCMTFFQjlERDBFQTM2ODI2QjgzMjUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzE4MkNCNDU2NkJCMTFFQjlERDBFQTM2ODI2QjgzMjUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5KqPQuAAApo0lEQVR42uzd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'
var img = '../../images/internet/bar.png'
var grade = ['智能电表3', '智能电表2', '智能电表1']
var data = {
  grade: grade,
  cost: cost,
  totalCost: totalCost
}
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 图表容器
    container: {
      type: String,
      default: 'categoryBar'
    },
    // 配置
    options: {
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
        // backgroundColor: '#05274C',
        title: {
          top: '5%',
          left: 'center',
          text: '',
          textStyle: {
            align: 'center',
            color: '#4DCEF8',
            fontSize: 18
          }
        },
        grid: {
          left: '240',
          right: '100'
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            margin: 100,
            show: true,
            color: '#4DCEF8',
            fontSize: 14
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          data: data.grade
        },
        series: [
          //内层背景
          {
            type: 'bar',
            barGap: '-100%',
            label: {
              normal: {
                show: true,
                position: 'right',
                color: '#fff',
                fontSize: 14,
                formatter: function (param) {
                  return data.cost[param.dataIndex] * 100 + '%'
                }
              }
            },
            barWidth: '43%',
            itemStyle: {
              normal: {
                // borderColor: '#cb8f3a',
                borderWidth: 2,
                barBorderRadius: 15,

                color: {
                  type: 'linear',
                  x: 0,
                  x1: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#504638'
                    },
                    {
                      offset: 0.5,
                      color: '#1d1c1d'
                    },
                    {
                      offset: 1,
                      color: '#514637'
                    }
                  ]
                }
              }
            },
            z: 1,
            data: data.totalCost
          },
          //所占比例
          {
            type: 'bar',
            barGap: '-98%',
            barWidth: '43%',
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: {
                  type: 'linear',
                  x: 0,
                  x1: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#cb8f3a'
                    },
                    {
                      offset: 0.5,
                      color: '#4d3d27'
                    },
                    {
                      offset: 1,
                      color: '#cb8f3a'
                    }
                  ]
                }
              }
            },
            max: 1,
            label: {
              normal: {
                show: true,
                position: 'left',
                color: '#fff',
                fontSize: 14
              }
            },
            labelLine: {
              show: true
            },
            z: 2,
            data: data.cost
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

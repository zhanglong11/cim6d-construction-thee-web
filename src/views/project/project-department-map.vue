<template>
  <div style="position: relative">
    <el-button class="export-button el-icon-download" @click="exportImage">项目机构图下载</el-button>
    <div id="org-chart"></div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import treeForEach from '@/utils/treeForEach'
import { projectApi } from './api/project'
import stringWidth from 'string-width'
export default {
  name: 'OrgChart',
  data() {
    return {
      graph: null,
      project: {}
    }
  },
  computed: {
    projectType() {
      return this.$store.state.project.projectType
    }
  },
  watch: {
    data(val) {
      if (val) this.refresh()
    }
  },
  created() {},
  mounted() {
    G6.registerEdge('flow-line', {
      draw(cfg, group) {
        const startPoint = cfg.startPoint
        const endPoint = cfg.endPoint
        const { style } = cfg
        const typeDifference = cfg.targetNode._cfg.model.dataType < 2 ? 23 : 0
        const middleX = (cfg.targetNode._cfg.bboxCache.minX - typeDifference + cfg.sourceNode._cfg.bboxCache.maxX) / 2
        const shape = group.addShape('path', {
          attrs: {
            stroke: cfg.sourceNode._cfg.model.opt.color,
            lineWidth: style.lineWidth,
            endArrow: style.endArrow,
            path: [
              ['M', startPoint.x, startPoint.y],
              ['L', middleX, startPoint.y],
              ['L', middleX, endPoint.y],
              ['L', endPoint.x, endPoint.y]
            ]
          }
        })
        return shape
      }
    })
    G6.registerNode(
      'custom-node',
      {
        draw(cfg, group) {
          if (cfg.organType < 5) {
            // 左侧图标
            group.addShape('image', {
              attrs: {
                x: 8,
                y: 0,
                radius: 5,
                width: 24,
                height: 24,
                img: cfg.opt.icon
              },
              name: 'image-shape'
            })
            // 图标border
            group.addShape('rect', {
              attrs: {
                x: 8,
                stroke: cfg.opt.color,
                lineWidth: 3,
                radius: 5,
                width: 24,
                height: 24
              }
            })
            // 长方形条，文字的背景

            const text = group.addShape('text', {
              attrs: {
                fill: '#fff',
                fontSize: 12,
                text: cfg.label,
                x: 40,
                y: 19
              },
              zIndex: 2
            })

            const textBbox = G6.Util.calculationItemsBBox([text])
            const keyShape = group.addShape('rect', {
              attrs: {
                x: 31,
                y: 2,
                fill: cfg.opt.color,
                radius: 3,
                width: textBbox.width + 20,
                height: 20
              },
              zIndex: 1
            })
            group.sort()
            return keyShape
          } else {
            const text = group.addShape('text', {
              attrs: {
                fill: '#000',
                fontWeight: 'bold',
                fontSize: 12,
                text: cfg.label,
                x: 40,
                y: 8
              }
            })
            const textBbox = G6.Util.calculationItemsBBox([text])
            // 用于触发点击事件展开子级
            group.addShape('rect', {
              attrs: {
                x: 5,
                y: -12,
                radius: 3,
                width: textBbox.width + 40,
                fill: '#0000',
                height: 24
              }
            })

            //仅用于定位
            const keyShape = group.addShape('rect', {
              attrs: {
                x: 31,
                y: 2,
                radius: 3,
                width: textBbox.width + 50,
                height: 20
              }
            })
            group.addShape('image', {
              attrs: {
                x: 8,
                y: -12,
                radius: 5,
                width: 24,
                height: 24,
                img: cfg.opt.icon
              },
              name: 'image-shape'
            })

            group.addShape('rect', {
              attrs: {
                x: 8,
                y: -12,
                stroke: cfg.opt.color,
                lineWidth: 3,
                radius: [3, 3, 0, 3],
                width: 24,
                height: 24
              }
            })
            group.addShape('path', {
              attrs: {
                path: [
                  ['M', 10, 12], // 上部顶点
                  ['L', textBbox.width + 50, 12], // 右侧顶点
                  ['Z'] // 封闭
                ],
                stroke: cfg.opt.color,
                lineWidth: 3
              }
            })
            return keyShape
          }
        }
      },
      'single-node'
    )
    const width = document.getElementById('org-chart').scrollWidth || 800
    const height = document.getElementById('org-chart').scrollHeight || 1000
    const graph = new G6.TreeGraph({
      container: 'org-chart',
      width,
      height,
      maxZoom: 2,
      linkCenter: true,
      modes: {
        default: ['collapse-expand', 'drag-canvas', 'zoom-canvas']
      },
      defaultNode: {
        type: 'custom-node',
        size: [200, 30],
        style: {
          fill: '#91d5ff',
          stroke: '#40a9ff',
          radius: 5
        },
        labelCfg: {
          style: {
            fill: '#000',
            fontSize: 12
          }
        }
      },
      defaultEdge: {
        type: 'flow-line',
        style: {
          stroke: 'l(0) 0:#672EBC 0.62:#672EBC 0.62:#00B492 1:#00B492',
          lineWidth: 3
        }
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d) {
          return d.id
        },
        getHeight: function getHeight() {
          return 24
        },
        getWidth: function getWidth(ff) {
          return 16
        },
        getVGap: function getVGap(ff) {
          return 30
        },
        getHGap: function getHGap(ff) {
          const childrenMaxLabelLength = _.max(_.map(ff.children, e => stringWidth(e.label))) || 0
          return ((stringWidth(ff.label) + childrenMaxLabelLength) / 4) * 12
        }
      },
      animateCfg: {
        duration: 300
      }
    })
    this.graph = graph
    this.refresh()
  },
  methods: {
    async refresh() {
      // let data = _.cloneDeep(this.data)
      let departmentList = await projectApi.getProjectOrganView({}).then(res => res.data)
      let treeData = departmentList[0]
      this.project = treeData
      treeForEach(
        [treeData],
        e => {
          e.children = e.child
          const config = {
            0: {
              color: '#00B492',
              icon: '/img/org/organ-project.png'
            },
            1: {
              color: '#6EA72C',
              icon: '/img/org/organ-join.png'
            },
            2: {
              color: '#0095C9',
              icon: '/img/org/organ-company.png'
            },
            3: {
              color: '#672EBC',
              icon: '/img/org/organ-company.png'
            },
            4: {
              color: '#0095C9',
              icon: '/img/org/organ-struct.png'
            },
            5: {
              color: '#5F5DD1',
              icon: '/img/org/organ-department.png'
            },
            6: {
              color: '#C2402E',
              icon: '/img/org/organ-people-red.png'
            }
          }
          e.opt = config[e.organType] || {
            color: '#00B492',
            icon: '/img/org/organ-project.png'
          }
          if (e.organType === 1 && e.participantType === 1) {
            e.opt = {
              color: '#6EA72C',
              icon: '/img/org/organ-host.png'
            }
          }
          if (e.organType === 5) {
            e.collapsed = true
          }
          if (_.size(e.children) >= 10) {
            e.collapsed = true
          }
          e.label = e.dataName || e.label || this.$getLabelFromArg(`${this.projectType}_participantType`, e.dataUnicode)
          if ([1, 2, 3, 4, 5].includes(e.organType)) {
            e.label += ` (${e.userNumber})`
          } else if (e.organType === 6) {
            e.label += ` (${e.mobile})`
          }
          delete e.type
        },
        'child'
      )
      this.graph.data(treeData)
      this.graph.render()
      this.graph.fitView()
    },
    exportImage() {
      this.graph.downloadFullImage(this.project.dataName + '-机构图', 'image/jpeg', {
        backgroundColor: '#fff',
        padding: [30, 15, 15, 15]
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.export-button {
  position: absolute;
  top: 10px;
  left: 10px;
  &:before {
    color: @primary-color;
    margin-right: 5px;
    font-size: 14px;
    font-weight: bold;
  }
}
</style>

<style lang="less">
#org-chart {
  width: 100%;
  height: calc(100vh - 140px);
}
.icon-rect {
  display: flex;
  align-items: center;
  color: #fff;
  width: 100%;
  img {
    width: 30px;
    height: 30px;
    border-radius: 5px;
  }
  span {
    padding: 3px 5px;
    font-size: 12px;
    flex: 1;
    border-radius: 0 5px 5px 0;
  }
}
.icon-line-user {
  display: flex;
  align-items: center;
  position: relative;
  top: -17px;
  img {
    width: 30px;
    height: 30px;
    border-radius: 5px 5px 0 0;
    border-bottom: 0 !important;
  }
  span {
    padding: 3px 5px;
    color: #333;
    font-weight: bold;
  }
}
foreignObject {
  overflow: visible;
}
#org-chart {
  background-color: #fff;
}
</style>

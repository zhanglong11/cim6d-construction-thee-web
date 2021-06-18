<template>
  <div class="wrap">
    <template v-if="modelId">
      <div id="model" />
      <div class="screen" title="全屏" @click="fullScreen"><el-icon class="el-icon-full-screen" /></div>
      <div v-show="hasTool" id="bim-tool">
        <!--      <div :class="activeType === 'select' ? 'active' : ''" @click="toolClick('select')">框选</div>-->
        <div :class="['select', activeType === 'select' ? 'active' : '']" @click="toolClick('select')">框选</div>
        <!--      <div :class="activeType === 'rule' ? 'active' : ''" @click="toolClick('rule')">量尺</div>-->
        <!--      <div class="select">框选</div>-->
        <!--      <div class="rule">量尺</div>-->
      </div>
      <!--详情页面-->
      <div :class="showElementDetail ? 'show' : ''" class="detail-pane">
        <div class="closeIcon" @click="hideElementDetail">×</div>
        <h5>属性</h5>
        <div class="content">
          <div v-if="activeElementInfo[0]">
            <h6>标识数据</h6>
            <p v-for="(item, i) in activeElementInfo[0]" :key="i">
              <span class="label">{{ item.name }}</span> <span class="value">{{ item.strValue }}</span>
            </p>
          </div>
          <div v-if="activeElementInfo[3]">
            <h6>构造</h6>
            <p v-for="(item, i) in activeElementInfo[3]" :key="i">
              <span class="label">{{ item.name }}</span> <span class="value">{{ initDetailValue(item) }}</span>
            </p>
          </div>
          <div v-if="activeElementInfo[5]">
            <h6>材质和装饰</h6>
            <p v-for="(item, i) in activeElementInfo[5]" :key="i">
              <span class="label">{{ item.name }}</span> <span class="value">{{ initDetailValue(item) }}</span>
            </p>
          </div>
          <div v-if="activeElementInfo[19]">
            <h6>约束</h6>
            <p v-for="(item, i) in activeElementInfo[19]" :key="i">
              <span class="label">{{ item.name }}</span> <span class="value">{{ initDetailValue(item) }}</span>
            </p>
          </div>
          <div v-if="activeElementInfo[-1]">
            <h6>其他</h6>
            <p v-for="(item, i) in activeElementInfo[-1]" :key="i">
              <span class="label">{{ item.name }}</span> <span class="value">{{ initDetailValue(item) }}</span>
            </p>
          </div>
        </div>
      </div>
      <!--详情页面-->
    </template>
    <template v-else>
      <div class="no-data">当前暂无合并模型</div>
    </template>
  </div>
</template>

<script>
import Event from 'event-emitter'
import store from '@/store'
const event = new Event()
import allOf from 'event-emitter/all-off'
export default {
  name: 'BimView',
  // import引入的组件
  components: {},
  props: {
    hasTool: {
      type: Boolean,
      default: false
    },
    hasShowDetail: {
      type: Boolean,
      default: true
    },
    modelId: {
      type: String,
      default: () => localStorage.getItem('bimModelId')
    }
  },
  data() {
    // 这里存放数据
    return {
      viewer: null,
      selectEleId: [],
      selectEle: [],
      activeType: null,
      elements: [],
      showElementDetail: false,
      activeElementInfo: {}
    }
  },
  computed: {
    appToken() {
      return this.$store.state.bim.appToken
    }
  },

  // 生命周期 - 挂载完成
  mounted() {
    setTimeout(() => {
      this.loadView()
    }, 500)
  },
  beforeDestroy() {
    allOf(event, 'viewerUpdate')
    if (modeloApp) {
      const viewer = modeloApp.getViewer()
      if (viewer) {
        viewer.destroy()
      }
      window.modeloApp = null
      // modeloApp.destroy()
    }
  },
  // 方法集合
  methods: {
    //展示模型
    async loadView() {
      console.log(this.modelId)
      if (!this.modelId) return false
      // 初始化3D模型，多模型就实例化多次
      modeloApp = new Modelo.UI.ModelViewer({
        modelId: this.modelId,
        containerId: 'model',
        locale: 'zh',
        useDefaultFavicon: true,
        onReady: viewer => {
          this.viewer = viewer
          this.initModel()
          //获取bim树
          this.getViewerTree()
        }
      })
    },

    initModel() {
      this.$emit('ready')
      if (this.hasTool) {
        window.addEventListener('click', e => {
          let target = e.target
          if (target.className.includes('select')) {
            return
          }
          this.activeType = null
          modeloApp.tools.selectElements.setRegionSelectEnabled(false)
        })
      }
      //获取bim选中构件
      this.viewer.getEventEmitter().on('onElementSelected', elementNames => {
        console.log(elementNames)
        let elementIds = this.$store.state.bim.bimElementData
        this.selectEleId = elementNames
        this.selectEle = elementIds.filter(e => elementNames.includes(e.id))
      })
      //设置图形背景色
      this.viewer.setBackgroundColor([0.95, 0.95, 0.95])
      // viewer.setBackgroundColor([27 / 255, 28 / 255, 32 / 255, 0.8])
      this.viewer.setUpdateCallback(() => {
        event.emit('viewerUpdate')
      })
    },

    //获取bim树
    getViewerTree() {
      Modelo.BIM.getTreeInfo(this.modelId).then(bimTree => {
        let models = _.values(bimTree.models)
        let levels = _.values(bimTree.levels)
        let categories = _.values(bimTree.categories)
        let families = _.values(bimTree.families)
        let types = _.values(bimTree.types)
        let elements = _.values(bimTree.elements)

        const modelsHash = _.keyBy(models, 'id')
        const levelsHash = _.keyBy(levels, 'id')
        const categoriesHash = _.keyBy(categories, 'id')
        const familiesHash = _.keyBy(families, 'id')
        const typesHash = _.keyBy(types, 'id')

        models.forEach(model => {
          model.name = decodeURI(decodeURIComponent(model.name))
        })
        levels.forEach(level => {
          const targetModel = modelsHash[level.modelId]
          if (!targetModel.children) {
            targetModel.children = []
          }
          targetModel.children.push(level)
        })
        categories.forEach(category => {
          const targetLevel = levelsHash[category.levelId]
          if (!targetLevel.children) {
            targetLevel.children = []
          }
          targetLevel.children.push(category)
        })
        families.forEach(family => {
          const targetCategory = categoriesHash[family.categoryId]
          if (!targetCategory.children) {
            targetCategory.children = []
          }
          targetCategory.children.push(family)
        })
        types.forEach(type => {
          const targetFamily = familiesHash[type.familyId]
          if (!targetFamily.children) {
            targetFamily.children = []
          }
          targetFamily.children.push(type)
        })
        elements.forEach(element => {
          const targetType = typesHash[element.typeId]
          if (!targetType.children) {
            targetType.children = []
          }
          targetType.children.push(element)
        })

        this.elements = elements
        store.dispatch('bim/setBimElement', elements)
        store.dispatch('bim/setBimTree', models)
      })
    },

    getSelectEleId() {
      return {
        selectEleId: this.selectEleId,
        selectEle: this.selectEle
      }
    },

    //隐藏显示
    showModel(show = true) {
      this.viewer.getScene().setModelVisibility(this.modelId, show, show)
    },

    //显示选中构件
    showGuid(guidAry) {
      if (guidAry && guidAry.length) {
        this.showModel(false)
        this.viewer.getScene().setElementsVisibility(guidAry, true)
        return
      }
      this.showModel(false)
    },
    //清除上色
    clearColor() {
      let elementId = this.elements.map(r => r.id)
      this.viewer?.getScene().setElementsColor(elementId, null)
    },

    //构件上色
    setColor(guidAry, color) {
      if (!color) {
        return
      }
      this.viewer.getScene().setElementsColor(guidAry, [color[0] / 255, color[1] / 255, color[2] / 255])
      this.colorAry = guidAry
    },
    //清除标注
    clearMark() {
      let model = document.getElementById('model')
      let imgs = model.getElementsByTagName('img')
      //删除添加标注
      if (imgs && imgs.length) {
        _.forEachRight(imgs, img => {
          if (img.getAttribute('type') === 'icon') {
            img.remove()
          }
        })
      }
    },

    //设置标注
    setMark(eleAry, imgSrc, size = 14) {
      if (!this.viewer) {
        return
      }
      let model = document.getElementById('model')
      //添加标注
      eleAry.forEach(e => {
        let pos3D = this.viewer.getScene().getElementsBBox([typeof e === 'string' ? e : e.id])
        let icon = document.createElement('img')
        icon.setAttribute('src', imgSrc)
        icon.style.width = size + 'px'
        icon.style.height = size + 'px'
        icon.style.cursor = 'pointer'
        icon.setAttribute('type', 'icon')
        icon.style.position = 'absolute'
        icon.addEventListener('click', () => {
          this.$emit('iconClick', e)
        })
        model.appendChild(icon)
        event.on('viewerUpdate', () => {
          let position2D = this.viewer.getCamera().project(pos3D.slice(3, 6))
          icon.style.left = position2D[0] + 'px'
          icon.style.top = position2D[1] + 'px'
        })
      })
    },

    //显示构件详情
    async showDetail(eleId) {
      if (!eleId) {
        return
      }
      this.activeElementInfo = {}
      //获取构件属性
      await Modelo.BIM.getElementProperties(this.modelId, eleId).then(resAry => {
        new Set(resAry.map(a => a.groupKey)).forEach(key => {
          this.activeElementInfo[key] = resAry.filter(a => a.groupKey === key)
        })
      })
      this.activeElementInfo = {
        ...this.activeElementInfo
      }
      this.showElementDetail = true
    },

    //初始化
    initDetailValue(item) {
      if (item.strValue) {
        return item.strValue
      }
      if (!_.isNil(item.numValue)) {
        if (!item.numValue || !item.unit) {
          return item.numValue
        }
        if (item.unit === 'UT_LENGTH_FEET') {
          return `${item.numValue * 12} inches`
        }
        if (item.unit === 'UT_AREA_FEET_2') {
          return `${item.numValue * 114} inches`
        }
        if (item.unit === 'UT_AREA_FEET_3') {
          return `${item.numValue * 1728} inches`
        }
      }
    },

    hideElementDetail() {
      this.showElementDetail = false
    },

    toolClick(type) {
      if (this.activeType === type) {
        this.activeType = null
        modeloApp.tools.selectElements.setRegionSelectEnabled(false)
        return
      }
      console.log(type)
      this.activeType = type
      modeloApp.tools.selectElements.setRegionSelectEnabled(false)
      if (type === 'select') {
        modeloApp.tools.selectElements.setRegionSelectEnabled(true)
      }
    },

    //取消框选
    cancelSelect() {
      window.addEventListener('click', e => {
        let toolView = document.getElementById('bim-tool')
        let target = e.target
        this.removeActive(toolView, target)
        modeloApp.tools.selectElements.setRegionSelectEnabled(false)
      })
    },

    //工具栏
    bimTool() {
      let toolView = document.getElementById('bim-tool')
      window.addEventListener('click', e => {
        console.log(e)
        let target = e.target
        this.removeActive(toolView, target)
        //框选功能
        if (target.className.includes('select')) {
          if (target.className.includes('active')) {
            modeloApp.tools.selectElements.setRegionSelectEnabled(true)
            return
          }
          modeloApp.tools.selectElements.setRegionSelectEnabled(false)
        }
      })
    },
    init() {
      this.pickElement([])
      this.viewer.getCamera().switchToView(6)
    },
    //移除选中状态
    removeActive(parentEle, target) {
      if (target.className.includes('active')) {
        target.classList.remove('active')
        return
      }
      let childNode = parentEle.getElementsByTagName('div')
      childNode.forEach(ele => {
        ele.classList.remove('active')
      })
      target.classList.add('active')
    },
    //全屏
    fullScreen() {
      this.$fullscreen.toggle(this.$el.querySelector('#model'))
    },

    //选中多个构件
    pickElement(eleAry) {
      // if (!eleAry || !eleAry.length) {
      //   return
      // }
      modeloApp.tools.selectElements.pick(eleAry, true)
    },
    //展示
    showDefaultCamera() {
      this.viewer.getCamera().switchToView(6)
    },

    //取消选中
    cancelPick() {
      // modeloApp.tools.selectElements.setCloseUpEnabled()
    }
  }
}
</script>

<style scoped lang="less">
//模型树滚动样式调整
/deep/ .Modelo.ModeloTag.BimTreePanel {
  height: calc(100% - 50px) !important;
  color: #000;
  overflow: hidden;
  .Modelo.ModeloTag.BimTree {
    overflow-y: auto;
  }
}
.wrap {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  #model {
    width: 100%;
    height: 100%;
  }
  #bim-tool {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 20px;
    top: 80px;
    box-shadow: 0 0.5px 2px 0 rgba(0, 0, 0, 0.28);
    cursor: pointer;
    background-color: #fff;
    border-radius: 3px;
    opacity: 0.76;
    z-index: 88;
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 60px;
      &.active {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .detail-pane {
    position: absolute;
    top: 0;
    left: -400px;
    width: 300px;
    height: 100%;
    box-shadow: 0 0.5px 2px 0 rgba(0, 0, 0, 0.28);
    background-color: #fff;
    border-radius: 3px;
    opacity: 0.95;
    z-index: 88;
    transition: all 0.6s ease-in-out;
    &.show {
      left: 0;
    }
    .closeIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        transform: rotate(180deg);
        color: #bbb;
      }
    }
  }
  .detail-pane {
    h5 {
      font-size: 18px;
      font-weight: 400;
      text-align: center;
    }
    .content {
      height: calc(100% - 30px);
      overflow-y: auto;
      > div + div {
        margin-top: 10px;
      }
      padding: 10px;
      h6 {
        font-size: 16px;
        font-weight: normal;
        padding: 4px 0;
        border-bottom: 1px solid #ddd;
      }
      p {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        color: #877f7f;
        font-size: 14px;
        > span {
          display: inline-block;
          overflow: hidden;
          word-break: break-word;
          vertical-align: top;
        }
        .label {
          text-align: left;
        }
        .value {
          width: 140px;
          text-align: right;
          color: #000;
          margin-left: 20px;
        }
      }
    }
  }
  .screen {
    display: flex;
    position: absolute;
    left: 20px;
    top: 20px;
    box-shadow: 0 0.5px 2px 0 rgba(0, 0, 0, 0.28);
    cursor: pointer;
    background-color: #fff;
    border-radius: 3px;
    opacity: 0.76;
    z-index: 88;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
  .no-data {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: #fff;
    padding: 15px;
    color: #ddd;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>

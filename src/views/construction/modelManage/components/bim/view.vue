<template>
  <div class="wrap">
    <div id="model">
      <!--      <div id="1">111</div>-->
      <!--      <div id="2">111</div>-->
      <!--      <div id="3">111</div>-->
      <!--      <div id="4">111</div>-->
    </div>
  </div>
</template>

<script>
import Event from 'event-emitter'
const event = new Event()
export default {
  name: 'BIM',
  // import引入的组件
  components: {},
  props: {
    modelId: {
      type: String,
      default: '6YdVRbrW'
    }
  },
  data() {
    // 这里存放数据
    return {
      viewer: null,
      modeloApp: null
    }
  },
  computed: {
    appToken() {
      return this.$store.state.bim.appToken
    }
  },
  watch: {
    modelId() {
      this.loadView()
    }
  },
  // 生命周期 - 挂载完成
  mounted() {
    this.loadView()
    this.getViewerTree()
  },
  destroyed() {
    this.modeloApp.destroy()
  },

  // 方法集合
  methods: {
    //展示模型
    loadView() {
      if (!this.modelId) return false
      if (this.modeloApp) {
        this.modeloApp.destroy()
      }
      // 初始化3D模型，多模型就实例化多次
      this.modeloApp = new Modelo.UI.ModelViewer({
        modelId: this.modelId,
        containerId: 'model',
        locale: 'zh',
        useDefaultFavicon: true,
        onReady: viewer => {
          viewer.setBackgroundColor([0.95, 0.95, 0.95])
          viewer.setUpdateCallback(() => {
            event.emit('viewerUpdate')
          })
          this.viewer = viewer
        }
      })
    },
    //获取bim树
    getViewerTree() {
      let treeData = []
      Modelo.BIM.getTreeInfo(this.modelId)
        .then(bimTree => {
          console.log(bimTree)
          let bimTreeData = JSON.stringify(bimTree, null, 2)

          let models = Object.values(bimTree.models)
          let levels = Object.values(bimTree.levels)
          let categories = Object.values(bimTree.categories)
          let families = Object.values(bimTree.families)
          let types = Object.values(bimTree.types)
          let elements = Object.values(bimTree.elements)

          models.forEach(d => (d.children = levels.filter(l => l.modelId === d.id)))

          levels.forEach(d => (d.children = categories.filter(c => c.levelId === d.id)))

          categories.forEach(c => (c.children = families.filter(f => f.categoryId === c.id)))

          families.forEach(f => (f.children = types.filter(t => t.familyId === f.id)))

          types.forEach(t => (t.children = elements.filter(e => e.typeId === t.id)))
          console.log(models)
          this.$emit('update:treeData', models)
        })
        .catch(e => {})
    },
    //显示选中构件
    showGuid(guidAry) {
      if (guidAry && guidAry.length) {
        this.viewer.getScene().setModelVisibility(this.modelId, false, false)
        this.viewer.getScene().setElementsVisibility(guidAry, true)
        return
      }
      this.viewer.getScene().setModelVisibility(this.modelId, true)
    },
    //构件上色
    setColor(guidAry) {
      if (this.colorAry) {
        this.viewer.getScene().setElementsColor(this.colorAry, null)
      }
      this.viewer.getScene().setElementsColor(guidAry, [1, 0, 0])
      this.colorAry = guidAry
    },
    //清除标注
    clearMark() {
      console.log(111)
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
    setMark(elementID, imgSrc) {
      let model = document.getElementById('model')
      //添加标注
      elementID.forEach(e => {
        let pos3D = this.viewer.getScene().getElementsBBox([e])
        let icon = document.createElement('img')
        icon.setAttribute('src', imgSrc)
        icon.style.width = 14 + 'px'
        icon.style.height = 14 + 'px'
        icon.setAttribute('type', 'icon')
        icon.style.position = 'absolute'
        model.appendChild(icon)
        event.on('viewerUpdate', () => {
          let position2D = this.viewer.getCamera().project(pos3D.slice(3, 6))
          icon.style.left = position2D[0] + 'px'
          icon.style.top = position2D[1] + 'px'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;
  width: 100%;
  height: 100%;
  #model {
    position: relative;
    width: 100%;
    height: 100%;
  }
  #label {
    position: absolute;
  }
}
</style>

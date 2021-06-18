<template>
  <el-dialog width="80vw" title="选择图纸" :visible="visible" @close="close">
    <div class="wrap">
      <div class="menu-list">
        <h4>
          <span>图纸管理</span>
        </h4>
        <ul>
          <li v-for="item in list" :key="item.id" :class="{ active: activeId === item.id }" @click="changeType(item)">
            <div>
              <p class="name">{{ item.name }}</p>
              <p class="desc">
                <span class="time">{{ item.createTime }}</span>
                <span>{{ item.creatorName }}</span>
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="file-content">
        <DocComponent v-if="$hasPower('ProjectFileCommon')" ref="docComponent" :typeId="activeId" />
      </div>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import DocComponent from '../docComponent'
import Api from '../../api'
export default {
  name: 'DrawingSelect',
  // import引入的组件
  components: { DocComponent },
  props: {
    visible: {}
  },
  data() {
    // 这里存放数据
    return {
      addVisible: false,
      list: [],
      curId: null,
      curName: '',
      activeId: null,
      showMoreVisible: false
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh(true)
  },
  // 方法集合
  methods: {
    //刷新
    refresh(addActive) {
      this.getList(addActive)
    },
    async getList(addActive) {
      let res = await Api.file.list()
      this.list = res.data || []
      if (addActive) {
        if (res.data && res.data.length) {
          this.activeId = res.data[0].id
        }
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    submit() {
      let radioRow = this.$refs.docComponent.radioRow
      // console.log(radioRow.previewUrl)
      if (this.$parent.noRepeatDrawings(radioRow.id)) {
        if (radioRow.previewUrl) {
          this.close()
          this.$emit('getSelectDrawing', this.$refs.docComponent.radioRow)
        } else {
          this.$message.error('该图纸文件异常，请重新选择')
        }
      }
    },
    changeType(item) {
      this.activeId = item.id
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
  width: 100%;
  height: 600px;
  display: flex;
  .menu-list {
    flex: 0 0 400px;
    border: 1px solid #ddd;
    h4 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    ul {
      li {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 10px 10px 14px;
        border-bottom: 1px solid #ddd;
        font-size: 12px;
        color: #747070;
        cursor: pointer;
        &.active {
          &:before {
            position: absolute;
            top: 0;
            left: 0;
            width: 2px;
            height: 100%;
            background: #1b18a6;
            content: '';
          }
        }
        .name {
          max-width: 240px;
          margin-bottom: 10px;
          font-size: 14px;
          color: #000;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .time {
          margin-right: 10px;
        }
        .more-wrap {
          position: relative;
          .more {
            &:after {
              display: inline-block;
              content: '···';
              font-size: 24px;
              transform: rotate(90deg);
            }
            &:hover {
              .more-btn {
                height: 60px;
                bottom: -55px;
                box-shadow: 0 2px 12px 0 #ebeef5;
                border: 1px solid #ebeef5;
                padding: 6px;
              }
            }
            .more-btn {
              position: absolute;
              display: flex;
              flex-direction: column;
              height: 0;
              overflow: hidden;
              bottom: 1px;
              left: 0;
              z-index: 5;
              border-radius: 4px;
              background: #fff;
              .el-button {
                padding: 5px 10px;
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
  .file-content {
    width: calc(100% - 400px);
    overflow-x: scroll;
  }
}
</style>

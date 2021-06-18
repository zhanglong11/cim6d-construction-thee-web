<template>
  <div class="container">
    <div class="menu-list">
      <h4>
        <span>项目资料</span>
        <span>
          <el-button v-if="$hasPower('ProjectFileAdd')" icon="el-icon-plus" type="text" @click="showAddDialog"
            >新增</el-button
          >
        </span>
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
          <div v-if="item.id !== 'quality' && item.id !== 'safety'" class="more-wrap">
            <div class="more">
              <div class="more-btn">
                <el-button v-if="$hasPower('ProjectFileUpdate')" type="text" @click.stop="showAddDialog(item)"
                  >编辑</el-button
                >
                <el-button
                  v-if="$hasPower('ProjectFileRemove')"
                  style="color: red"
                  type="text"
                  @click.stop="remove(item)"
                  >删除</el-button
                >
              </div>
            </div>

            <!--            <el-button-group>-->
            <!--              <el-button v-if="$hasPower('ProjectFileUpdate')" type="primary" @click.stop="showAddDialog(item)"-->
            <!--                >编辑</el-button-->
            <!--              >-->
            <!--              <el-button v-if="$hasPower('ProjectFileRemove')" type="danger" @click.stop="remove(item)">删除</el-button>-->
            <!--            </el-button-group>-->
          </div>
        </li>
      </ul>
    </div>
    <div class="file-content"><DocComponent v-if="$hasPower('ProjectFileCommon')" :typeId="activeId" /></div>
    <RootAddDialog v-if="addVisible" :id="curId" :name="curName" :visible.sync="addVisible" />
  </div>
</template>

<script>
import DocComponent from './components/docComponent'
import RootAddDialog from './components/RootAddDialog'
import Api from './api'
export default {
  name: 'ProjectFile',
  // import引入的组件
  components: { DocComponent, RootAddDialog },
  props: {},
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
    showAddDialog(item) {
      this.curId = item.id
      this.curName = item.name
      this.addVisible = true
    },
    async remove(item) {
      await this.$tipRemove([item])
      await Api.file.delete(item.id)
      this.$message.success('删除成功')
      this.refresh(this.activeId === item.id)
    },
    changeType(item) {
      this.activeId = item.id
    }
  }
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
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
    overflow: hidden;
    flex: 1;
    margin-left: 10px;
    padding: 10px;
  }
}
</style>

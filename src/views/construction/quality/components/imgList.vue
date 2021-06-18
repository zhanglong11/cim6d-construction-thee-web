<template>
  <ul v-if="imageList.length">
    <li v-for="item of imageList" :key="item.id">
      <div class="image-container">
        <el-image
          style="width: 100px; height: 100px"
          :src="item.fileUrl"
          fit="scale-down"
          :preview-src-list="imageUrlList"
        ></el-image>
      </div>
      <el-tooltip :content="item.fileName" placement="bottom" effect="light">
        <p>{{ item.fileName }}</p>
      </el-tooltip>
    </li>
  </ul>
  <p v-else>-</p>
</template>

<script>
import api from '@/api/file'
export default {
  name: 'DetailItem',
  components: {},
  props: {
    ids: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageList: []
    }
  },
  computed: {
    imageUrlList() {
      return this.imageList.map(item => item.fileUrl)
    }
  },
  watch: {
    ids: {
      immediate: true,
      handler(val) {
        this.getFileList()
      }
    }
  },
  created() {},
  methods: {
    //获取文件列表
    async getFileList() {
      let arr = this.ids ? this.ids.split(',') : []
      if (!arr.length) return
      let fileRes = await api.getFileList(arr)
      this.imageList = fileRes.data || []
      console.log(this.imageList)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/styles/common.less');
ul {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 100px;
    box-sizing: content-box;
    flex-shrink: 1;
    /*height: 110px;*/
    margin: 5px 10px;
    padding: 5px;
    border: 1px #999 solid;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .image-container {
      height: 100px;
      width: 100px;
      position: relative;
      /deep/ .el-image img {
        border: 1px #ebdbdb dotted;
      }
    }
    p {
      text-align: center;
      font-size: 12px;
      height: 30px;
      line-height: 30px;
      color: #555;
      .ellipsis;
    }
  }
}
</style>

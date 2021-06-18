<template>
  <div class="container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="发给我的消息" name="1" />
      <el-tab-pane label="我发出的消息" name="2" />
      <el-tab-pane label="微信推送消息" name="3" />
    </el-tabs>
    <div v-if="activeName === '1'" class="tooltips">
      <el-form ref="form" inline :model="toMeFilterForm">
        <el-form-item>
          <el-input v-model="toMeFilterForm.keyword" placeholder="消息标题/发送人" />
        </el-form-item>
        <el-form-item label="消息类型">
          <SelectList v-model="toMeFilterForm.type" :self-list="typeList" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="消息状态">
          <SelectList v-model="toMeFilterForm.readStatus" :self-list="statusList" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="发送时间">
          <DateRange :startTime.sync="toMeFilterForm.startTime" :endTime.sync="toMeFilterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetToMe">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="activeName === '2'" class="tooltips">
      <el-form ref="form" inline :model="fromMeFilterForm">
        <el-form-item>
          <el-input v-model="fromMeFilterForm.keyword" placeholder="消息标题/接收人" />
        </el-form-item>
        <el-form-item label="发送时间">
          <DateRange :startTime.sync="fromMeFilterForm.startTime" :endTime.sync="fromMeFilterForm.endTime" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetFromMe">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <el-form-item v-if="$hasPower('noticeAdd')">
          <el-button type="primary" icon="el-icon-plus" @click="showAdd(null)">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid v-if="activeName === '1'" key="1" ref="table" :request="request" :filter-form.sync="toMeFilterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="title" title="消息标题" minWidth="200">
        <template #default="{ row }">
          <el-button type="text" @click="toDetails(row)">{{ row.title }}</el-button>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="type"
        title="消息类型"
        width="140"
        :formatter="({ cellValue }) => $getLabel(typeList, cellValue)"
      />
      <vxe-table-column field="sendName" title="发送人" width="200" />
      <vxe-table-column field="sendTime" title="发送时间" width="200" />
      <vxe-table-column
        field="readStatus"
        title="消息状态"
        width="140"
        :formatter="({ cellValue }) => $getLabel(statusList, cellValue)"
      />
      <vxe-table-column title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="showAdd(row.id)">查看详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <Grid v-if="activeName === '2'" key="2" ref="table" :request="request" :filter-form.sync="fromMeFilterForm">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="title" title="消息标题" minWidth="200" />
      <vxe-table-column field="receiveName" title="接收人" width="240" />
      <vxe-table-column field="sendTime" title="发送时间" width="200" />
      <vxe-table-column title="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="showAdd(row.id, false)">查看详情</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <WeChatMessage v-if="activeName === '3'" key="3"></WeChatMessage>
    <AddDialog v-if="visible" :id="activeId" :visible.sync="visible" :isRead="isRead" />
  </div>
</template>

<script>
import Api from './api'
import AddDialog from './components/addDialog'
import WeChatMessage from './components/WeChatMessage'
export default {
  name: 'NoticeManage',
  components: {
    AddDialog,
    WeChatMessage
  },
  data() {
    return {
      toMeFilterForm: {
        keyword: '',
        readStatus: !_.isNil(this.$route.query.readStatus) ? this.$route.query.readStatus - 0 : null
      },
      toMeFilterFormBack: {},
      fromMeFilterForm: {
        keyword: '',
        readStatus: !_.isNil(this.$route.query.readStatus) ? this.$route.query.readStatus - 0 : null
      },
      fromMeFilterFormBack: {},
      visible: !!+this.$route.query.showAdd || false,
      request: body => Api.receiveList(body),
      activeId: null,
      activeName: '1',
      isRead: true,
      typeList: [
        {
          value: 0,
          label: '系统信息'
        },
        {
          value: 1,
          label: '个人消息'
        },
        {
          value: 2,
          label: '微信推送'
        }
      ],
      // 公告状态下拉框数据
      statusList: [
        {
          value: 0,
          label: '未读'
        },
        {
          value: 1,
          label: '已读'
        }
      ]
    }
  },
  watch: {
    activeName(v) {
      this.request = v === '1' ? body => Api.receiveList(body) : body => Api.sendList(body)
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  mounted() {
    let query = this.$route.query
    if (query.showAdd) {
      console.log(3333, query.showAdd)
      this.activeName = '2'
    }
    if (query.showAdd === '0') {
      this.showAdd(query.targetId, true)
    }
    Object.assign(this.toMeFilterFormBack, this.toMeFilterForm)
    Object.assign(this.fromMeFilterFormBack, this.fromMeFilterForm)
    console.log(444, query.showAdd, this.activeName)
  },
  methods: {
    //刷新数据
    refresh() {
      this.$refs.table.refresh()
    },
    //重置搜索
    reset() {
      this.$refs.table.reset()
    },
    // 重置发送给我的查询
    resetToMe() {
      Object.assign(this.toMeFilterForm, this.toMeFilterFormBack)
      this.refresh()
    },
    // 重置我发出的查询
    resetFromMe() {
      Object.assign(this.fromMeFilterForm, this.fromMeFilterFormBack)
      this.refresh()
    },
    //添加模态框
    showAdd(id, isRead = true) {
      this.activeId = id
      this.visible = true
      this.isRead = isRead
    },
    // 跳转消息详情
    toDetails(item) {
      if (item.pcUrl) {
        this.$router.push({
          name: item.pcUrl,
          query: {
            id: item.dataId
          }
        })
      } else {
        this.showAdd(item.id)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>

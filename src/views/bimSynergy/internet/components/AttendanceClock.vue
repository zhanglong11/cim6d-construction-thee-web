<template>
  <div class="wrap">
    <div class="left">
      <div class="group-total">
        <BlockCard title="管理部门出勤统计">
          <template #content>
            <div>123</div>
          </template>
        </BlockCard>
      </div>
      <div class="err-total">
        <BlockCard title="管理部门出勤统计">
          <template #content>
            <div class="header">
              <span>日</span>
              <span>月</span>
            </div>
            <ul>
              <li>
                <div class="detail">
                  <div class="icon"></div>
                  <div class="person-info">
                    <p>
                      <span class="label">姓名</span>
                      <span class="value">小名</span>
                    </p>
                    <p>
                      <span class="label">姓名</span>
                      <span class="value">小名</span>
                    </p>
                  </div>
                </div>
                <div class="person-status">
                  <span>·</span>
                  <span>早退</span>
                </div>
              </li>
              <li>
                <div class="detail">
                  <div class="icon"></div>
                  <div class="person-info">
                    <p>
                      <span class="label">姓名</span>
                      <span class="value">小名</span>
                    </p>
                    <p>
                      <span class="label">姓名</span>
                      <span class="value">小名</span>
                    </p>
                  </div>
                </div>
                <div class="person-status">
                  <span>·</span>
                  <span>早退</span>
                </div>
              </li>
            </ul>
          </template>
        </BlockCard>
      </div>
    </div>
    <div class="center">center</div>
    <div class="right">right</div>
  </div>
</template>

<script>
import BlockCard from '../../componments/BlockCard'
export default {
  name: 'AttendanceClock',
  // import引入的组件
  components: { BlockCard },
  props: {},
  data() {
    // 这里存放数据
    return {}
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import url('../../common.less');
.wrap {
  display: flex;
  height: 100%;
  color: #fff;
  .left {
    display: flex;
    flex-direction: column;
    flex: 0 0 380px;
    .group-total {
      flex: 0 0 300px;
    }
    .err-total {
      flex: 1;
      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        > span {
          display: inline-flex;
          padding: 10px 20px;
          cursor: pointer;
          background: red;
          & + span {
            margin-left: 10px;
          }
        }
      }
      ul {
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid red;
          & + li {
            margin-top: 10px;
          }
          .detail {
            display: flex;
            .icon {
              width: 40px;
              height: 40px;
              margin-top: 16px;
              background: red;
              border-radius: 50%;
            }
            .person-info {
              margin-left: 20px;
              p {
                padding: 10px 0;
                .label {
                  color: #ddd;
                }
                .value {
                  color: #fff;
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
  .center {
    flex: 1;
    margin: 0 30px 0 30px;
    padding-top: 50px;
  }
  .right {
    flex: 0 0 380px;
  }
}
</style>

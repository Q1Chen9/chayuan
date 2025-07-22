/**
* @Author: 858834013@qq.com
* @Name: item
* @Date: 2023-07-10
* @Desc: 森林环境监测数据展示组件
*/
<template>
  <div class="itemBody">
    <div class="list">
      <div class="listItem" v-for="(item, index) in list" :key="index">
        <div class="icon">
          <component :is="item.icon"></component>
        </div>
        <div class="listItemInfo">
          <p>{{ item.name }}</p>
          <div class="listItemInfo2">
            <gsapNum :number="item.value"></gsapNum>
            <span>{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gsapNum from "@/components/gsapNum/index.vue";
import icon1 from "./icon1/index.vue";
import icon2 from "./icon2/index.vue";
import icon3 from "./icon3/index.vue";
import icon4 from "./icon4/index.vue";

export default {
  components: { gsapNum, icon1, icon2, icon3, icon4 },
  name: "item",
  data() {
    return {
      list: [
        { name: '空气质量指数', value: 75, unit: 'AQI', icon: 'icon1' },
        { name: '平均温度', value: 22.5, unit: '°C', icon: 'icon2' },
        { name: '相对湿度', value: 65, unit: '%', icon: 'icon3' },
        { name: '降雨量', value: 35.2, unit: 'mm', icon: 'icon4' }
      ],
    }
  },
  mounted() {
    // 组件挂载后可以添加其他初始化逻辑
  },
  methods: {
    // 可以添加其他方法，如果需要的话
  }
}
</script>
<style lang="scss" scoped>
.itemBody {
  width: 100%;
  height: calc(100% - 0px);
  position: relative;

  .list {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: flex-start;

    .listItem {
      width: calc(50% - 20px);
      margin-left: 10px;
      height: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;

      .icon {
        background: url("./assets/iconbg.png") no-repeat;
        width: 40px;
        height: 40px;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-content: flex-start;
      }

      .listItemInfo {
        margin-left: 10px;

        p {
          font-size: 12px;
          font-family: MicrosoftYaHei;
          font-weight: 400;
          color: rgba(66, 207, 176, 1);
        }

        span {
          font-size: 14px;
          font-weight: normal;
          color: rgba(220, 255, 236, 1);
          margin-left: 10px;
        }

        .listItemInfo2 {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: nowrap;
          flex-direction: row;
          align-content: flex-start;
        }

        :deep(.listItemInfo2) {
          .gsapNum {
            color: rgba(220, 255, 236, 1);
          }
        }
      }
    }
  }
}
</style>

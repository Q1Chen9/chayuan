<template>
  <div class="tableCom">
    <div class="tableHead">
      <div class="icon_left"></div>
      <div class="icon_right"></div>
      <div class="tableHeads">
        <div class="tableHeadItem" v-for="(item,index) in head" :key="index"
             :style="{flex:item.flex}"
        >
          <div class="title">
            {{ item.title }}
          </div>
          <img src="./assets/icon_down.png" alt="">
        </div>
      </div>
    </div>
    <vue-seamless-scroll :list="list" class="tableBody" :step="0.5" :hover="true">
      <div class="tableBody2" v-for="(item,index) in list" :key="index">
        <div class="tableBody2s">
          <div class="tableBody2Item" :style="{flex: head[0].flex}">
            <div class="num">{{ item.location }}</div>
          </div>
          <div class="tableBody2Item" :style="{flex: head[1].flex}">
            <span class="num">{{ item.riskLevel }}</span>
          </div>
          <div class="tableBody2Item" :style="{flex: head[2].flex}">
            <span class="num">{{ item.temperature }}</span>
          </div>
          <div class="tableBody2Item" :style="{flex: head[3].flex}">
            <span class="num">{{ item.humidity }}</span>
          </div>
        </div>
        <div class="icon_left"></div>
        <div class="icon_right"></div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>

<script>

export default {
  name: "tableCom",
  props: {
    head: {
      type: Array,
      default() {
        return [{
          title: '地点',
          flex: 1
        }, {
          title: '风险等级',
          flex: 1
        }, {
          title: '温度',
          flex: 1
        }, {
          title: '湿度',
          flex: 1
        }];
      }
    },
    list: {
      type: Array,
      default() {
        return [{
          location: '森林区域A',
          riskLevel: '高',
          temperature: '35°C',
          humidity: '20%',
        },{
          location: '森林区域B',
          riskLevel: '中',
          temperature: '30°C',
          humidity: '35%',
        },{
          location: '森林区域C',
          riskLevel: '低',
          temperature: '25°C',
          humidity: '50%',
        },{
          location: '森林区域D',
          riskLevel: '高',
          temperature: '37°C',
          humidity: '15%',
        },{
          location: '森林区域E',
          riskLevel: '中',
          temperature: '32°C',
          humidity: '30%',
        },{
          location: '森林区域F',
          riskLevel: '低',
          temperature: '28°C',
          humidity: '45%',
        },];
      }
    },
  },
  data() {
    return {}
  },
  watch: {},
  mounted() {
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.tableCom {
  width: calc(100% - 0px);
  margin-left: 0px;
  position: relative;
  height: 100%;
  overflow: hidden;

  .tableHead {
    width: 100%;
    height: 40px;
    background: #07453f;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    border-bottom: 1px solid rgba(6, 104, 104, 1.00);
    position: relative;

    .tableHeads {
      display: flex;
      height: 40px;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      position: relative;
      width: calc(100% - 20px);
    }

    .icon_left {
      position: absolute;
      background: url("./assets/icon_left.png");
      background-size: 100% 100%;
      width: 12px;
      height: 19px;
      left: 5px;
    }

    .icon_right {
      position: absolute;
      background: url("./assets/icon_right.png");
      width: 11px;
      height: 19px;
      right: 5px;
      background-size: 100% 100%;
    }

    .tableHeadItem {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;

      .title {
        width: calc(100% - 20px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }

      img {
        width: 10px;
        position: absolute;
        bottom: 0;
      }
    }
  }

  .tableBody {
    position: relative;
    height: calc(100% - 40px);
    overflow: hidden;
    width: 100%;

    .tableBody2 {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      position: relative;
      width: 100%;

      .tableBody2s {
        display: flex;
        height: 40px;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
        position: relative;
        width: calc(100% - 20px);
      }

      .icon_left {
        position: absolute;
        background: url("./assets/icon_left2.png");
        width: 11px;
        height: 19px;
        left: 5px;
      }

      .icon_right {
        position: absolute;
        background: url("./assets/icon_right2.png");
        width: 12px;
        height: 19px;
        right: 5px;
      }

      .tableBody2Item {
        font-size: 14px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color: #FFFFFF;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;

        .num {
          width: calc(100% - 20px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: center;
        }
      }
    }

    .tableBody2:nth-child(2n) {
      background: rgba(9, 57, 66, 0);
      background-size: 100% 100%;
    }
  }
}
</style>

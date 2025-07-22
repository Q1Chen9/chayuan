<template>
  <div class="echartsBodys">
    <echarts1 name="林龄结构" :total="total" :list="list" ref="echarts"></echarts1>
    <div class="list">
      <div class="listItem cur" @click="getChecked(index)" v-for="(item, index) in list" :key="index">
        <div class="listIteml">
          <div class="dot" :class="{disabled: !item.checked}"
               :style="'background: linear-gradient(80deg,' + item.color1 + ' 0%, ' + item.color2 + ' 100%);'"></div>
          <span :class="{disabled: !item.checked}">{{ item.name }}</span>
        </div>
        <em class="num" v-if="item.checked">{{ item.value }}%</em>
        <em class="num" v-else>{{ item.value }}%</em>
      </div>
    </div>
  </div>
</template>

<script>
import echarts1 from "./components/echarts.vue";

export default {
  name: "title",
  data() {
    return {
      list: this.generateData()
    }
  },
  computed: {
    total() {
      return this.list.reduce((sum, type) => sum + type.value, 0);
    }
  },
  components: { echarts1 },
  methods: {
    getChecked(index) {
      this.list[index].checked = !this.list[index].checked;
      this.$refs.echarts.drawEcharts();
    },
    getRandomValue(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    generateData() {
      const types = [
        { name: "幼龄林", value: 30 },
        { name: "中龄林", value: 25 },
        { name: "近熟林", value: 20 },
        { name: "成熟林", value: 15 },
        { name: "过熟林", value: 10 }
      ];
      const colors = [
        { color1: 'rgba(36, 231, 151, 1)', color2: 'rgba(23, 166, 80, 0.5)' },
        { color1: 'rgba(22, 124, 230, 1)', color2: 'rgba(56, 218, 237, 1)' },
        { color1: 'rgba(255, 106, 106, 1)', color2: 'rgba(199, 21, 21, 0.5)' },
        { color1: 'rgba(255, 193, 7, 1)', color2: 'rgba(255, 154, 0, 0.5)' },
        { color1: 'rgba(156, 39, 176, 1)', color2: 'rgba(123, 31, 162, 0.5)' }
      ];

      return types.map((type, index) => ({
        name: type.name,
        value: type.value,
        ...colors[index],
        checked: true
      }));
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  margin-left: 0px;
  position: relative;
  width: calc(50% - 0px);
  height: calc(100% - 0px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: column;
  align-content: flex-start;

  .listItem {
    font-size: 14px;
    display: flex;
    height: 20%;
    width: calc(100% - 20px);
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;

    .title {
      font-family: MicrosoftYaHei;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
      margin-top: 20px;
    }

    .listIteml {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #FFFFFF;
    }

    span {
      font-family: MicrosoftYaHei;
      font-weight: 400;
      font-size: 13px;
      color: #A9DDEE;
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid rgb(255, 255, 255);
      margin-right: 10px;
    }

    .dot.disabled {
      background: rgba(#999, 0.8) !important;
    }

    span.disabled {
      color: rgba(#999, 0.8) !important;
    }

    .num {
      font-family: MicrosoftYaHei;
      font-weight: bold;
      font-size: 14px;
      color: #FFFFFF;
    }
  }
}

.echartsBodys {
  width: 100%;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
}
</style>

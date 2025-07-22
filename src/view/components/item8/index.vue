<template>
  <div class="echartsBodys">
    <echarts1 title="林业生态效益分析" :total="total" :list="listWithPercentage" ref="echarts"></echarts1>
    <div class="list">
      <div class="listItem cur" @click="getChecked(index)" v-for="(item,index) in listWithPercentage" :key="index">
        <div class="listIteml">
          <div class="dot" :class="{disabled:!item.checked}"
               :style="'background: linear-gradient(0deg,'+item.color1+' 0%, '+item.color2+' 100%);'"></div>
          <span :class="{disabled:!item.checked}">{{ item.name }}</span>
        </div>
        <div class="num"
             :class="{disabled:!item.checked}">
          {{ item.value }}亿元
        </div>
        <div class="dot1"></div>
        <div class="dot2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts1 from "./components/echarts.vue";

export default {
  name: "EcologicalBenefitsAnalysis",
  data() {
    return {
      list: [
        {
          name: '固碳释氧',
          value: 120,
          color1: '#FF6384',
          color2: '#FF8C9D',
          checked: true
        },
        {
          name: '水源涵养',
          value: 80,
          color1: '#36A2EB',
          color2: '#5ABFFF',
          checked: true
        },
        {
          name: '土壤保持',
          value: 60,
          color1: '#FFCE56',
          color2: '#FFE08C',
          checked: true
        },
        {
          name: '空气净化',
          value: 40,
          color1: '#4BC0C0',
          color2: '#7CD6D6',
          checked: true
        },
        {
          name: '生物多样性保护',
          value: 30,
          color1: '#9966FF',
          color2: '#B18CFF',
          checked: true
        }
      ]
    }
  },
  computed: {
    total: function () {
      return this.list.reduce((sum, item) => sum + item.value, 0);
    },
    listWithPercentage: function() {
      return this.list.map(item => ({
        ...item,
        percentage: ((item.value / this.total) * 100).toFixed(2) + '%'
      }));
    }
  },
  components: {echarts1},
  mounted() {
    this.$nextTick(() => {
      this.$refs.echarts.drawEcharts();
    });
  },
  methods: {
    getChecked(index) {
      this.list[index].checked = !this.list[index].checked;
      this.$refs.echarts.drawEcharts();
    }
  },
}
</script>

<style lang="scss" scoped>
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

.list {
  position: relative;
  width: calc(50% - 10px);
  margin-right: 10px;
  height: calc(100% - 0px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: column;
  align-content: flex-start;

  .dot1, .dot2 {
    width: 4px;
    height: 3px;
    background: #206160;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    position: absolute;
    bottom: -2px;
  }

  .dot1 {
    left: 0;
  }

  .dot2 {
    right: 0;
  }

  .listItem {
    font-size: 14px;
    display: flex;
    width: calc(100% - 0px);
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
    border-bottom: 1px solid #206160;
    position: relative;
    height: 40px;

    .listIteml {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #cfd2df;
      margin-left: 0px;

      .dot {
        width: 6px;
        height: 6px;
        margin-right: 10px;
        flex-shrink: 0;

        &.disabled {
          background: rgba(#206160, 0.8) !important;
        }
      }

      span {
        font-size: 12px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        color: #16bdaa;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row;
        align-content: flex-start;

        &.disabled {
          color: rgba(#206160, 0.8) !important;
        }
      }
    }

    .num {
      font-size: 12px;
      font-family: DIN, DIN;
      font-weight: 500;
      color: #FFFFFF;
      margin-right: 10px;

      &.disabled {
        color: rgba(#999, 0.8) !important;
      }
    }
  }
}
</style>

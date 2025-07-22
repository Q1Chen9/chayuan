<template>
  <div class="itemBodys">
    <echarts :list="list"></echarts>
  </div>
</template>

<script>
import echarts from "./components/echarts.vue";

export default {
  data() {
    return {
      list: []
    }
  },
  components: { echarts },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      function generateYearlyData() {
        const data = [];
        const currentYear = new Date().getFullYear();

        for (let i = 0; i < 10; i++) {
          const year = currentYear - 9 + i;
          data.push({
            name: `${year}年`,
            value: (Math.random() * 10 + 60).toFixed(2), // 生成60%到70%之间的随机数
          });
        }

        return data;
      }

      const yearlyData = generateYearlyData();
      console.log(yearlyData);
      this.list = yearlyData;
    },
  },
}
</script>

<style lang="scss" scoped>
.itemBodys {
  width: 100%;
  position: relative;
  height: calc(100% - 0px);
}

.echartsBody {
  position: relative;
  width: 100%;
  height: calc(100% - 0px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
}
</style>

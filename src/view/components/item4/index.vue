<template>
  <div class="itemBodys">
    <div class="topInfo">
      <div class="totalCount">总造林任务: {{ totalAfforestationTask }}亩</div>
    </div>
    <div class="chartsContainer">
      <echarts v-for="(item,index) in list" :key="index"
               :color4="item.color4"
               :color3="item.color3"
               :color1="item.color1"
               :color2="item.color2"
               :percent="item.percentage"
               :value="item.value"
               :name="item.name"></echarts>
    </div>
  </div>
</template>

<script>
import echarts from "./components/echarts.vue";

export default {
  data() {
    return {
      list: [],
      colorList: ['#14e48a', '#1ec9ff', '#ffbf2f'],
      totalAfforestationTask: 0
    }
  },
  components: {echarts},
  computed: {},
  mounted() {
    this.getData()
  },
  methods: {
    // 转换十六进制颜色为 RGBA 格式
    hexToRgba(hex, alpha) {
      const [r, g, b] = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },
    async getData() {
      try {
        const afforestationTypes = ['人工造林', '飞播造林', '封山育林'];

        // 生成指定范围内的随机整数
        function getRandomInteger(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        this.totalAfforestationTask = getRandomInteger(50000, 100000);

        let data = afforestationTypes.map(type => ({
          name: type,
          value: getRandomInteger(5000, 40000)
        }));

        // 首先计算所有 value 的总和
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        // 然后将百分比字段添加到每个元素
        const result = data.map((item, index) => ({
          ...item,
          percentage: ((item.value / this.totalAfforestationTask) * 100).toFixed(0),
          color1: this.hexToRgba(this.colorList[index], 0.5),
          color2: this.hexToRgba(this.colorList[index], 1),
          color3: this.hexToRgba(this.colorList[index], 0.8),
          color4: this.hexToRgba(this.colorList[index], 0.3),
        }));

        this.list = result
      } catch (err) {
        console.error(err);
      }
    }
  },
  filters: {},
  watch: {}
}
</script>

<style lang="scss" scoped>
.itemBodys {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.topInfo {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.totalCount {
  font-size: 18px;
  font-weight: bold;
  color: #14e48a;
}

.chartsContainer {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  position: relative;
  width: 100%;
  height: calc(100% - 40px);
}

.echartsBody {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
}
</style>

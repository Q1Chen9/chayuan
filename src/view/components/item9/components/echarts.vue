<template>
  <div class="echarts1" ref="echarts">
  </div>
</template>

<script>
import * as echarts from "echarts";
import dot2 from './assets/icon_dot2.png';

export default {
  name: 'echarts1',
  components: {},
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  watch: {
    list() {
      this.drawEcharts();
    }
  },
  mounted() {
    this.drawEcharts();
  },
  methods: {
    drawEcharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(this.$refs.echarts);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
      var option = {
        grid: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(255, 255, 255, 0.1)'
              }, {
                offset: 1,
                color: 'rgba(255, 255, 255, 0.5)'
              }], false),
            }
          }
        },
        legend: {
          top: 0,
          right: 0,
          itemWidth: 10,
          itemHeight: 10,
          show:false,
          textStyle: {
            color: 'rgba(157, 185, 233, 1)',
            fontSize: '14'
          },
          data: [
            {name: '森林覆盖率', icon: 'image://' + dot2},
          ],
        },
        xAxis: [
          {
            data: this.list.map(obj => obj.name),
            axisLabel: {
              margin: 10,
              interval: 0,
              color: 'rgba(220, 254, 255, 1)',
              textStyle: {
                fontSize: 12
              },
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(8, 61, 98, 1.00)',
                type: 'dashed',
                width: 1,
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: 'rgba(39, 76, 129, 0.26)',
                width: 1,
              }
            },
            axisTick: {
              show: false
            },
          }],
        yAxis: [
          {
            type: 'value',
            splitNumber: 3,
            axisLabel: {
              color: 'rgba(220, 254, 255, 1)',
              textStyle: {
                fontSize: 12
              },
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(8, 61, 98, 1.00)',
                type: 'dashed',
                width: 1,
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(8, 61, 98, 1.00)',
                type: 'dashed',
                width: 1,
              }
            }
          }],
        series: [
          {
            name: '森林覆盖率',
            type: 'line',
            data: this.list.map(obj => obj.value),
            smooth: false,
            symbol: 'image://' + dot2, //数值点设定为实心点
            symbolSize: 11, // 折线的点的大小
            itemStyle: {
              normal: {
                color: 'rgba(102, 255, 166, 1)', //点的颜色
                lineStyle: {
                  color: 'rgba(102, 255, 166, 1)', //线的颜色
                  width: 1, // 折线图线条粗细设置
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(102, 255, 166, 0.5)'
                },
                  {
                    offset: 1,
                    color: 'rgba(102, 255, 166,0)'
                  }
                ], false),
              }
            },
          },
        ]
      };
      myChart.clear();
      myChart.resize();
      myChart.setOption(option);
    },
  }
}
</script>

<style lang="scss" scoped>
.echarts1 {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

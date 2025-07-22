<template>
  <div class="co2-trend-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "MonitorCo2Trend",
  data() {
    return {
      chart: null,
      co2Data: {
        dates: ['2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01'],
        values: [410, 425, 438, 420, 412, 426, 435],
        baseline: [400, 400, 400, 400, 400, 400, 400],
        warning: [600, 600, 600, 600, 600, 600, 600]
      }
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el);
      this.updateChart();
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    updateChart() {
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['二氧化碳浓度', '基准值', '警戒值'],
          textStyle: {
            color: '#d5f1f8'
          },
          right: '10%',
          top: '2%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.co2Data.dates,
          axisLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.3)'
            }
          },
          axisLabel: {
            color: '#d5f1f8'
          }
        },
        yAxis: {
          type: 'value',
          name: 'ppm',
          nameTextStyle: {
            color: '#d5f1f8'
          },
          min: 350,
          max: 650,
          axisLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.3)'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.1)'
            }
          },
          axisLabel: {
            color: '#d5f1f8'
          }
        },
        series: [
          {
            name: '二氧化碳浓度',
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 4,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#5A66FF' },
                  { offset: 1, color: '#A66CFF' }
                ]
              }
            },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#A66CFF',
              borderColor: '#fff',
              borderWidth: 2
            },
            data: this.co2Data.values,
            z: 3,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(90, 102, 255, 0.5)' },
                { offset: 1, color: 'rgba(166, 108, 255, 0.1)' }
              ])
            }
          },
          {
            name: '基准值',
            type: 'line',
            lineStyle: {
              width: 2,
              type: 'dashed',
              color: 'rgba(35, 253, 192, 0.8)'
            },
            symbol: 'none',
            data: this.co2Data.baseline,
            z: 2
          },
          {
            name: '警戒值',
            type: 'line',
            lineStyle: {
              width: 2,
              type: 'dashed',
              color: 'rgba(255, 83, 112, 0.8)'
            },
            symbol: 'none',
            data: this.co2Data.warning,
            z: 1
          },
          {
            name: '区域标记',
            type: 'line',
            markArea: {
              silent: true,
              itemStyle: {
                color: 'rgba(255, 83, 112, 0.05)'
              },
              data: [
                [
                  { yAxis: 600 },
                  { yAxis: 650 }
                ]
              ]
            },
            z: 0
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.co2-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
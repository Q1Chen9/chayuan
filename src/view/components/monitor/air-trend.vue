<template>
  <div class="air-trend-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "MonitorAirTrend",
  data() {
    return {
      chart: null,
      airData: {
        dates: ['2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01'],
        aqi: [42, 58, 35, 62, 48, 37, 45],
        pm25: [18, 32, 12, 35, 22, 15, 20],
        pm10: [35, 60, 30, 70, 45, 33, 42]
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
          data: ['AQI', 'PM2.5', 'PM10'],
          textStyle: {
            color: '#d5f1f8'
          },
          right: '5%',
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
          data: this.airData.dates,
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
          name: '指数',
          nameTextStyle: {
            color: '#d5f1f8'
          },
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
            name: 'AQI',
            type: 'line',
            smooth: true,
            data: this.airData.aqi,
            itemStyle: {
              color: '#47C8FF'
            },
            lineStyle: {
              width: 3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#47C8FF' },
                  { offset: 1, color: '#23fdc0' }
                ]
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(71, 200, 255, 0.3)' },
                  { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
                ]
              }
            }
          },
          {
            name: 'PM2.5',
            type: 'bar',
            data: this.airData.pm25,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(104, 211, 145, 0.8)' },
                { offset: 1, color: 'rgba(104, 211, 145, 0.1)' }
              ])
            }
          },
          {
            name: 'PM10',
            type: 'bar',
            data: this.airData.pm10,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 190, 65, 0.8)' },
                { offset: 1, color: 'rgba(255, 190, 65, 0.1)' }
              ])
            }
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.air-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
<template>
  <div class="temp-humidity-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "MonitorTempHumidityTrend",
  data() {
    return {
      chart: null,
      trendData: {
        dates: ['2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01'],
        temperature: [22.5, 24.8, 26.3, 25.1, 23.7, 25.9, 24.5],
        humidity: [65, 58, 52, 60, 72, 68, 63]
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
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['温度', '湿度'],
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
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.trendData.dates,
            axisLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.3)'
              }
            },
            axisLabel: {
              color: '#d5f1f8'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '温度 (°C)',
            min: 15,
            max: 35,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#FF5370'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.1)'
              }
            },
            axisLabel: {
              formatter: '{value} °C',
              color: '#FF5370'
            },
            nameTextStyle: {
              color: '#FF5370'
            }
          },
          {
            type: 'value',
            name: '湿度 (%)',
            min: 30,
            max: 90,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#47C8FF'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %',
              color: '#47C8FF'
            },
            nameTextStyle: {
              color: '#47C8FF'
            }
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              width: 3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#FF5370' },
                  { offset: 1, color: '#ff8f70' }
                ]
              }
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#FF5370',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 83, 112, 0.4)' },
                { offset: 1, color: 'rgba(255, 143, 112, 0.1)' }
              ])
            },
            data: this.trendData.temperature
          },
          {
            name: '湿度',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
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
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#47C8FF',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(71, 200, 255, 0.4)' },
                { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
              ])
            },
            data: this.trendData.humidity
          }
        ],
        visualMap: [
          {
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: 15,
            max: 35,
            inRange: {
              color: ['#ffffbf', '#fd8d3c', '#f03b20', '#bd0026']
            }
          },
          {
            show: false,
            type: 'continuous',
            seriesIndex: 1,
            min: 30,
            max: 90,
            inRange: {
              color: ['#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5']
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
.temp-humidity-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
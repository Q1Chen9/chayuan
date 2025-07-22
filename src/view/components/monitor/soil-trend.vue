<template>
  <div class="soil-trend-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "MonitorSoilTrend",
  data() {
    return {
      chart: null,
      soilData: {
        dates: ['2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01'],
        temperature: [19.5, 20.1, 19.8, 20.3, 19.7, 19.3, 19.9],
        moisture: [42, 38, 35, 46, 52, 48, 44]
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
          formatter: function(params) {
            let result = params[0].name + '<br/>';
            params.forEach(param => {
              let marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
              let value = param.seriesName === '土壤温度' ? param.value + ' °C' : param.value + ' %';
              result += marker + param.seriesName + ': ' + value + '<br/>';
            });
            return result;
          }
        },
        legend: {
          data: ['土壤温度', '土壤湿度'],
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
          boundaryGap: false,
          data: this.soilData.dates,
          axisLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.3)'
            }
          },
          axisLabel: {
            color: '#d5f1f8'
          }
        },
        yAxis: [{
          type: 'value',
          name: '温度 (°C)',
          min: 15,
          max: 25,
          position: 'left',
          axisLine: {
            lineStyle: {
              color: '#A66CFF'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.1)'
            }
          },
          axisLabel: {
            formatter: '{value} °C',
            color: '#A66CFF'
          },
          nameTextStyle: {
            color: '#A66CFF'
          }
        }, {
          type: 'value',
          name: '湿度 (%)',
          min: 0,
          max: 100,
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#23fdc0'
            }
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: '{value} %',
            color: '#23fdc0'
          },
          nameTextStyle: {
            color: '#23fdc0'
          }
        }],
        series: [{
          name: '土壤温度',
          type: 'line',
          yAxisIndex: 0,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#A66CFF'
          },
          data: this.soilData.temperature,
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#7B68EE' },
                { offset: 1, color: '#A66CFF' }
              ]
            }
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(123, 104, 238, 0.4)' },
              { offset: 1, color: 'rgba(166, 108, 255, 0.1)' }
            ])
          },
          smooth: true
        }, {
          name: '土壤湿度',
          type: 'bar',
          yAxisIndex: 1,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(35, 253, 192, 0.8)' },
              { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '40%',
          data: this.soilData.moisture
        }, {
          name: '适宜湿度范围',
          type: 'line',
          yAxisIndex: 1,
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            width: 1,
            color: 'rgba(35, 253, 192, 0.5)'
          },
          markArea: {
            silent: true,
            itemStyle: {
              color: 'rgba(35, 253, 192, 0.05)'
            },
            data: [
              [{
                yAxis: 35
              }, {
                yAxis: 65
              }]
            ]
          }
        }]
      };
      this.chart.setOption(option);
    }
  }
}
</script>

<style lang="scss" scoped>
.soil-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
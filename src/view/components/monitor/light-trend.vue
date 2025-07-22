<template>
  <div class="light-trend-chart"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: "MonitorLightTrend",
  data() {
    return {
      chart: null,
      lightData: {
        dates: ['2025-03-26', '2025-03-27', '2025-03-28', '2025-03-29', '2025-03-30', '2025-03-31', '2025-04-01'],
        intensity: [85000, 92000, 45000, 78000, 95000, 88000, 72000],
        duration: [12.5, 13.2, 6.8, 10.4, 13.6, 12.8, 11.5]
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
          },
          formatter: function(params) {
            let result = params[0].name + '<br/>';
            params.forEach(param => {
              let marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
              let value = param.seriesName === '光照强度' ? 
                param.value.toLocaleString() + ' lux' : 
                param.value + ' 小时';
              result += marker + param.seriesName + ': ' + value + '<br/>';
            });
            return result;
          }
        },
        legend: {
          data: ['光照强度', '光照时长'],
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
          data: this.lightData.dates,
          axisLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.3)'
            }
          },
          axisLabel: {
            color: '#d5f1f8'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '光照强度 (lux)',
            min: 0,
            max: 100000,
            interval: 20000,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#FFBA5A'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.1)'
              }
            },
            axisLabel: {
              formatter: function(value) {
                return value / 1000 + 'k';
              },
              color: '#FFBA5A'
            },
            nameTextStyle: {
              color: '#FFBA5A'
            }
          },
          {
            type: 'value',
            name: '光照时长 (小时)',
            min: 0,
            max: 15,
            interval: 3,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#61E1FF'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value}',
              color: '#61E1FF'
            },
            nameTextStyle: {
              color: '#61E1FF'
            }
          }
        ],
        series: [
          {
            name: '光照强度',
            type: 'bar',
            barWidth: '40%',
            yAxisIndex: 0,
            data: this.lightData.intensity,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 186, 90, 0.9)' },
                { offset: 1, color: 'rgba(255, 228, 90, 0.3)' }
              ]),
              borderRadius: [4, 4, 0, 0]
            }
          },
          {
            name: '光照时长',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              type: 'solid',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#61E1FF' },
                  { offset: 1, color: '#A09CFF' }
                ]
              }
            },
            itemStyle: {
              color: '#61E1FF',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(97, 225, 255, 0.3)' },
                { offset: 1, color: 'rgba(160, 156, 255, 0.1)' }
              ])
            },
            data: this.lightData.duration
          }
        ],
        // 在光照强度图表中添加阳光效果
        graphic: [
          {
            type: 'image',
            id: 'logo',
            right: '5%',
            top: '12%',
            z: 10,
            bounding: 'raw',
            style: {
              image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZD0iTTE2IDEwYTYgNiAwIDEgMSAwIDEyIDYgNiAwIDAgMSAwLTEyeiBNMTYgNmEyIDIgMCAwIDEgMi0yVjJhMiAyIDAgMSAxLTQgMHYyYTIgMiAwIDAgMSAyIDJ6TTYgMTZhMiAyIDAgMCAxLTItMkgyYTIgMiAwIDEgMSAwIDRoMmEyIDIgMCAwIDEgMi0yek0xNiAyNmEyIDIgMCAwIDEtMiAydjJhMiAyIDAgMSAxIDQgMHYtMmEyIDIgMCAwIDEtMi0yek0yNiAxNmEyIDIgMCAwIDEgMiAyaDJhMiAyIDAgMSAxIDAtNGgtMmEyIDIgMCAwIDEtMiAyek05LjUgOC45YTIgMiAwIDAgMS0yLjggMi44TDUuMyAxMC4zYTIgMiAwIDEgMSAyLjgtMi44bDEuNSAxLjV6TTIyLjUgMjMuMWEyIDIgMCAwIDEtMi44IDIuOGwtMS40LTEuNGEyIDIgMCAxIDEgMi44LTIuOGwxLjQgMS40ek04LjkgMjIuNWEyIDIgMCAwIDEgMi44IDIuOEwxMC4zIDI2LjdhMiAyIDAgMSAxLTIuOC0yLjhsMS40LTEuNHpNMjMuMSA5LjVhMiAyIDAgMCAxIDIuOC0yLjhsMS40IDEuNGEyIDIgMCAxIDEtMi44IDIuOGwtMS40LTEuNHoiIGZpbGw9IiNGRkJBNUEiLz48L3N2Zz4=',
              width: 30,
              height: 30,
              opacity: 0.8
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
.light-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
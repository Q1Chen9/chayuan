<template>
  <div class="tea-variety">
    <div class="chart-container">
      <div class="chart-wrapper" ref="chartEl"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TeaVariety',
  data() {
    return {
      chart: null,
      
      varietyData: [
        { value: 42, name: '龙井43号', itemStyle: { color: '#23fdc0' } },
        { value: 26, name: '龙井群体种', itemStyle: { color: '#47C8FF' } },
        { value: 18, name: '龙井长叶', itemStyle: { color: '#5A66FF' } },
        { value: 14, name: '其他品种', itemStyle: { color: '#A66CFF' } }
      ],
      
      ageData: [
        { value: 15, name: '3年以下', itemStyle: { color: '#FFBA5A' } },
        { value: 38, name: '3-10年', itemStyle: { color: '#23fdc0' } },
        { value: 32, name: '10-20年', itemStyle: { color: '#47C8FF' } },
        { value: 15, name: '20年以上', itemStyle: { color: '#5A66FF' } }
      ]
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
      this.$nextTick(() => {
        this.chart = echarts.init(this.$refs.chartEl);
        
        // 准备数据
        const varietyNames = this.varietyData.map(item => item.name);
        const varietyValues = this.varietyData.map(item => item.value);
        const varietyColors = this.varietyData.map(item => item.itemStyle.color);
        
        const ageNames = this.ageData.map(item => item.name);
        const ageValues = this.ageData.map(item => item.value);
        const ageColors = this.ageData.map(item => item.itemStyle.color);
        
        const option = {
          backgroundColor: 'transparent',
          grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            top: '5%',
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function(params) {
              // 只显示当前悬停的项目
              if (params.value === '-') return '';
              
              const categoryName = params.seriesIndex < 4 ? '茶叶品种' : '茶树茶龄';
              
              return `<div style="font-size:12px;">
                <div style="margin-bottom:5px;"><b>${categoryName}</b></div>
                <div style="display:flex;align-items:center;">
                  <span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:${params.color};margin-right:5px;"></span>
                  <span>${params.seriesName}: ${params.value}%</span>
                </div>
              </div>`;
            }
          },
          xAxis: {
            type: 'value',
            max: 100,
            axisLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.2)'
              }
            },
            axisLabel: {
              color: 'rgba(213, 241, 248, 0.6)',
              fontSize: 10,
              formatter: '{value}%'
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.1)'
              }
            }
          },
          yAxis: [
            {
              type: 'category',
              data: ['茶叶品种', '茶树茶龄'],
              axisLine: {
                lineStyle: {
                  color: 'rgba(213, 241, 248, 0.2)'
                }
              },
              axisLabel: {
                color: 'rgba(213, 241, 248, 0.9)',
                fontSize: 12
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '龙井43号',
              type: 'bar',
              stack: '茶叶品种',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: [varietyValues[0], '-'],
              itemStyle: {
                color: varietyColors[0]
              },
              label: {
                show: varietyValues[0] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '龙井群体种',
              type: 'bar',
              stack: '茶叶品种',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: [varietyValues[1], '-'],
              itemStyle: {
                color: varietyColors[1]
              },
              label: {
                show: varietyValues[1] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '龙井长叶',
              type: 'bar',
              stack: '茶叶品种',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: [varietyValues[2], '-'],
              itemStyle: {
                color: varietyColors[2]
              },
              label: {
                show: varietyValues[2] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '其他品种',
              type: 'bar',
              stack: '茶叶品种',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: [varietyValues[3], '-'],
              itemStyle: {
                color: varietyColors[3]
              },
              label: {
                show: varietyValues[3] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '3年以下',
              type: 'bar',
              stack: '茶树茶龄',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: ['-', ageValues[0]],
              itemStyle: {
                color: ageColors[0]
              },
              label: {
                show: ageValues[0] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '3-10年',
              type: 'bar',
              stack: '茶树茶龄',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: ['-', ageValues[1]],
              itemStyle: {
                color: ageColors[1]
              },
              label: {
                show: ageValues[1] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '10-20年',
              type: 'bar',
              stack: '茶树茶龄',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: ['-', ageValues[2]],
              itemStyle: {
                color: ageColors[2]
              },
              label: {
                show: ageValues[2] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            },
            {
              name: '20年以上',
              type: 'bar',
              stack: '茶树茶龄',
              emphasis: {
                focus: 'self',
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              data: ['-', ageValues[3]],
              itemStyle: {
                color: ageColors[3]
              },
              label: {
                show: ageValues[3] > 5,
                position: 'inside',
                formatter: '{c}%',
                fontSize: 10,
                color: '#fff'
              }
            }
          ]
        };
        
        this.chart.setOption(option);
      });
    },
    resizeChart() {
      this.chart && this.chart.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-variety {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    
    .chart-wrapper {
      flex: 1;
      width: 100%;
    }
  }
}
</style> 
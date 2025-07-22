<template>
  <div class="tea-channels">
    <div class="chart-container">
      <div class="chart-wrapper" ref="chartEl"></div>
    </div>
    
    <div class="legend-list">
      <div class="legend-item" v-for="(item, index) in channelData" :key="index">
        <div class="legend-color" :style="{ background: item.itemStyle.color }"></div>
        <div class="legend-name">{{ item.name }} {{ item.value }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TeaChannels',
  data() {
    return {
      chart: null,
      channelData: [
        { 
          name: '淘宝', 
          value: 38, 
          icon: 'fas fa-shopping-bag',
          trend: 4.5,
          itemStyle: { color: '#FF5370' } 
        },
        { 
          name: '京东', 
          value: 26, 
          icon: 'fas fa-shopping-cart',
          trend: 2.8,
          itemStyle: { color: '#47C8FF' } 
        },
        { 
          name: '小红书', 
          value: 15, 
          icon: 'fas fa-book',
          trend: 7.2,
          itemStyle: { color: '#23fdc0' } 
        },
        { 
          name: '拼多多', 
          value: 12, 
          icon: 'fas fa-tags',
          trend: 5.6,
          itemStyle: { color: '#FFBA5A' } 
        },
        { 
          name: '其他', 
          value: 9, 
          icon: 'fas fa-shop',
          trend: -1.2,
          itemStyle: { color: '#A66CFF' } 
        }
      ],
      months: ['2025/03', '2025/02', '2025/01', '2024/12', '2024/11', '2024/10']
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
      this.chart = echarts.init(this.$refs.chartEl);
      
      // 生成模拟的历史数据
      const generateHistoryData = (baseValue, volatility) => {
        return this.months.map(() => {
          // 在基础值附近随机波动，但确保总和接近100%
          const randomChange = (Math.random() - 0.5) * volatility;
          return Math.max(1, baseValue + randomChange);
        });
      };
      
      // 为每个渠道生成历史数据
      const seriesData = this.channelData.map(channel => {
        return {
          name: channel.name,
          type: 'line',
          stack: '渠道占比',
          symbol: 'none',
          smooth: true,
          lineStyle: {
            width: 0
          },
          areaStyle: {
            color: channel.itemStyle.color,
            opacity: 0.8
          },
          emphasis: {
            focus: 'series',
            areaStyle: {
              opacity: 0.9
            }
          },
          data: generateHistoryData(channel.value, 4)
        };
      });
      
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            let result = params[0].axisValueLabel + '<br/>';
            let sum = 0;
            
            // 计算总和并添加每个系列的数据
            params.forEach(param => {
              sum += param.data;
            });
            
            // 按照从大到小排序
            params.sort((a, b) => b.data - a.data);
            
            params.forEach(param => {
              const percentage = ((param.data / sum) * 100).toFixed(1);
              const color = param.color;
              result += `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${color};"></span>`;
              result += `${param.seriesName}: ${percentage}%<br/>`;
            });
            
            return result;
          }
        },
        legend: {
          show: false
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.months,
          axisLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.2)'
            }
          },
          axisLabel: {
            color: 'rgba(213, 241, 248, 0.6)',
            fontSize: 10
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(213, 241, 248, 0.1)'
            }
          },
          axisLabel: {
            color: 'rgba(213, 241, 248, 0.6)',
            fontSize: 10,
            formatter: '{value}%'
          }
        },
        series: seriesData
      };
      
      this.chart.setOption(option);
    },
    resizeChart() {
      this.chart && this.chart.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-channels {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 6px;
  
  .chart-container {
    width: 75%;
    height: 100%;
    
    .chart-wrapper {
      width: 100%;
      height: 100%;
    }
  }
  
  .legend-list {
    width: 25%;
    height: 100%;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .legend-item {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .legend-color {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        margin-right: 4px;
        flex-shrink: 0;
      }
      
      .legend-name {
        font-size: 9px;
        color: rgba(213, 241, 248, 0.8);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style> 
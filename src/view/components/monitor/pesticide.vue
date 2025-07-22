<template>
  <div class="pesticide-chart">
    <div class="chart-container">
      <div class="chart" ref="chartEl"></div>
      <div class="center-info">
        <div class="info-label">环保型占比</div>
        <div class="info-value">45%</div>
      </div>
    </div>
    
    <div class="data-info">
      <div class="data-list">
        <div 
          v-for="(item, index) in pesticideData" 
          :key="index"
          class="data-item"
        >
          <div class="item-color" :style="{ background: item.itemStyle.color }"></div>
          <div class="item-name">{{ item.name }}</div>
          <div class="item-value">{{ item.value }}%</div>
        </div>
      </div>
      
      <div class="data-summary">
        <div class="summary-item">
          <div class="summary-label">同比上月</div>
          <div class="summary-value up">
            <i class="iconfont icon-up"></i>
            <span>5.7%</span>
          </div>
        </div>
        <div class="suggestion">环保型农药使用比例合理</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MonitorPesticide',
  data() {
    return {
      chart: null,
      pesticideData: [
        { value: 30, name: '杀虫剂', itemStyle: { color: '#FF5370' } },
        { value: 25, name: '杀菌剂', itemStyle: { color: '#FFBA5A' } },
        { value: 20, name: '除草剂', itemStyle: { color: '#47C8FF' } },
        { value: 15, name: '调节剂', itemStyle: { color: '#A66CFF' } },
        { value: 10, name: '其他', itemStyle: { color: '#23fdc0' } }
      ]
    };
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
          trigger: 'item',
          formatter: '{b}: {c}%',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '农药使用',
            type: 'pie',
            radius: ['45%', '80%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
            data: this.pesticideData,
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDuration: 800,
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      this.chart.setOption(option);
    }
  }
};
</script>

<style lang="scss" scoped>
.pesticide-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  
  .chart-container {
    flex: 1;
    position: relative;
    
    .chart {
      width: 100%;
      height: 100%;
    }
    
    .center-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      
      .info-label {
        font-size: 12px;
        color: rgba(213, 241, 248, 0.7);
        margin-bottom: 4px;
      }
      
      .info-value {
        font-size: 32px;
        font-weight: 600;
        color: #23fdc0;
        text-shadow: 0 0 10px rgba(35, 253, 192, 0.3);
      }
    }
  }
  
  .data-info {
    width: 40%;
    padding: 12px;
    display: flex;
    flex-direction: column;
    border-left: 1px dashed rgba(71, 200, 255, 0.2);
    
    .data-list {
      margin-bottom: 15px;
      
      .data-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .item-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          margin-right: 8px;
        }
        
        .item-name {
          flex: 1;
          font-size: 13px;
          color: rgba(213, 241, 248, 0.8);
        }
        
        .item-value {
          font-size: 13px;
          font-weight: 500;
          color: #d5f1f8;
        }
      }
    }
    
    .data-summary {
      margin-top: auto;
      border-top: 1px dashed rgba(71, 200, 255, 0.2);
      padding-top: 10px;
      
      .summary-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        
        .summary-label {
          font-size: 12px;
          color: rgba(213, 241, 248, 0.6);
        }
        
        .summary-value {
          display: flex;
          align-items: center;
          
          &.up {
            color: #FF5370;
          }
          
          &.down {
            color: #23fdc0;
          }
          
          i {
            font-size: 14px;
            margin-right: 3px;
          }
          
          span {
            font-size: 14px;
            font-weight: 600;
          }
        }
      }
      
      .suggestion {
        font-size: 12px;
        color: #FFBA5A;
      }
    }
  }
}

@font-face {
  font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_2952240_0hf6c1bkzgw.woff2') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-up:before {
  content: "\e75c";
}

.icon-down:before {
  content: "\e75e";
}
</style> 
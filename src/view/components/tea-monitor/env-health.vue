<template>
  <div class="env-health">
    <div class="left-column">
      <div class="gauge-container" ref="gaugeContainer">
        <!-- ECharts半圆仪表盘将在这里渲染 -->
      </div>
      <div class="score-text">
        <div class="score-value">88</div>
        <div class="score-label">整体健康分</div>
      </div>
    </div>
    
    <div class="right-column">
      <div class="health-card environment">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-leaf"></i>
          </div>
          <div class="card-title">环境健康分</div>
          <div class="card-score">92</div>
        </div>
        <div class="card-chart">
          <div class="chart-item" v-for="(item, index) in environmentData" :key="'env-'+index">
            <div class="item-label">{{ item.name }}</div>
            <div class="item-bar">
              <div class="bar-bg"></div>
              <div class="bar-value" :style="{ width: item.value + '%', background: getBarColor(item.value) }"></div>
            </div>
            <div class="item-value">{{ item.value }}%</div>
          </div>
        </div>
      </div>
      
      <div class="health-card production">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-seedling"></i>
          </div>
          <div class="card-title">生产健康分</div>
          <div class="card-score">85</div>
        </div>
        <div class="card-chart">
          <div class="chart-item" v-for="(item, index) in productionData" :key="'prod-'+index">
            <div class="item-label">{{ item.name }}</div>
            <div class="item-bar">
              <div class="bar-bg"></div>
              <div class="bar-value" :style="{ width: item.value + '%', background: getBarColor(item.value) }"></div>
            </div>
            <div class="item-value">{{ item.value }}%</div>
          </div>
        </div>
      </div>
      
      <div class="health-card sales">
        <div class="card-header">
          <div class="card-icon">
            <i class="fas fa-sack-dollar"></i>
          </div>
          <div class="card-title">销售健康分</div>
          <div class="card-score">86</div>
        </div>
        <div class="card-chart">
          <div class="chart-item" v-for="(item, index) in salesData" :key="'sales-'+index">
            <div class="item-label">{{ item.name }}</div>
            <div class="item-bar">
              <div class="bar-bg"></div>
              <div class="bar-value" :style="{ width: item.value + '%', background: getBarColor(item.value) }"></div>
            </div>
            <div class="item-value">{{ item.value }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'EnvHealth',
  data() {
    return {
      gaugeChart: null,
      overallScore: 88,
      environmentData: [
        { name: '气候适宜度', value: 95 },
        { name: '土壤健康度', value: 88 }
      ],
      productionData: [
        { name: '生产效率', value: 78 },
        { name: '品质合格率', value: 92 }
      ],
      salesData: [
        { name: '销售增长率', value: 82 },
        { name: '客户满意度', value: 90 }
      ]
    }
  },
  mounted() {
    this.initGaugeChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.gaugeChart) {
      this.gaugeChart.dispose();
      this.gaugeChart = null;
    }
  },
  methods: {
    initGaugeChart() {
      this.$nextTick(() => {
        this.gaugeChart = echarts.init(this.$refs.gaugeContainer);
        
        const option = {
          backgroundColor: 'transparent',
          series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            radius: '95%',
            center: ['50%', '75%'],
            progress: {
              show: true,
              width: 15,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#23fdc0'
                  }, {
                    offset: 1, color: '#47C8FF'
                  }]
                }
              }
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 15,
                color: [[1, 'rgba(71, 200, 255, 0.1)']]
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            detail: {
              show: false
            },
            data: [{
              value: this.overallScore
            }],
            title: {
              show: false
            },
            anchor: {
              show: false
            }
          }]
        };
        
        this.gaugeChart.setOption(option);
      });
    },
    resizeChart() {
      this.gaugeChart && this.gaugeChart.resize();
    },
    getBarColor(value) {
      if (value >= 90) {
        return 'linear-gradient(90deg, #23fdc0, #47C8FF)';
      } else if (value >= 80) {
        return 'linear-gradient(90deg, #47C8FF, #5A66FF)';
      } else if (value >= 70) {
        return 'linear-gradient(90deg, #5A66FF, #A66CFF)';
      } else if (value >= 60) {
        return 'linear-gradient(90deg, #FFBA5A, #FFE45A)';
      } else {
        return 'linear-gradient(90deg, #FF5370, #ff8f70)';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.env-health {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  
  .left-column {
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-right: 1px solid rgba(71, 200, 255, 0.2);
    position: relative;
    
    .gauge-container {
      width: 180px;
      height: 100px;
      margin-bottom: 8px;
    }
    
    .score-text {
      text-align: center;
      margin-top: -20px;
      
      .score-value {
        font-size: 48px;
        font-weight: 700;
        line-height: 1;
        background: linear-gradient(to bottom, #23fdc0, #00e1ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 10px rgba(35, 253, 192, 0.3);
      }
      
      .score-label {
        font-size: 16px;
        color: rgba(213, 241, 248, 0.9);
        margin-top: 5px;
      }
    }
  }
  
  .right-column {
    width: 60%;
    height: 96%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .health-card {
      background: rgba(6, 30, 65, 0.3);
      border-radius: 10px;
      padding: 12px;
      border: 1px solid rgba(71, 200, 255, 0.15);
      box-shadow: 0 0 15px rgba(35, 253, 192, 0.05);
      transition: all 0.3s ease;
      height: calc(33% - 14px);
      margin-bottom: 10px;
      
      &:hover {
        box-shadow: 0 0 20px rgba(35, 253, 192, 0.1);
        border-color: rgba(71, 200, 255, 0.25);
      }
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .card-header {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        .card-icon {
          width: 32px;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 8px;
          margin-right: 10px;
          
          i {
            font-size: 16px;
          }
        }
        
        .card-title {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #d5f1f8;
        }
        
        .card-score {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(to bottom, #23fdc0, #00e1ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(35, 253, 192, 0.3);
        }
      }
      
      .card-chart {
        .chart-item {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .item-label {
            width: 70px;
            font-size: 12px;
            color: rgba(213, 241, 248, 0.8);
          }
          
          .item-bar {
            flex: 1;
            position: relative;
            height: 6px;
            margin: 0 8px;
            
            .bar-bg {
              position: absolute;
              width: 100%;
              height: 100%;
              background: rgba(213, 241, 248, 0.1);
              border-radius: 3px;
            }
            
            .bar-value {
              position: absolute;
              height: 100%;
              border-radius: 3px;
              transition: width 1s ease;
            }
          }
          
          .item-value {
            width: 36px;
            font-size: 12px;
            font-weight: 600;
            color: #d5f1f8;
            text-align: right;
          }
        }
      }
      
      &.environment {
        .card-icon {
          background: rgba(35, 253, 192, 0.1);
          
          i {
            color: #23fdc0;
          }
        }
      }
      
      &.production {
        .card-icon {
          background: rgba(71, 200, 255, 0.1);
          
          i {
            color: #47C8FF;
          }
        }
      }
      
      &.sales {
        .card-icon {
          background: rgba(166, 108, 255, 0.1);
          
          i {
            color: #A66CFF;
          }
        }
      }
    }
  }
}
</style> 
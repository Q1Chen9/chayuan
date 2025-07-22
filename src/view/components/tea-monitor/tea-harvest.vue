<template>
  <div class="tea-harvest">
    <div class="summary-section">
      <div class="summary-item production">
        <div class="summary-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="summary-content">
          <div class="summary-label">今日产量</div>
          <div class="summary-value">290 kg</div>
        </div>
      </div>
      
      <div class="summary-item growth">
        <div class="summary-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="summary-content">
          <div class="summary-label">同比增长</div>
          <div class="summary-value up">+12.5%</div>
        </div>
      </div>
      
      <div class="summary-item shipping">
        <div class="summary-icon">
          <i class="fas fa-truck-fast"></i>
        </div>
        <div class="summary-content">
          <div class="summary-label">发货准备</div>
          <div class="summary-value">350 盒</div>
        </div>
      </div>
    </div>
    
    <div class="process-container">
      <!-- 采摘环节 -->
      <div class="process-step">
        <div class="step-icon-container">
          <div class="step-icon">
            <i class="fas fa-leaf"></i>
          </div>
          <div class="progress-ring" ref="harvestRing">
            <!-- ECharts环形进度图将在这里渲染 -->
          </div>
        </div>
        
        <div class="step-info">
          <div class="step-title">采摘环节</div>
          
          <div class="step-metrics">
            <div class="metric">
              <div class="metric-label">当日采摘量</div>
              <div class="metric-value">425 kg</div>
            </div>
            <div class="metric">
              <div class="metric-label">目标完成率</div>
              <div class="metric-value highlight">85%</div>
            </div>
            <div class="metric">
              <div class="metric-label">采摘人员</div>
              <div class="metric-value">48 人</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="process-arrow">
        <i class="fas fa-arrow-right"></i>
      </div>
      
      <!-- 生产环节 -->
      <div class="process-step">
        <div class="step-icon-container">
          <div class="step-icon">
            <i class="fas fa-cogs"></i>
          </div>
          <div class="progress-ring" ref="productionRing">
            <!-- ECharts环形进度图将在这里渲染 -->
          </div>
        </div>
        
        <div class="step-info">
          <div class="step-title">生产环节</div>
          
          <div class="step-metrics">
            <div class="metric">
              <div class="metric-label">生产加工量</div>
              <div class="metric-value">380 kg</div>
            </div>
            <div class="metric">
              <div class="metric-label">转化效率</div>
              <div class="metric-value highlight">76%</div>
            </div>
            <div class="metric">
              <div class="metric-label">生产批次</div>
              <div class="metric-value">6 批</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="process-arrow">
        <i class="fas fa-arrow-right"></i>
      </div>
      
      <!-- 包装环节 -->
      <div class="process-step">
        <div class="step-icon-container">
          <div class="step-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="progress-ring" ref="packagingRing">
            <!-- ECharts环形进度图将在这里渲染 -->
          </div>
        </div>
        
        <div class="step-info">
          <div class="step-title">包装环节</div>
          
          <div class="step-metrics">
            <div class="metric">
              <div class="metric-label">包装完成量</div>
              <div class="metric-value">290 kg</div>
            </div>
            <div class="metric">
              <div class="metric-label">包装率</div>
              <div class="metric-value highlight">68%</div>
            </div>
            <div class="metric">
              <div class="metric-label">成品数量</div>
              <div class="metric-value">580 盒</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TeaHarvest',
  data() {
    return {
      harvestChart: null,
      productionChart: null,
      packagingChart: null,
      
      processData: {
        harvest: {
          completion: 85,
          dailyAmount: 425,
          targetCompletion: 85,
          workers: 48
        },
        production: {
          completion: 76,
          processedAmount: 380,
          conversionRate: 76,
          batches: 6
        },
        packaging: {
          completion: 68,
          packagedAmount: 290,
          packagingRate: 68,
          finishedProducts: 580
        }
      },
      
      summary: {
        dailyOutput: 290,
        yearOnYearGrowth: 12.5,
        readyForShipment: 350
      }
    }
  },
  mounted() {
    this.initCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeCharts);
    if (this.harvestChart) {
      this.harvestChart.dispose();
      this.harvestChart = null;
    }
    if (this.productionChart) {
      this.productionChart.dispose();
      this.productionChart = null;
    }
    if (this.packagingChart) {
      this.packagingChart.dispose();
      this.packagingChart = null;
    }
  },
  methods: {
    initCharts() {
      this.$nextTick(() => {
        this.initProcessChart(this.$refs.harvestRing, 'harvestChart', this.processData.harvest.completion);
        this.initProcessChart(this.$refs.productionRing, 'productionChart', this.processData.production.completion);
        this.initProcessChart(this.$refs.packagingRing, 'packagingChart', this.processData.packaging.completion);
      });
    },
    
    initProcessChart(element, chartName, percentage) {
      this[chartName] = echarts.init(element);
      
      const option = {
        backgroundColor: 'transparent',
        series: [
          {
            type: 'pie',
            radius: ['75%', '100%'],
            avoidLabelOverlap: false,
            startAngle: 225,
            endAngle: -45,
            hoverAnimation: false,
            silent: true,
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: percentage,
                name: '已完成',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: this.getGradientByPercentage(percentage)
                  }
                }
              },
              {
                value: 100 - percentage,
                name: '未完成',
                itemStyle: {
                  color: 'rgba(71, 200, 255, 0.1)'
                }
              }
            ]
          }
        ]
      };
      
      this[chartName].setOption(option);
    },
    
    getGradientByPercentage(percentage) {
      if (percentage >= 80) {
        return [
          { offset: 0, color: '#23fdc0' },
          { offset: 1, color: '#47C8FF' }
        ];
      } else if (percentage >= 60) {
        return [
          { offset: 0, color: '#47C8FF' },
          { offset: 1, color: '#5A66FF' }
        ];
      } else if (percentage >= 40) {
        return [
          { offset: 0, color: '#FFBA5A' },
          { offset: 1, color: '#FFE45A' }
        ];
      } else {
        return [
          { offset: 0, color: '#FF5370' },
          { offset: 1, color: '#ff8f70' }
        ];
      }
    },
    
    resizeCharts() {
      this.harvestChart && this.harvestChart.resize();
      this.productionChart && this.productionChart.resize();
      this.packagingChart && this.packagingChart.resize();
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-harvest {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .summary-section {
    display: flex;
    justify-content: space-between;
    padding: 8px 10px;
    border-bottom: 1px solid rgba(71, 200, 255, 0.2);
    margin-bottom: 5px;
    
    .summary-item {
      display: flex;
      align-items: center;
      position: relative;
      
      &.production, &.shipping {
        flex: 1;
      }
      
      &.growth {
        flex: 1;
      }
      
      .summary-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: rgba(35, 253, 192, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
        
        i {
          font-size: 14px;
          color: #23fdc0;
        }
      }
      
      .summary-content {
        .summary-label {
          font-size: 10px;
          color: rgba(213, 241, 248, 0.7);
          margin-bottom: 2px;
        }
        
        .summary-value {
          font-size: 16px;
          font-weight: 700;
          color: #d5f1f8;
          
          &.up {
            color: #23fdc0;
            font-size: 14px;
          }
          
          &.down {
            color: #FF5370;
          }
        }
      }
      
      &.production .summary-icon {
        background: rgba(35, 253, 192, 0.15);
        i { color: #23fdc0; }
      }
      
      &.growth .summary-icon {
        background: rgba(71, 200, 255, 0.15);
        i { color: #47C8FF; }
      }
      
      &.shipping .summary-icon {
        background: rgba(90, 102, 255, 0.15);
        i { color: #5A66FF; }
      }
    }
  }
  
  .process-container {
    display: flex;
    flex: 1;
    padding: 5px 5px;
    justify-content: space-between;
    align-items: center;
    
    .process-step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      
      .step-icon-container {
        position: relative;
        width: 60px;
        height: 60px;
        margin-bottom: 10px;
        
        .step-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(35, 253, 192, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          
          i {
            font-size: 14px;
            color: #23fdc0;
          }
        }
        
        .progress-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
      }
      
      .step-info {
        text-align: center;
        width: 100%;
        
        .step-title {
          font-size: 13px;
          font-weight: 600;
          color: #d5f1f8;
          margin-bottom: 8px;
        }
        
        .step-metrics {
          display: flex;
          flex-direction: column;
          
          .metric {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            padding: 0 5px;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            .metric-label {
              font-size: 10px;
              color: rgba(213, 241, 248, 0.7);
            }
            
            .metric-value {
              font-size: 10px;
              font-weight: 600;
              color: #d5f1f8;
              
              &.highlight {
                color: #23fdc0;
              }
            }
          }
        }
      }
    }
    
    .process-arrow {
      width: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 3px;
      
      i {
        font-size: 12px;
        color: rgba(71, 200, 255, 0.4);
      }
    }
  }
}
</style> 
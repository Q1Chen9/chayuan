<template>
  <div class="agri-chemicals">
    <div class="container">
      <div class="header">
        <div class="title">
          <i class="iconfont icon-chemicals"></i>
          <span>农用化学品使用分析</span>
        </div>
        <div class="tabs">
          <div 
            class="tab" 
            :class="{ active: activeTab === 'fertilizer' }" 
            @click="activeTab = 'fertilizer'"
          >
            肥料使用
          </div>
          <div 
            class="tab" 
            :class="{ active: activeTab === 'pesticide' }" 
            @click="activeTab = 'pesticide'"
          >
            农药使用
          </div>
        </div>
      </div>
      
      <div class="content">
        <div class="chart-container">
          <div class="chart" ref="chartRef"></div>
          <div class="eco-info">
            <div class="eco-title">
              <span>{{ activeTab === 'fertilizer' ? '有机肥' : '环保型' }}占比</span>
            </div>
            <div class="eco-value">
              {{ activeTab === 'fertilizer' ? '25%' : '45%' }}
            </div>
          </div>
        </div>
        
        <div class="info-list">
          <div 
            v-for="(item, index) in activeTab === 'fertilizer' ? fertilizerData : pesticideData" 
            :key="index"
            class="info-item"
          >
            <div class="item-color" :style="{ background: item.itemStyle.color }"></div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-value">{{ item.value }}%</div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <div class="compare">
          <div class="compare-title">同比上月</div>
          <div :class="['compare-value', activeTab === 'fertilizer' ? 'down' : 'up']">
            <i class="iconfont" :class="activeTab === 'fertilizer' ? 'icon-down' : 'icon-up'"></i>
            {{ activeTab === 'fertilizer' ? '8.2%' : '5.7%' }}
          </div>
        </div>
        <div class="suggestion">
          <i class="iconfont icon-suggestion"></i>
          <span>{{ activeTab === 'fertilizer' ? '建议增加有机肥使用比例' : '环保型农药使用比例合理' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MonitorAgriChemicals',
  data() {
    return {
      chart: null,
      activeTab: 'fertilizer',
      fertilizerData: [
        { value: 35, name: '氮肥', itemStyle: { color: '#47C8FF' } },
        { value: 25, name: '磷肥', itemStyle: { color: '#FFBA5A' } },
        { value: 20, name: '钾肥', itemStyle: { color: '#23fdc0' } },
        { value: 15, name: '复合肥', itemStyle: { color: '#5A66FF' } },
        { value: 5, name: '有机肥', itemStyle: { color: '#FF5370' } }
      ],
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
  watch: {
    activeTab() {
      this.updateChart();
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartRef);
      this.updateChart();
    },
    resizeChart() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    updateChart() {
      if (!this.chart) return;
      
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
            name: this.activeTab === 'fertilizer' ? '肥料使用' : '农药使用',
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
            data: this.activeTab === 'fertilizer' ? this.fertilizerData : this.pesticideData,
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDuration: 800,
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
      
      this.chart.setOption(option, true);
    }
  }
};
</script>

<style lang="scss" scoped>
.agri-chemicals {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .container {
    width: 100%;
    height: 100%;
    background: rgba(6, 30, 65, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(71, 200, 255, 0.3);
    box-shadow: 0 0 15px rgba(35, 253, 192, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      border-bottom: 1px solid rgba(71, 200, 255, 0.2);
      background: rgba(6, 30, 65, 0.7);
      
      .title {
        display: flex;
        align-items: center;
        
        i {
          font-size: 20px;
          color: #23fdc0;
          margin-right: 8px;
        }
        
        span {
          font-size: 16px;
          font-weight: 500;
          color: #d5f1f8;
        }
      }
      
      .tabs {
        display: flex;
        
        .tab {
          padding: 4px 10px;
          font-size: 12px;
          color: rgba(213, 241, 248, 0.6);
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 8px;
          
          &:hover {
            color: #d5f1f8;
          }
          
          &.active {
            background: rgba(71, 200, 255, 0.2);
            color: #d5f1f8;
          }
        }
      }
    }
    
    .content {
      flex: 1;
      display: flex;
      padding: 15px;
      
      .chart-container {
        flex: 3;
        position: relative;
        
        .chart {
          width: 100%;
          height: 100%;
        }
        
        .eco-info {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          
          .eco-title {
            font-size: 12px;
            color: rgba(213, 241, 248, 0.7);
            margin-bottom: 4px;
          }
          
          .eco-value {
            font-size: 28px;
            font-weight: 600;
            color: #23fdc0;
            text-shadow: 0 0 10px rgba(35, 253, 192, 0.3);
          }
        }
      }
      
      .info-list {
        flex: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 15px;
        
        .info-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .item-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 8px;
          }
          
          .item-name {
            flex: 1;
            font-size: 14px;
            color: rgba(213, 241, 248, 0.8);
          }
          
          .item-value {
            font-size: 14px;
            font-weight: 500;
            color: #d5f1f8;
          }
        }
      }
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      background: rgba(6, 30, 65, 0.7);
      border-top: 1px solid rgba(71, 200, 255, 0.2);
      
      .compare {
        display: flex;
        flex-direction: column;
        
        .compare-title {
          font-size: 12px;
          color: rgba(213, 241, 248, 0.6);
          margin-bottom: 4px;
        }
        
        .compare-value {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          
          &.up {
            color: #FF5370;
          }
          
          &.down {
            color: #23fdc0;
          }
          
          i {
            margin-right: 4px;
            font-size: 12px;
          }
        }
      }
      
      .suggestion {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: rgba(213, 241, 248, 0.7);
        
        i {
          color: #FFBA5A;
          margin-right: 5px;
          font-size: 14px;
        }
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

.icon-chemicals:before {
  content: "\e6a3";
}

.icon-suggestion:before {
  content: "\e6c7";
}

.icon-up:before {
  content: "\e75c";
}

.icon-down:before {
  content: "\e75e";
}
</style> 
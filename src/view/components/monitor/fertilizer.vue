<template>
  <div class="fertilizer-chart">
    <div class="chart-container">
      <div class="chart" ref="chartEl"></div>
      <div class="center-info">
        <div class="info-label">有机肥占比</div>
        <div class="info-value">{{ organicFertilizerPercentage }}%</div>
      </div>
    </div>
    
    <div class="data-info">
      <div class="data-list">
        <div 
          v-for="(item, index) in fertilizerData" 
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
          <div class="summary-value" :class="trend.class">
            <i class="iconfont" :class="trend.icon"></i>
            <span>{{ trend.value }}%</span>
          </div>
        </div>
        <div class="suggestion">{{ suggestion }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import * as echarts from 'echarts';

const chart = ref(null);
const fertilizerData = ref([
  { value: 35, name: '氮肥', itemStyle: { color: '#47C8FF' } },
  { value: 25, name: '磷肥', itemStyle: { color: '#FFBA5A' } },
  { value: 20, name: '钾肥', itemStyle: { color: '#23fdc0' } },
  { value: 15, name: '复合肥', itemStyle: { color: '#5A66FF' } },
  { value: 5, name: '有机肥', itemStyle: { color: '#FF5370' } }
]);
const trend = ref({
  value: 8.2,
  class: 'down',
  icon: 'icon-down'
});

const organicFertilizerPercentage = computed(() => {
  const organic = fertilizerData.value.find(f => f.name === '有机肥');
  return organic ? organic.value : 0;
});

const suggestion = computed(() => {
    return organicFertilizerPercentage.value < 10 ? '建议增加有机肥施用比例' : '有机肥施用比例良好';
});

let dataTimer = null;

const initChart = () => {
  const chartDom = document.querySelector('.fertilizer-chart .chart');
  if (chartDom) {
    chart.value = echarts.init(chartDom);
    updateChart();
  }
};

const resizeChart = () => {
  if (chart.value) {
    chart.value.resize();
  }
};

const updateData = () => {
    let totalValue = 100;
    const changes = fertilizerData.value.map(() => (Math.random() - 0.5) * 2);
    let newValues = fertilizerData.value.map((item, index) => item.value + changes[index]);

    const currentTotal = newValues.reduce((sum, v) => sum + v, 0);
    newValues = newValues.map(v => Math.max(5, (v / currentTotal) * totalValue));

    const finalTotal = newValues.reduce((sum, v) => sum + v, 0);
    const correction = totalValue / finalTotal;
    fertilizerData.value.forEach((item, index) => {
        item.value = parseFloat((newValues[index] * correction).toFixed(1));
    });

    const trendChange = (Math.random() - 0.5) * 2;
    let newTrend = parseFloat(trend.value) + trendChange;
    newTrend = Math.max(0, Math.min(15, newTrend));
    trend.value = newTrend.toFixed(1);
    trend.class = trendChange > 0 ? 'up' : 'down';
    trend.icon = trendChange > 0 ? 'icon-up' : 'icon-down';
    
    updateChart();
};

const updateChart = () => {
  if (!chart.value) return;
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
        name: '肥料使用',
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
        data: fertilizerData.value,
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 800
      }
    ]
  };
  chart.value.setOption(option);
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
  dataTimer = setInterval(updateData, 3000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  if (dataTimer) clearInterval(dataTimer);
  if (chart.value) {
    chart.value.dispose();
    chart.value = null;
  }
});

</script>

<style lang="scss" scoped>
.fertilizer-chart {
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
        color: #FF5370;
        text-shadow: 0 0 10px rgba(255, 83, 112, 0.3);
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
<template>
  <div class="region-distribution">
    <div class="left-section">
      <div class="title">省份销量排行</div>
      <div class="ranking-list">
        <div class="ranking-item" v-for="(item, index) in regionData" :key="index">
          <div class="rank" :class="{'top-rank': index < 3}">{{ index + 1 }}</div>
          <div class="region-name">{{ item.name }}</div>
          <div class="sales-value">{{ item.value }}单</div>
          <div class="sales-bar">
            <div class="bar-inner" :style="{ width: (item.value / regionData[0].value * 100) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-section">
      <div ref="chartContainer" class="chart-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);
let chart = null;

// 区域销量数据
const regionData = ref([
  { name: '浙江省', value: 3865 },
  { name: '江苏省', value: 2472 },
  { name: '上海市', value: 1958 },
  { name: '广东省', value: 1247 },
  { name: '北京市', value: 876 },
  { name: '福建省', value: 612 },
  { name: '安徽省', value: 528 },
  { name: '四川省', value: 385 },
  { name: '湖北省', value: 253 },
  { name: '山东省', value: 189 }
].sort((a, b) => b.value - a.value));

const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = echarts.init(chartContainer.value);
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}单 ({d}%)',
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 10,
      extraCssText: 'border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '省份占比',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
            color: '#fff'
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
        data: regionData.value.map((item, index) => {
          const colors = [
            '#37A2FF', '#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C',
            '#ff9f7f', '#fb7293', '#E062AE', '#7A6ADE', '#6A93EA'
          ];
          return {
            value: item.value,
            name: item.name,
            itemStyle: {
              color: colors[index % colors.length]
            }
          };
        })
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应式调整大小
  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chart && chart.resize();
};

onMounted(() => {
  initChart();
});

onBeforeUnmount(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.region-distribution {
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(8, 35, 43, 0.7);
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  
  .left-section {
    width: 55%;
    padding-right: 15px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #34ebd8;
    }
    
    .ranking-list {
      height: calc(100% - 30px);
      overflow-y: auto;
      
      &::-webkit-scrollbar {
        width: 5px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2.5px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2.5px;
      }
      
      .ranking-item {
        display: flex;
        align-items: center;
        padding: 8px 5px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        
        &:last-child {
          border-bottom: none;
        }
        
        .rank {
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 12px;
          font-weight: bold;
          margin-right: 10px;
          
          &.top-rank {
            background: linear-gradient(to right, #43e97b, #38f9d7);
            color: #000;
          }
        }
        
        .region-name {
          width: 60px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          margin-right: 10px;
        }
        
        .sales-value {
          width: 60px;
          font-size: 14px;
          color: #34ebd8;
          margin-right: 10px;
          text-align: right;
        }
        
        .sales-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          
          .bar-inner {
            height: 100%;
            background: linear-gradient(to right, #43e97b, #38f9d7);
            border-radius: 3px;
          }
        }
      }
    }
  }
  
  .right-section {
    width: 45%;
    
    .chart-container {
      width: 100%;
      height: 100%;
    }
  }
}
</style> 
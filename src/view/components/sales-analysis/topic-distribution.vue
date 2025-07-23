<template>
  <div class="topic-distribution">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);
let chart = null;
let dataTimer = null;

const topicData = ref([
  { name: '小红书', value: 28.5, color: '#ff2e4d' },
  { name: '微博', value: 22.3, color: '#ff9933' },
  { name: '知乎', value: 17.6, color: '#0084ff' },
  { name: '淘宝', value: 12.8, color: '#ff6a00' },
  { name: '抖音', value: 10.4, color: '#000000' },
  { name: '京东', value: 5.3, color: '#d71c1e' },
  { name: '拼多多', value: 3.1, color: '#e22e59' },
]);

const updateData = () => {
  let totalValue = 100;
  const changes = topicData.value.map(() => (Math.random() - 0.5) * 1);
  let newValues = topicData.value.map((item, index) => item.value + changes[index]);

  const currentTotal = newValues.reduce((sum, v) => sum + v, 0);
  newValues = newValues.map(v => Math.max(2, (v / currentTotal) * totalValue));
  
  const finalTotal = newValues.reduce((sum, v) => sum + v, 0);
  const correction = totalValue / finalTotal;
  
  topicData.value.forEach((item, index) => {
    item.value = parseFloat((newValues[index] * correction).toFixed(1));
  });

  if (chart) {
    chart.setOption({
      legend: {
        formatter: function(name) {
          const item = topicData.value.find(item => item.name === name);
          return `${name} ${item.value.toFixed(0)}%`;
        }
      },
      series: [{
        data: topicData.value.map(item => ({
          value: item.value,
          name: item.name
        }))
      }]
    });
  }
};

const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = echarts.init(chartContainer.value);
  
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '',
      textStyle: {
        color: '#34ebd8',
        fontSize: 16,
        fontWeight: 'bold'
      },
      left: 'center',
      top: '5%'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params) => `${params.name}: ${params.value.toFixed(0)}% (${params.percent.toFixed(0)}%)`,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 10,
      extraCssText: 'border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);'
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10,
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12
      },
      formatter: function(name) {
        const item = topicData.value.find(item => item.name === name);
        return `${name} ${item.value.toFixed(0)}%`;
      }
    },
    series: [
      {
        name: '话题占比',
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2
        },
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            formatter: (params) => `${params.name}: ${params.value.toFixed(0)}%`
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
        data: topicData.value.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        }))
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
  dataTimer = setInterval(updateData, 2200);
});

onBeforeUnmount(() => {
  if (dataTimer) clearInterval(dataTimer);
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.topic-distribution {
  width: 100%;
  height: 100%;
  background: rgba(8, 35, 43, 0.7);
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style> 
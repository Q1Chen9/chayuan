<template>
  <div class="sales-comparison">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);
let chart = null;

// 各品牌销量数据
const brandsData = [
  { name: '西湖龙井', sales: 12385, highlight: true },
  { name: '狮峰龙井', sales: 8745, highlight: false },
  { name: '梅家坞龙井', sales: 7862, highlight: false },
  { name: '五云龙井', sales: 5438, highlight: false },
  { name: '虎跑龙井', sales: 4765, highlight: false },
  { name: '龙坞龙井', sales: 3280, highlight: false }
];

const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = echarts.init(chartContainer.value);
  
  // 排序从高到低
  const sortedData = [...brandsData].sort((a, b) => b.sales - a.sales);
  
  // 为不同品牌设置不同颜色
  const brandColors = [
    ['#43e97b', '#38f9d7'], // 西湖龙井 - 绿色渐变
    ['#6a82fb', '#8c9eff'], // 狮峰龙井 - 蓝色渐变
    ['#fa709a', '#fee140'], // 梅家坞龙井 - 粉红到黄色渐变
    ['#30cfd0', '#330867'], // 五云龙井 - 青色到深蓝渐变
    ['#a18cd1', '#fbc2eb'], // 虎跑龙井 - 紫色到粉色渐变
    ['#4facfe', '#00f2fe']  // 龙坞龙井 - 蓝色到青色渐变
  ];
  
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '8%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        const data = params[0];
        return `<div style="font-size:14px;color:#fff;font-weight:bold;margin-bottom:5px">${data.name}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.7)">
                销量: ${data.value}单
                </div>`;
      },
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 10,
      extraCssText: 'border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);'
    },
    xAxis: {
      type: 'category',
      data: sortedData.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        interval: 0,
        rotate: 30,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '销量',
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        padding: [0, 0, 0, -5] // 减少名称占用空间
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10,
        formatter: function(value) {
          return (value / 1000).toFixed(1) + 'k';
        }
      }
    },
    series: [{
      name: '销量',
      type: 'bar',
      barWidth: '60%',
      data: sortedData.map((item, index) => ({
        value: item.sales,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: brandColors[index][0] },
            { offset: 1, color: brandColors[index][1] }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(' + brandColors[index][0].replace(/[^\d,]/g, '') + ', 0.5)'
          }
        }
      }))
    }]
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
.sales-comparison {
  width: 100%;
  height: 100%;
  
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style> 
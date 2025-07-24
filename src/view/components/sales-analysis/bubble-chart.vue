<template>
  <div class="bubble-chart">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const chartContainer = ref(null);
let chart = null;
let dataTimer = null;

const salesData = ref([
  { platform: '淘宝', unitPrice: 98, sales: 6854, repurchaseRate: 34.8 },
  { platform: '京东', unitPrice: 108, sales: 3965, repurchaseRate: 30.5 },
  { platform: '拼多多', unitPrice: 86, sales: 1566, repurchaseRate: 26.3 },
  { platform: '天猫', unitPrice: 102, sales: 5230, repurchaseRate: 33.2 },
  { platform: '抖音', unitPrice: 93, sales: 2840, repurchaseRate: 28.6 },
  { platform: '微信小程序', unitPrice: 95, sales: 1960, repurchaseRate: 29.4 },
  { platform: '线下', unitPrice: 128, sales: 1230, repurchaseRate: 42.5 }
]);

const updateData = () => {
  salesData.value = salesData.value.map(item => {
    const unitPriceChange = (Math.random() - 0.5) * 1;
    const salesChange = (Math.random() - 0.45) * item.sales * 0.02;
    const repurchaseRateChange = (Math.random() - 0.5) * 0.2;

    return {
      ...item,
      unitPrice: Math.max(80, Math.min(130, item.unitPrice + unitPriceChange)),
      sales: Math.max(1000, item.sales + salesChange),
      repurchaseRate: Math.max(20, Math.min(45, item.repurchaseRate + repurchaseRateChange))
    };
  });
  
  chart.setOption({
    series: [{
      data: salesData.value.map(item => ({
        value: [item.unitPrice, item.sales, item.repurchaseRate],
        platform: item.platform,
        unitPrice: item.unitPrice,
        sales: item.sales,
        repurchaseRate: item.repurchaseRate
      }))
    }]
  });
};

const initChart = () => {
  if (!chartContainer.value) return;
  
  chart = echarts.init(chartContainer.value);
  
  const colorMap = {
    '淘宝': '#FF6A00',
    '京东': '#D71C1E',
    '拼多多': '#E22E59',
    '天猫': '#FF0036',
    '抖音': '#000000',
    '微信小程序': '#07C160',
    '线下': '#2B82D4'
  };
  
  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '5%',
      right: '5%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `<div style="font-size:14px;color:#fff;font-weight:bold;margin-bottom:5px">${params.data.platform}</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.7)">
                客单价: ¥${Math.round(params.data.unitPrice)}<br/>
                销量: ${Math.round(params.data.sales)}单<br/>
                复购率: ${Math.round(params.data.repurchaseRate)}%
                </div>`;
      },
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 10,
      extraCssText: 'border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);'
    },
    xAxis: {
      name: '客单价',
      nameLocation: 'middle',
      nameGap: 25,
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12
      },
      type: 'value',
      min: 80,
      max: 130,
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10,
        formatter: '{value}元'
      }
    },
    yAxis: {
      name: '销量',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12
      },
      type: 'value',
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      axisLine: {
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
      name: '渠道销售矩阵',
      type: 'scatter',
      symbolSize: function(data) {
        return data[2] * 1.5;
      },
      itemStyle: {
        color: function(params) {
          return colorMap[params.data.platform];
        },
        opacity: 0.85,
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: {
          opacity: 1,
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(255,255,255,0.5)'
        }
      },
      data: salesData.value.map(item => ({
          value: [item.unitPrice, item.sales, item.repurchaseRate],
          platform: item.platform,
          unitPrice: item.unitPrice,
          sales: item.sales,
          repurchaseRate: item.repurchaseRate
      }))
    }],
    legend: {
      data: Object.keys(colorMap),
      top: '5%',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 10
      },
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 10
    }
  };
  
  chart.setOption(option);
  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chart && chart.resize();
};

onMounted(() => {
  initChart();
  dataTimer = setInterval(updateData, 2500);
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
.bubble-chart {
  width: 100%;
  height: 100%;
  
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style> 
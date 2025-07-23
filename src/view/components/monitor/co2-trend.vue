<template>
  <div class="co2-trend-chart"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const chart = ref(null);
const co2Data = ref({
  dates: [],
  values: [],
  baseline: [],
  warning: []
});

const initChart = () => {
  const chartDom = document.querySelector('.co2-trend-chart');
  if(chartDom) {
    chart.value = echarts.init(chartDom);
    generateInitialData();
    updateChart();
    setInterval(updateData, 3000); // Update every 3 seconds
  }
};

const resizeChart = () => {
  if (chart.value) {
    chart.value.resize();
  }
};

const generateInitialData = () => {
  const now = new Date();
  let dates = [];
  let values = [];
  let lastValue = 420;

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(`${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    lastValue += (Math.random() - 0.45) * 15;
    lastValue = Math.max(380, Math.min(500, lastValue));
    values.push(Math.round(lastValue));
  }
  co2Data.value.dates = dates;
  co2Data.value.values = values;
  co2Data.value.baseline = new Array(7).fill(400);
  co2Data.value.warning = new Array(7).fill(600);
};

const updateData = () => {
  const newDate = new Date();
  const newDateStr = `${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
  
  if (co2Data.value.dates[co2Data.value.dates.length - 1] !== newDateStr) {
    co2Data.value.dates.shift();
    co2Data.value.dates.push(newDateStr);
  }

  let lastValue = co2Data.value.values[co2Data.value.values.length - 1];
  let newValue = lastValue + (Math.random() - 0.45) * 15;
  newValue = Math.max(380, Math.min(500, newValue));

  co2Data.value.values.shift();
  co2Data.value.values.push(Math.round(newValue));
  
  updateChart();
};


const updateChart = () => {
  if (!chart.value) return;
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['二氧化碳浓度', '基准值', '警戒值'],
      textStyle: {
        color: '#d5f1f8'
      },
      right: '10%',
      top: '2%'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: co2Data.value.dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(213, 241, 248, 0.3)'
        }
      },
      axisLabel: {
        color: '#d5f1f8'
      }
    },
    yAxis: {
      type: 'value',
      name: 'ppm',
      nameTextStyle: {
        color: '#d5f1f8'
      },
      min: 350,
      max: 650,
      axisLine: {
        lineStyle: {
          color: 'rgba(213, 241, 248, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(213, 241, 248, 0.1)'
        }
      },
      axisLabel: {
        color: '#d5f1f8'
      }
    },
    series: [
      {
        name: '二氧化碳浓度',
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#5A66FF' },
              { offset: 1, color: '#A66CFF' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#A66CFF',
          borderColor: '#fff',
          borderWidth: 2
        },
        data: co2Data.value.values,
        z: 3,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(90, 102, 255, 0.5)' },
            { offset: 1, color: 'rgba(166, 108, 255, 0.1)' }
          ])
        }
      },
      {
        name: '基准值',
        type: 'line',
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: 'rgba(35, 253, 192, 0.8)'
        },
        symbol: 'none',
        data: co2Data.value.baseline,
        z: 2
      },
      {
        name: '警戒值',
        type: 'line',
        lineStyle: {
          width: 2,
          type: 'dashed',
          color: 'rgba(255, 83, 112, 0.8)'
        },
        symbol: 'none',
        data: co2Data.value.warning,
        z: 1
      },
      {
        name: '区域标记',
        type: 'line',
        markArea: {
          silent: true,
          itemStyle: {
            color: 'rgba(255, 83, 112, 0.05)'
          },
          data: [
            [
              { yAxis: 600 },
              { yAxis: 650 }
            ]
          ]
        },
        z: 0
      }
    ]
  };
  chart.value.setOption(option);
};


onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  if (chart.value) {
    chart.value.dispose();
    chart.value = null;
  }
});
</script>

<style lang="scss" scoped>
.co2-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
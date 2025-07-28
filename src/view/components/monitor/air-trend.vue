<template>
  <div class="air-trend-chart"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  weatherData: {
    type: Object,
    default: null
  }
});

const chart = ref(null);
const airData = ref({
  dates: ['-'],
  aqi: [0]
});

const initChart = () => {
  const chartDom = document.querySelector('.air-trend-chart');
  if(chartDom) {
    chart.value = echarts.init(chartDom);
    updateChart();
  }
};

const resizeChart = () => {
  if (chart.value) {
    chart.value.resize();
  }
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
      data: ['AQI'],
      textStyle: {
        color: '#d5f1f8'
      },
      right: '5%',
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
      data: airData.value.dates,
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
      name: '指数',
      nameTextStyle: {
        color: '#d5f1f8'
      },
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
        name: 'AQI',
        type: 'line',
        smooth: true,
        data: airData.value.aqi,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#47C8FF' },
              { offset: 1, color: '#23fdc0' }
            ]
          }
        },
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(59, 147, 255, 0.4)'
      },
      {
              offset: 1,
              color: 'rgba(74, 222, 222, 0.1)'
            }
          ])
        }
      }
    ]
  };
  chart.value.setOption(option);
};

watch(() => props.weatherData, (newVal) => {
  if (newVal && newVal.air5d && newVal.air5d.daily) {
    const dailyData = newVal.air5d.daily;
    airData.value.dates = dailyData.map(d => dayjs(d.fxDate).format('MM-DD'));
    airData.value.aqi = dailyData.map(d => d.aqi);
      updateChart();
  }
}, { immediate: true, deep: true });

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
.air-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
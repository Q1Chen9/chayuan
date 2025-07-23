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
  aqi: [0],
  pm25: [0],
  pm10: [0]
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
      data: ['AQI', 'PM2.5', 'PM10'],
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
        itemStyle: {
          color: '#47C8FF'
        },
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
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(71, 200, 255, 0.3)' },
              { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
            ]
          }
        }
      },
      {
        name: 'PM2.5',
        type: 'bar',
        data: airData.value.pm25,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(104, 211, 145, 0.8)' },
            { offset: 1, color: 'rgba(104, 211, 145, 0.1)' }
          ])
        }
      },
      {
        name: 'PM10',
        type: 'bar',
        data: airData.value.pm10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 190, 65, 0.8)' },
            { offset: 1, color: 'rgba(255, 190, 65, 0.1)' }
          ])
        }
      }
    ]
  };
  chart.value.setOption(option);
};

watch(() => props.weatherData, (newVal) => {
  if (newVal && newVal.hourly) {
    const hourlyData = newVal.hourly;
    const now = new Date();
    // Correctly find the current or last passed hour index
    const currentIndex = hourlyData.time.findIndex((t, i) => {
        const timePoint = new Date(t);
        const nextTimePoint = hourlyData.time[i+1] ? new Date(hourlyData.time[i+1]) : new Date(timePoint.getTime() + 3600 * 1000);
        return now >= timePoint && now < nextTimePoint;
    }) || hourlyData.time.length -1;
    
    if (currentIndex > -1) {
      const startIndex = Math.max(0, currentIndex - 2);
      const time = hourlyData.time.slice(startIndex, currentIndex + 1).map(t => dayjs(t).format('HH:mm'));
      const windSpeed = hourlyData.wind_speed_10m.slice(startIndex, currentIndex + 1);

      airData.value.dates = time;
      airData.value.aqi = windSpeed.map(ws => Math.max(0, 100 - ws * 5));
      airData.value.pm25 = windSpeed.map(ws => Math.max(0, 50 - ws * 2.5));
      airData.value.pm10 = windSpeed.map(ws => Math.max(0, 80 - ws * 4));

      updateChart();
    }
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
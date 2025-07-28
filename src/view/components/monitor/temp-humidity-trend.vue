<template>
  <div class="temp-humidity-chart"></div>
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
const trendData = ref({
  dates: ['-'],
  temperature: [0],
  humidity: [0]
});

const initChart = () => {
  const chartDom = document.querySelector('.temp-humidity-chart');
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

const updateChart = () => {
  if (!chart.value) return;
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['温度', '湿度'],
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
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
        data: trendData.value.dates,
            axisLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.3)'
              }
            },
            axisLabel: {
              color: '#d5f1f8'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '温度 (°C)',
            min: 0,
            max: 40,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#FF5370'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(213, 241, 248, 0.1)'
              }
            },
            axisLabel: {
              formatter: '{value} °C',
              color: '#FF5370'
            },
            nameTextStyle: {
              color: '#FF5370'
            }
          },
          {
            type: 'value',
            name: '湿度 (%)',
            min: 0,
            max: 100,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#47C8FF'
              }
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: '{value} %',
              color: '#47C8FF'
            },
            nameTextStyle: {
              color: '#47C8FF'
            }
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            lineStyle: {
              width: 3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#FF5370' },
                  { offset: 1, color: '#ff8f70' }
                ]
              }
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#FF5370',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 83, 112, 0.4)' },
                { offset: 1, color: 'rgba(255, 143, 112, 0.1)' }
              ])
            },
        data: trendData.value.temperature
          },
          {
            name: '湿度',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
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
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#47C8FF',
              borderColor: '#fff',
              borderWidth: 2
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(71, 200, 255, 0.4)' },
                { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
              ])
            },
        data: trendData.value.humidity
          }
    ]
  };
  chart.value.setOption(option);
};

watch(() => props.weatherData, (newVal) => {
  if (newVal && newVal.hourly && Array.isArray(newVal.hourly.time) && newVal.hourly.time.length > 0) {
    const hourlyData = newVal.hourly;
    // 直接使用完整的24小时数据
    trendData.value.dates = hourlyData.time.map(t => dayjs(t).format('HH:mm'));
    trendData.value.temperature = hourlyData.temperature_2m;
    trendData.value.humidity = hourlyData.relative_humidity_2m;
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
.temp-humidity-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
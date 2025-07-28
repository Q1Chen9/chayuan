<template>
  <div class="light-trend-chart"></div>
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
const lightData = ref({
  dates: [],
  net: []
});

const initChart = () => {
  const chartDom = document.querySelector('.light-trend-chart');
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
  chart.value.hideLoading();
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          let marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
          let value = param.value + ' W/m²';
          result += marker + param.seriesName + ': ' + value + '<br/>';
        });
        return result;
      }
    },
    legend: {
      data: ['净辐射'],
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
      data: lightData.value.dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(213, 241, 248, 0.3)'
        }
      },
      axisLabel: {
        color: '#d5f1f8'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '净辐射 (W/m²)',
        min: 0,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#FFBA5A'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(213, 241, 248, 0.1)'
          }
        },
        axisLabel: {
          formatter: '{value}',
          color: '#FFBA5A'
        },
        nameTextStyle: {
          color: '#FFBA5A'
        }
      }
    ],
    series: [
      {
        name: '净辐射',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: lightData.value.net,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#FFBA5A' },
              { offset: 1, color: '#FFE45A' }
            ]
          }
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 186, 90, 0.6)' },
            { offset: 1, color: 'rgba(255, 228, 90, 0.2)' }
          ])
        }
      }
    ]
  };
  chart.value.setOption(option, { notMerge: true });
};

const showNoDataMessage = () => {
    if (chart.value) {
        chart.value.showLoading('default', { 
            text: '暂无光照预报数据', 
            color: 'transparent', 
            textColor: '#d5f1f8',
            maskColor: 'rgba(6, 30, 65, 0.5)'
        });
    }
}

watch(() => props.weatherData, (newVal) => {
  if (newVal && newVal.solarRadiation24h && newVal.solarRadiation24h.code === '200' && newVal.solarRadiation24h.radiation) {
    const radiationData = newVal.solarRadiation24h.radiation;
    lightData.value.dates = radiationData.map(r => dayjs(r.fxTime).format('HH:mm'));
    lightData.value.net = radiationData.map(r => r.net);
    updateChart();
  } else {
    showNoDataMessage();
  }
}, { immediate: true, deep: true });

onMounted(() => {
  initChart();
  showNoDataMessage();
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
.light-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
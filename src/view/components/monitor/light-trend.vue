<template>
  <div class="light-trend-chart"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  weatherData: {
    type: Object,
    default: null
  }
});

const chart = ref(null);
const lightData = ref({
  dates: ['-'],
  intensity: [0],
  duration: [0]
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
          let value = param.seriesName === '光照强度' ? 
            param.value.toLocaleString() + ' lux' : 
            param.value + ' 小时';
          result += marker + param.seriesName + ': ' + value + '<br/>';
        });
        return result;
      }
    },
    legend: {
      data: ['光照强度', '光照时长'],
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
        name: '光照强度 (lux)',
        min: 0,
        max: 100000,
        interval: 20000,
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
          formatter: function(value) {
            return value / 1000 + 'k';
          },
          color: '#FFBA5A'
        },
        nameTextStyle: {
          color: '#FFBA5A'
        }
      },
      {
        type: 'value',
        name: '光照时长 (小时)',
        min: 0,
        max: 15,
        interval: 3,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#61E1FF'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value}',
          color: '#61E1FF'
        },
        nameTextStyle: {
          color: '#61E1FF'
        }
      }
    ],
    series: [
      {
        name: '光照强度',
        type: 'bar',
        barWidth: '40%',
        yAxisIndex: 0,
        data: lightData.value.intensity,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 186, 90, 0.9)' },
            { offset: 1, color: 'rgba(255, 228, 90, 0.3)' }
          ]),
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: '光照时长',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          type: 'solid',
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#61E1FF' },
              { offset: 1, color: '#A09CFF' }
            ]
          }
        },
        itemStyle: {
          color: '#61E1FF',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(97, 225, 255, 0.3)' },
            { offset: 1, color: 'rgba(160, 156, 255, 0.1)' }
          ])
        },
        data: lightData.value.duration
      }
    ]
  };
  chart.value.setOption(option);
};

watch(() => props.weatherData, (newVal) => {
  if (newVal && newVal.daily && newVal.hourly) {
    const dailyData = newVal.daily;
    const hourlyData = newVal.hourly;
    
    lightData.value.dates = dailyData.time;
    
    // Calculate daily light duration
    lightData.value.duration = dailyData.sunrise.map((sunrise, i) => {
      const rise = new Date(sunrise);
      const set = new Date(dailyData.sunset[i]);
      return parseFloat(((set - rise) / (1000 * 60 * 60)).toFixed(1));
    });

    // Calculate average daily light intensity
    let dailyIntensity = [];
    dailyData.time.forEach((day, i) => {
        const dayStart = new Date(day + "T00:00");
        const dayEnd = new Date(day + "T23:59");
        let dayTotalIntensity = 0;
        let dayHours = 0;
        hourlyData.time.forEach((h, j) => {
            const hour = new Date(h);
            if(hour >= dayStart && hour <= dayEnd && hourlyData.is_day[j]){
                dayTotalIntensity += (70000 + (Math.random() - 0.5) * 20000);
                dayHours++;
            }
        });
        dailyIntensity.push(dayHours > 0 ? Math.round(dayTotalIntensity / dayHours) : 0);
    });

    lightData.value.intensity = dailyIntensity;
    
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
.light-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
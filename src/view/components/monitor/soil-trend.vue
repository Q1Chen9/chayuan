<template>
  <div class="soil-trend-chart"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const chart = ref(null);
const soilData = ref({
  dates: [],
  temperature: [],
  moisture: []
});

const initChart = () => {
  const chartDom = document.querySelector('.soil-trend-chart');
  if (chartDom) {
    chart.value = echarts.init(chartDom);
    generateInitialData();
    updateChart();
    setInterval(updateData, 3500); // Update every 3.5 seconds
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
  let temps = [];
  let moistures = [];
  let lastTemp = 19.5;
  let lastMoisture = 45;

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(`${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
    
    lastTemp += (Math.random() - 0.5) * 0.5;
    lastTemp = Math.max(18, Math.min(22, lastTemp));
    temps.push(parseFloat(lastTemp.toFixed(1)));

    lastMoisture += (Math.random() - 0.5) * 5;
    lastMoisture = Math.max(30, Math.min(60, lastMoisture));
    moistures.push(Math.round(lastMoisture));
  }
  soilData.value = { dates, temperature: temps, moisture: moistures };
};

const updateData = () => {
  const newDate = new Date();
  const newDateStr = `${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;

  if (soilData.value.dates[soilData.value.dates.length - 1] !== newDateStr) {
    soilData.value.dates.shift();
    soilData.value.dates.push(newDateStr);
  }

  let lastTemp = soilData.value.temperature[soilData.value.temperature.length - 1];
  let newTemp = lastTemp + (Math.random() - 0.5) * 0.5;
  newTemp = Math.max(18, Math.min(22, newTemp));
  
  let lastMoisture = soilData.value.moisture[soilData.value.moisture.length - 1];
  let newMoisture = lastMoisture + (Math.random() - 0.5) * 5;
  newMoisture = Math.max(30, Math.min(60, newMoisture));

  soilData.value.temperature.shift();
  soilData.value.temperature.push(parseFloat(newTemp.toFixed(1)));
  soilData.value.moisture.shift();
  soilData.value.moisture.push(Math.round(newMoisture));
  
  updateChart();
};

const updateChart = () => {
  if (!chart.value) return;
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].name + '<br/>';
        params.forEach(param => {
          if (!param.seriesName) return;
          let marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
          let value = param.seriesName === '土壤温度' ? param.value + ' °C' : param.value + ' %';
          result += marker + param.seriesName + ': ' + value + '<br/>';
        });
        return result;
      }
    },
    legend: {
      data: ['土壤温度', '土壤湿度'],
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
      boundaryGap: false,
      data: soilData.value.dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(213, 241, 248, 0.3)'
        }
      },
      axisLabel: {
        color: '#d5f1f8'
      }
    },
    yAxis: [{
      type: 'value',
      name: '温度 (°C)',
      min: 15,
      max: 25,
      position: 'left',
      axisLine: {
        lineStyle: {
          color: '#A66CFF'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(213, 241, 248, 0.1)'
        }
      },
      axisLabel: {
        formatter: '{value} °C',
        color: '#A66CFF'
      },
      nameTextStyle: {
        color: '#A66CFF'
      }
    }, {
      type: 'value',
      name: '湿度 (%)',
      min: 0,
      max: 100,
      position: 'right',
      axisLine: {
        lineStyle: {
          color: '#23fdc0'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value} %',
        color: '#23fdc0'
      },
      nameTextStyle: {
        color: '#23fdc0'
      }
    }],
    series: [{
      name: '土壤温度',
      type: 'line',
      yAxisIndex: 0,
      symbol: 'circle',
      symbolSize: 8,
      itemStyle: {
        color: '#A66CFF'
      },
      data: soilData.value.temperature,
      lineStyle: {
        width: 3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#7B68EE' },
            { offset: 1, color: '#A66CFF' }
          ]
        }
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(123, 104, 238, 0.4)' },
          { offset: 1, color: 'rgba(166, 108, 255, 0.1)' }
        ])
      },
      smooth: true
    }, {
      name: '土壤湿度',
      type: 'bar',
      yAxisIndex: 1,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(35, 253, 192, 0.8)' },
          { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '40%',
      data: soilData.value.moisture
    }, {
      name: '适宜湿度范围',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'none',
      lineStyle: {
        type: 'dashed',
        width: 1,
        color: 'rgba(35, 253, 192, 0.5)'
      },
      markArea: {
        silent: true,
        itemStyle: {
          color: 'rgba(35, 253, 192, 0.05)'
        },
        data: [
          [{
            yAxis: 35
          }, {
            yAxis: 65
          }]
        ]
      }
    }]
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
.soil-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style> 
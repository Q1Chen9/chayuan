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
const highMoistureCounter = ref(0); // 高湿度计数器

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
    const date = new Date(now.getTime() - i * 15 * 60 * 1000); // 每15分钟间隔
    dates.push(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`);
    
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
  const newDateStr = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}:${String(newDate.getSeconds()).padStart(2, '0')}`;

  if (soilData.value.dates[soilData.value.dates.length - 1] !== newDateStr) {
    soilData.value.dates.shift();
    soilData.value.dates.push(newDateStr);
  }

  let lastTemp = soilData.value.temperature[soilData.value.temperature.length - 1];
  let newTemp = lastTemp + (Math.random() - 0.5) * 0.5;
  newTemp = Math.max(18, Math.min(22, newTemp));
  
  let lastMoisture = soilData.value.moisture[soilData.value.moisture.length - 1];
  let newMoisture;
  
  if (lastMoisture > 60) {
    highMoistureCounter.value++;
    // 当湿度高于60%时，减缓下降速率，并确保至少保持3个周期
    if (highMoistureCounter.value < 3) {
      // 前3个周期保持高湿度，轻微波动
      newMoisture = lastMoisture + (Math.random() - 0.5) * 1;
    } else {
      // 3个周期后开始缓慢下降
      newMoisture = lastMoisture + (Math.random() - 0.7) * 2; // 减缓下降速率
    }
  } else {
    highMoistureCounter.value = 0; // 重置计数器
    // 正常湿度范围内的随机变化
    newMoisture = lastMoisture + (Math.random() - 0.5) * 3;
  }
  
  newMoisture = Math.max(30, Math.min(70, newMoisture)); // 调整最大值以允许超过60%

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
        color: '#d5f1f8',
        // 显示为HH:mm:ss格式
        formatter: function(value) {
          return value; // 直接显示为时间格式
        }
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
        color: function(params) {
          if (params.value > 60) {
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 99, 99, 0.8)' },
              { offset: 1, color: 'rgba(255, 99, 99, 0.1)' }
            ]);
          } else {
            return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(35, 253, 192, 0.8)' },
              { offset: 1, color: 'rgba(35, 253, 192, 0.1)' }
            ]);
          }
        },
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

const playAlarm = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    g.gain.value = 0.2;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.25);
    o.onended = () => ctx.close();
  } catch (e) {
    // 忽略错误
  }
};

const handleKeydown = (e) => {
  if (e.key === 'g' || e.key === 'G') {
    // 只提升当天湿度
    const arr = soilData.value.moisture.slice();
    arr[arr.length - 1] = Math.min(100, arr[arr.length - 1] + 10);
    soilData.value.moisture = arr;
    updateChart();
    playAlarm();
  }
};

onMounted(() => {
  initChart();
  window.addEventListener('resize', resizeChart);
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart);
  window.removeEventListener('keydown', handleKeydown);
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
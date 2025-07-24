<template>
  <div ref="chartRef" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  chartData: {
    type: Array,
    required: true,
  },
});

const chartRef = ref(null);
let myChart = null;

const initChart = () => {
  if (chartRef.value) {
    myChart = echarts.init(chartRef.value);
    updateChart();
  }
};

const updateChart = () => {
  if (!myChart || !props.chartData || props.chartData.length === 0) {
    return;
  }

  // Data needs to be reversed for horizontal bar chart to show highest on top
  const users = [...props.chartData].reverse();
  const userNames = users.map(item => item.name);
  const userCounts = users.map(item => item.count);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: '#333',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: {
        lineStyle: {
          color: 'rgba(71, 200, 255, 0.2)'
        }
      },
      axisLabel: {
        color: '#aaccdd'
      }
    },
    yAxis: {
      type: 'category',
      data: userNames,
      axisLabel: {
        color: '#d5f1f8',
        fontSize: 12
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgba(71, 200, 255, 0.5)'
        }
      }
    },
    series: [
      {
        name: '检测次数',
        type: 'bar',
        data: userCounts,
        barWidth: '60%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: '#23fdc0' },
            { offset: 1, color: '#47C8FF' }
          ])
        },
        label: {
          show: true,
          position: 'right',
          color: '#fff',
          formatter: '{c} 次'
        }
      }
    ]
  };

  myChart.setOption(option);
};

onMounted(() => {
  initChart();
});

watch(() => props.chartData, () => {
  updateChart();
}, { deep: true });
</script> 
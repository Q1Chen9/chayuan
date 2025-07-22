<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'LeafGradeChart',
  props: {
    chartData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chart = ref(null);
    let myChart = null;

    const initChart = () => {
      if (chart.value) {
        myChart = echarts.init(chart.value);
        myChart.setOption(getOption());
      }
    };

    const getOption = () => {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#d5f1f8'
          }
        },
        series: [
          {
            name: '茶叶分级',
            type: 'pie',
            radius: '50%',
            data: props.chartData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              color: '#d5f1f8'
            }
          }
        ]
      };
    };

    onMounted(() => {
      initChart();
    });

    watch(() => props.chartData, () => {
      if (myChart) {
        myChart.setOption(getOption());
      }
    }, { deep: true });

    return {
      chart,
    };
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style> 
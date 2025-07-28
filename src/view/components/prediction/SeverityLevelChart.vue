<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'SeverityLevelChart',
  props: {
    chartData: {
      type: Array,
      required: true,
    },
    thresholds: {
      type: Object,
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
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#fff',
          },
        },
        title: {
            text: `阈值: 紧急 > ${props.thresholds.critical}, 高 > ${props.thresholds.high}, 中 > ${props.thresholds.medium}`,
            left: 'center',
            bottom: '2%',
            textStyle: {
                color: '#aaccdd',
                fontSize: 12,
                fontWeight: 'normal'
            }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: props.chartData.map(item => item.name),
          axisLine: {
            lineStyle: {
              color: '#d5f1f8',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#d5f1f8',
            },
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(71, 200, 255, 0.2)',
            },
          },
        },
        series: [
          {
            name: '预警次数',
            type: 'bar',
            barWidth: '60%',
            data: props.chartData.map(item => ({
              value: item.count,
              itemStyle: {
                color: item.color,
              },
            })),
          },
        ],
      };
    };

    onMounted(() => {
      initChart();
    });

    watch(() => props.chartData, () => {
        if(myChart) {
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
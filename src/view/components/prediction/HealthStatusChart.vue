<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'HealthStatusChart',
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
      const total = props.chartData.reduce((sum, item) => sum + item.value, 0);
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          bottom: '5%',
          left: 'center',
          textStyle: {
            color: '#d5f1f8'
          }
        },
        series: [
          {
            name: '茶园健康状态',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'center',
              formatter: () => {
                const healthyItem = props.chartData.find(item => item.name === '健康');
                const percentage = total > 0 ? ((healthyItem.value / total) * 100).toFixed(1) : 0;
                return `{a|${percentage}%}\n{b|健康率}`;
              },
              rich: {
                a: {
                  color: '#23fdc0',
                  fontSize: 24,
                  fontWeight: 'bold',
                },
                b: {
                  color: '#aaccdd',
                  fontSize: 14,
                }
              }
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false,
            },
            data: props.chartData.map(item => ({
              value: item.value,
              name: item.name,
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
<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'PestDistributionChart',
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
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#333',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
          },
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 20,
          data: props.chartData.map(item => item.name),
          textStyle: {
            color: '#d5f1f8',
          },
        },
        series: [
          {
            name: '病虫害分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: 'rgba(6, 30, 65, 1)',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
                color: '#fff',
              },
            },
            labelLine: {
              show: false,
            },
            data: props.chartData.map(item => ({
              value: item.percentage,
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
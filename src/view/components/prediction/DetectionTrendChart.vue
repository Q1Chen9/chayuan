<template>
  <div ref="chart" class="chart-container"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'DetectionTrendChart',
  props: {
    chartData: {
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
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderColor: '#333',
          textStyle: {
            color: '#fff',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: props.chartData.labels,
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
            name: '检测次数',
            type: 'line',
            stack: '总量',
            data: props.chartData.values,
            smooth: true,
            itemStyle: {
              color: '#23fdc0',
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(35, 253, 192, 0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(35, 253, 192, 0)',
                },
              ]),
            },
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
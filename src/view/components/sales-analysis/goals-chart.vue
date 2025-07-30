<template>
  <div ref="chart" style="width: 100%; height: 100%;"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'GoalsChart',
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const chart = ref(null);
    let myChart = null;

    const getOption = () => {
      const { name, value, total, color } = props.chartData;
      const percentage = total > 0 ? ((value / total) * 100) : 0;

      return {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            pointer: {
              show: false
            },
            progress: {
              show: true,
              overlap: false,
              roundCap: true,
              clip: false,
              itemStyle: {
                borderWidth: 1,
                borderColor: color,
                color: color
              }
            },
            axisLine: {
              lineStyle: {
                width: 10,
                color: [[1, 'rgba(255, 255, 255, 0.1)']]
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            data: [
              {
                value: percentage,
                name: name,
                title: {
                  show: false
                },
                detail: {
                  offsetCenter: ['0%', '0%'],
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#fff'
                }
              }
            ],
            title: {
              show: false
            },
            detail: {
              width: 40,
              height: 14,
              fontSize: 14,
              color: '#fff',
              fontWeight: 'bold',
              formatter: '{value}%'
            }
          }
        ]
      };
    };
    
    onMounted(() => {
        if(chart.value) {
            myChart = echarts.init(chart.value);
            myChart.setOption(getOption());
        }
    });

    watch(() => props.chartData, () => {
        if(myChart) {
            myChart.setOption(getOption());
        }
    }, { deep: true });

    return {
      chart
    };
  }
};
</script> 
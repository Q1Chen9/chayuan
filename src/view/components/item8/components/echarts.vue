<template>
  <div class="echartsBody">
    <div class="echartsBody1" ref="echarts1"></div>
    <div class="echartsBody2">
      <div class="centerbg"></div>
      <div class="echartsBody2Inner">
        <div class="echartsTitle">{{ total }}</div>
        <div class="echartsDesc">{{ title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts"

export default {
  name: 'echarts1',
  components: {},
  data() {
    return {}
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default() {
        return '';
      }
    },
    total: {
      type: String,
      default() {
        return 0;
      }
    },
  },
  watch: {
    list() {
      this.drawEcharts()
    },
  },
  mounted() {
    var that = this;
    that.drawEcharts();
  },
  computed: {
    colorList: function () {
      var that = this;
      var colorList = []
      that.list.forEach((type) => {
        var color = new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
          offset: 0,
          color: type.color1
        }, {
          offset: 1,
          color: type.color2
        }])
        colorList.push(color)
      });
      return colorList
    }
  },
  methods: {
    drawEcharts() {
      var that = this
      let myChart = echarts.init(this.$refs.echarts1)
      window.addEventListener('resize', () => {
        myChart.resize()
      })
      var colors = this.colorList
      var data = []
      that.list.forEach((type) => {
        if (type.checked) {
          var datas = {
            ...type,
            itemStyle: {
              normal: {
                borderColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                  offset: 0,
                  color: type.color1
                }, {
                  offset: 1,
                  color: type.color2
                }]),
              }
            }
          }
          data.push(datas)
        }
      });
      var option = {
        color: colors,
        tooltip: {
          show: true,
          trigger: 'item',
          confine: true
        },
        legend: {
          show: false,
          orient: 'horizontal',
          left: 'center',
          bottom: '0',
          itemWidth: 16,
          itemHeight: 12,
          itemGap: 30,
          icon: 'rect',
          textStyle: {
            color: 'rgba(255, 255, 255, 1)',
            fontSize: '14'
          },
          data: data
        },
        series: [
          {
            name: '测试执行统计',
            type: 'pie',
            // roseType: 'area',
            center: ['50%', '50%'],
            radius: ['60%', '80%'],
            // borderCap: 'round',
            label: {
              show: false,
              formatter: '{c}', // 显示数据值
              normal: {
                show: false,
                fontSize: 14,
                color: '#92B2D7'
              }
            },
            labelLine: {
              show: false,
              length: 1,
              length2: 10
            },
            data: data
          },
        ]
      }
      myChart.clear()
      myChart.resize()
      myChart.setOption(option)
    },
  }
}
</script>

<style lang="scss" scoped>
.echartsBody {
  position: relative;
  width: 50%;
  height: calc(100% - 0px);
  background: url("../assets/bg.png") center center no-repeat;
  display: flex;
  background-size: 90%;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  .echartsBody1 {
    position: relative;
    width: 100%;
    height: calc(100% - 0px);
  }

  .echartsBody2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 0px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
    pointer-events: none;

    .echartsBody2Inner {
      display: flex;
      width: 86px;
      height: 86px;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: column;
      align-content: flex-start;
      position: relative;
      z-index: 0;

    }

    .centerbg {
      position: absolute;
      width: 100%;
    
      height: 100%;
      background: url("../assets/center.png") center center no-repeat;
      background-size: 40%;
      animation: rotate 6s linear infinite;

    }

    .echartsTitle {
      font-size: 18px;
      font-family: DIN, DIN;
      font-weight: 500;
      color: #FFFFFF;
    }

    .echartsDesc {
      font-size: 12px;
      font-family: PingFang SC, PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
  white-space: nowrap;
    }
  }
}
</style>
<style lang="scss">

@keyframes rotate {
  0% {
    transform: rotateZ(0deg); /*从0度开始*/
  }
  100% {
    transform: rotateZ(360deg); /*360度结束*/
  }
}
</style>

<template>
  <div class="echartsBody">
    <div class="echartsBody1" ref="echarts1"></div>
    <div class="echartsBody2">
      <div class="echartsTitle">{{ total }}</div>
      <div class="echartsDesc">{{name}}</div>
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
    shadowColor: {
      type: String,
      default() {
        return 'rgba(254, 175, 87, 0.5)';
      }
    },
    name: {
      type: String,
      default() {
        return '总数';
      }
    },
    total: {
      type: String,
      default() {
        return 0;
      }
    },
  },
  mounted() {
    var that = this;
    const viewElem = document.body;
    // 监听窗口变化,重绘echarts
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        that.drawEcharts();
      }, 300)
    });
    resizeObserver.observe(viewElem);
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
        color: this.colorList,
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['70%', '90%'],
            labelLine: {
              normal: {
                length: 10,
                lineStyle: {
                  type: 'dashed',  // 设置为虚线
                  color: '#fff' // 可以指定虚线的颜色
                }
              }
            },
            label: {
              show: false,
              formatter: '{c}',
              color: '#fff',
              fontSize: 14
            },
            itemStyle: {
              normal: {
                borderColor: '#3eebc4',
                borderWidth: 0
              }
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
    background: url("./assets/huanbg.png") center center no-repeat;
    background-size: 128px 128px;

    .echartsTitle {
      font-family: MicrosoftYaHei;
      font-weight: bold;
      font-size: 20px;
      color: #00f8be;
    }

    .echartsDesc {
      font-family: MicrosoftYaHei;
      font-weight: 400;
      font-size: 14px;
      color: #FFFFFF;
    }
  }
}
</style>

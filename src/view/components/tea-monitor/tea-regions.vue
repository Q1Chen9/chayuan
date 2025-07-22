<template>
  <div class="tea-regions">
    <div class="regions-list">
      <div class="region-item" v-for="(item, index) in topRegions" :key="index">
        <div class="region-rank">{{ index + 1 }}</div>
        <div class="region-name">{{ item.name }}</div>
        <div class="region-value">{{ item.value }}%</div>
        <div class="region-bar">
          <div class="bar-bg"></div>
          <div class="bar-value" :style="{ width: item.value + '%', background: getRegionColor(index) }"></div>
        </div>
      </div>
    </div>
    
    <div class="chart-container" ref="chartEl"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TeaRegions',
  data() {
    return {
      chart: null,
      regionData: [
        { name: '浙江', value: 42 },
        { name: '上海', value: 18 },
        { name: '江苏', value: 12 },
        { name: '北京', value: 8 },
        { name: '广东', value: 6 },
        { name: '福建', value: 4 },
        { name: '安徽', value: 3 },
        { name: '山东', value: 2 },
        { name: '四川', value: 2 },
        { name: '其他', value: 3 }
      ],
      topRegions: [
        { name: '浙江', value: 42 },
        { name: '上海', value: 18 },
        { name: '江苏', value: 12 },
        { name: '北京', value: 8 },
        { name: '广东', value: 6 }
      ]
    }
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.resizeChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chartEl);
      
      // 准备地图数据
      const mapData = this.regionData.map((item, index) => {
        return {
          ...item,
          itemStyle: {
            color: this.getRegionColor(index)
          }
        };
      });
      
      // 使用环形图代替饼图
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}% ({d}%)'
        },
        series: [
          {
            name: '销售占比',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 6,
              borderColor: 'rgba(6, 30, 65, 0.6)',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              },
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data: mapData,
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDuration: 800
          }
        ]
      };
      
      this.chart.setOption(option);
    },
    resizeChart() {
      this.chart && this.chart.resize();
    },
    getRegionColor(index) {
      const colors = [
        '#23fdc0',  // 亮绿色
        '#47C8FF',  // 亮蓝色
        '#5A66FF',  // 蓝紫色
        '#A66CFF',  // 紫色
        '#FFBA5A',  // 橙色
        '#FF5370',  // 红色
        '#00E1FF',  // 青色
        '#FFE45A',  // 黄色
        '#8A8DFF',  // 淡紫色
        '#FF8F70'   // 橙红色
      ];
      
      return colors[index] || colors[4];
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-regions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 6px;
  
  .regions-list {
    width: 55%;
    height: 100%;
    padding-right: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .region-item {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .region-rank {
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10px;
        font-weight: 600;
        color: #d5f1f8;
        margin-right: 5px;
        flex-shrink: 0;
        
        background: rgba(35, 253, 192, 0.1);
        border: 1px solid rgba(35, 253, 192, 0.3);
        border-radius: 4px;
      }
      
      .region-name {
        width: 32px;
        font-size: 11px;
        color: rgba(213, 241, 248, 0.8);
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .region-value {
        width: 32px;
        font-size: 11px;
        font-weight: 600;
        color: #d5f1f8;
        text-align: right;
        padding-right: 5px;
        flex-shrink: 0;
      }
      
      .region-bar {
        flex: 1;
        position: relative;
        height: 3px;
        min-width: 30px;
        
        .bar-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(213, 241, 248, 0.1);
          border-radius: 1.5px;
        }
        
        .bar-value {
          position: absolute;
          height: 100%;
          border-radius: 1.5px;
          transition: width 1s ease;
        }
      }
    }
  }
  
  .chart-container {
    width: 45%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at center, rgba(35, 253, 192, 0.05), transparent 70%);
      opacity: 0.8;
      pointer-events: none;
    }
  }
}
</style> 
<template>
  <div class="item10">
    <div class="map-container" ref="mapContainer"></div>
    <div class="map-title">青芽茶园种植分布图</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';

const mapContainer = ref(null);
let mapChart = null;

const initMap = async () => {
  try {
    // 获取杭州市GeoJSON数据
    const hangzhouJson = await fetch('/src/assets/geo/hangzhou.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`无法加载地图数据: ${res.status}`);
        }
        return res.json();
      })
      .catch(error => {
        console.error('加载杭州地图数据失败:', error);
        // 尝试使用相对路径
        return fetch('../../../assets/geo/hangzhou.json').then(res => res.json());
      });
    
    // 注册杭州地图
    echarts.registerMap('hangzhou', hangzhouJson);
    
    // 初始化地图
    if (mapContainer.value) {
      mapChart = echarts.init(mapContainer.value);
      
      // 地图配置项
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>龙井茶种植指数: {c}',
          backgroundColor: 'rgba(8, 35, 43, 0.9)',
          borderColor: '#34ebd8',
          borderWidth: 1,
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        visualMap: {
          min: 60,
          max: 100,
          text: ['高', '低'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['rgba(0, 146, 202, 0.5)', 'rgba(0, 229, 255, 0.8)', 'rgba(35, 253, 192, 0.9)']
          },
          textStyle: {
            color: '#d5f1f8'
          },
          left: 10,
          bottom: 10
        },
        geo: {
            map: 'hangzhou',
            zoom: 1.2,
            scaleLimit: {
              min: 1.18,
              max: 2,
            },
            label: {
              show: true,

            },
            itemStyle: {   //普通状态下样式
              areaColor: '#d7effd',
            },
            emphasis: {
            label: {
              show: true,
              color: '#fff',
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              areaColor: 'rgba(35, 253, 192, 0.8)',
              borderColor: '#47C8FF',
              borderWidth: 3,
              shadowColor: 'rgba(0, 229, 255, 0.9)',
              shadowBlur: 15
            }
          },
          itemStyle: {
            areaColor: 'rgba(7, 30, 60, 0.5)',
            borderColor: 'rgba(0, 229, 255, 1)',
            borderWidth: 2.5,
            shadowColor: 'rgba(0, 229, 255, 0.7)',
            shadowBlur: 12
          },
          select: {
            itemStyle: {
              areaColor: 'rgba(35, 253, 192, 0.6)',
              borderColor: '#34ebd8',
              borderWidth: 3
            }
          },
          label: {
            show: true,
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 12
          },
        },
        series: [
        // 茶叶标记点 - 使用更明显的效果
        {
          name: '茶叶产地',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: 15,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke',
            scale: 4,
            period: 3
          },
          hoverAnimation: true,
          itemStyle: {
            color: '#23fdc0',
            shadowBlur: 10,
            shadowColor: 'rgba(0, 229, 255, 0.8)'
          },
          emphasis: {
            scale: true
          },
          data: [
            { name: '临安龙井茶园', value: [119.72, 30.23, 98] },
            { name: '於潜茶园', value: [119.68, 30.20, 92] },
            { name: '昌化茶园', value: [119.25, 30.14, 85] }
          ],
          zlevel: 2
        },
        // 添加文字标注层
        {
          name: '茶叶产地标签',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'none',
          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            color: '#fff',
            fontSize: 12,
            backgroundColor: 'rgba(8, 35, 43, 0.7)',
            padding: [3, 5],
            borderRadius: 3
          },
          data: [
            { name: '临安龙井茶园', value: [119.72, 30.23, 98] },
            { name: '於潜茶园', value: [119.68, 30.20, 92] },
            { name: '昌化茶园', value: [119.55, 30.14, 85] }
          ],
          zlevel: 3
        }]
      };
      
      // 设置配置项
      mapChart.setOption(option);
      
      // 监听窗口大小变化，重新渲染图表
      window.addEventListener('resize', () => {
        mapChart.resize();
      });
    }
  } catch (error) {
    console.error('初始化地图失败:', error);
  }
};

// 在组件挂载后初始化地图
onMounted(() => {
  initMap();
});

// 组件卸载时清除计时器
onUnmounted(() => {
  // 移除窗口事件监听
  window.removeEventListener('resize', () => {
    if (mapChart) mapChart.resize();
  });
  
  // 销毁图表实例
  if (mapChart) {
    mapChart.dispose();
    mapChart = null;
  }
});
</script>

<style lang="scss" scoped>
.item10 {
  width: 100%;
  height: 100%;
  position: relative;
  background: rgba(8, 35, 43, 0.6);
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  .map-container {
  width: 100%;
  height: 100%;
}

  .map-title {
    position: absolute;
    top: 10px;
    left: 0;
  width: 100%;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #34ebd8;
    text-shadow: 0 0 10px rgba(35, 253, 192, 0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(71, 200, 255, 0), 
      rgba(71, 200, 255, 0.5), 
      rgba(35, 253, 192, 0.8), 
      rgba(71, 200, 255, 0.5), 
      rgba(71, 200, 255, 0)
    );
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      rgba(71, 200, 255, 0), 
      rgba(71, 200, 255, 0.5), 
      rgba(35, 253, 192, 0.8), 
      rgba(71, 200, 255, 0.5), 
      rgba(71, 200, 255, 0)
    );
  }
}
</style>

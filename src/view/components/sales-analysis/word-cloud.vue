<template>
  <div class="word-cloud">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';
// Wordcloud must be imported after echarts
import 'echarts-wordcloud';

const chartContainer = ref(null);
let chart = null;
let dataTimer = null;

const keywords = ref([
  { name: '西湖龙井', value: 1000 }, { name: '明前茶', value: 820 },
  { name: '狮峰龙井', value: 750 }, { name: '雨前茶', value: 680 },
  { name: '绿茶', value: 620 }, { name: '特级龙井', value: 580 },
  { name: '一级龙井', value: 520 }, { name: '梅家坞龙井', value: 480 },
  { name: '龙井43号', value: 450 }, { name: '春茶', value: 420 },
  { name: '新茶', value: 390 }, { name: '茶叶', value: 370 },
  { name: '杭州特产', value: 350 }, { name: '浙江名茶', value: 330 },
  { name: '茶韵', value: 310 }, { name: '清香', value: 295 },
  { name: '回甘', value: 285 }, { name: '茶香', value: 275 },
  { name: '扁平形', value: 265 }, { name: '嫩绿色', value: 255 },
  { name: '口感鲜爽', value: 245 }, { name: '茶汤清澈', value: 235 },
  { name: '茶艺', value: 225 }, { name: '茶文化', value: 215 },
  { name: '茶礼盒', value: 205 }, { name: '送礼佳品', value: 195 },
  { name: '健康饮品', value: 185 }, { name: '传统工艺', value: 175 },
  { name: '手工炒制', value: 165 }, { name: '茶农', value: 155 },
  { name: '有机茶', value: 145 }, { name: '茶叶品鉴', value: 135 },
  { name: '茶道', value: 125 }, { name: '茶香四溢', value: 115 },
  { name: '茶叶礼盒', value: 105 }, { name: '龙井茶村', value: 95 },
  { name: '茶园', value: 90 }, { name: '茶树', value: 85 },
  { name: '茶香味', value: 80 }, { name: '茶叶品质', value: 75 },
  { name: '茶叶口感', value: 70 }, { name: '茶叶色泽', value: 65 },
  { name: '茶叶香气', value: 60 }, { name: '茶叶产地', value: 55 },
  { name: '茶叶等级', value: 50 }
]);

const updateData = () => {
  keywords.value = keywords.value.map(word => {
    // A moderate change to be visible over the long transition
    const change = (Math.random() - 0.45) * word.value * 0.1;
    return { ...word, value: Math.max(50, word.value + change) };
  });
  
  chart.setOption({
    series: [{
      data: keywords.value
    }]
  });
};

const initWordCloudChart = () => {
  if (!chartContainer.value) return;
  
  chart = echarts.init(chartContainer.value);
  
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      show: true,
      backgroundColor: 'rgba(0,0,0,0.7)',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      padding: 10,
      extraCssText: 'border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);',
      formatter: '{b}: {c}'
    },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      left: 'center',
      top: 'center',
      width: '100%',
      height: '100%',
      right: null,
      bottom: null,
      sizeRange: [12, 38], // 调整字体大小范围，适应更多词语
      rotationRange: [-30, 30], // 增加旋转角度范围，使词云更丰富
      rotationStep: 15,
      gridSize: 8, // 减小网格尺寸，让词语分布更紧密
      drawOutOfBound: false,
      // Add animation properties for smoother transitions
      animation: true,
      animationDurationUpdate: 4500, // Very long animation for a slow, smooth transition
      animationEasingUpdate: 'cubicInOut',
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function() {
          return 'rgb(' + [
            Math.round(Math.random() * 100 + 155),
            Math.round(Math.random() * 150 + 105),
            Math.round(Math.random() * 100 + 155)
          ].join(',') + ')';
        }
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: '#333',
          fontWeight: 'bold',
          fontSize: '+=5' // 悬停时额外放大
        }
      },
      data: keywords.value
    }]
  };
  
  chart.setOption(option);
  window.addEventListener('resize', handleResize);
};

const handleResize = () => {
  chart && chart.resize();
};

onMounted(() => {
    initWordCloudChart();
  dataTimer = setInterval(updateData, 5000); // Low update frequency
});

onBeforeUnmount(() => {
  if (dataTimer) clearInterval(dataTimer);
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.word-cloud {
  width: 100%;
  height: 100%;
  background: rgba(8, 35, 43, 0.7);
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  margin-top: auto; // 靠底部对齐
  
  .word-cloud-title {
    font-size: 16px;
    font-weight: bold;
    color: #34ebd8;
    margin-bottom: 8px;
    padding: 0 5px;
  }
  
  .chart-container {
    width: 100%;
    flex: 1;
    max-height: 100%;
    min-height: 140px;
  }
}
</style> 
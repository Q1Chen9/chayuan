<template>
  <div class="hot-topics">
    <div class="header">
      <div class="title">龙井茶热门话题</div>
      <div class="time">数据更新：{{ currentTime }}</div>
    </div>
    <div class="topics-list">
      <div class="topic-item" v-for="(item, index) in topicsList" :key="index">
        <div class="rank-number" :class="{'top-three': index < 3}">{{ index + 1 }}</div>
        <div class="topic-content">
          <div class="topic-title">{{ item.title }}</div>
          <div class="topic-info">
            <span class="topic-source">
              <i :class="sourceIconMap[item.source]"></i>
              {{ item.source }}
            </span>
            <span class="topic-engagement">
              <i class="fas fa-fire"></i>
              {{ item.engagement }}万
            </span>
            <span class="topic-trend" :class="item.trend > 0 ? 'up' : 'down'">
              <i class="fas" :class="item.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down'"></i>
              {{ Math.abs(item.trend) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 当前时间
const currentTime = ref('04-01 10:30');

// 来源图标映射
const sourceIconMap = {
  '微博': 'fab fa-weibo',
  '知乎': 'fas fa-z',
  '抖音': 'fab fa-tiktok',
  '小红书': 'fas fa-book',
  '淘宝': 'fas fa-shopping-bag',
  '百度': 'fab fa-baidu'
};

// 热门话题数据
const topicsList = ref([
  {
    title: '明前龙井开采，茶农凌晨采摘西湖龙井',
    source: '微博',
    engagement: 1853.6,
    trend: 126
  },
  {
    title: '狮峰龙井与西湖龙井，真的有差别吗？',
    source: '知乎',
    engagement: 1245.8,
    trend: 58
  },
  {
    title: '龙井茶正确冲泡方法及保存技巧',
    source: '小红书',
    engagement: 965.3,
    trend: 42
  },
  {
    title: '杭州西湖景区茶园开放，游客可体验采茶',
    source: '微博',
    engagement: 763.9,
    trend: 39
  },
  {
    title: '如何鉴别真假西湖龙井茶？专家教你5招',
    source: '百度',
    engagement: 582.6,
    trend: 12
  },
  {
    title: '龙井43号与传统龙井，风味差异分析',
    source: '知乎',
    engagement: 438.2,
    trend: -8
  },
  {
    title: '西湖龙井价格为何如此之高？探访龙井茶价格形成因素',
    source: '淘宝',
    engagement: 392.5,
    trend: 15
  },
  {
    title: '茶艺师现场演示：一杯好龙井的品鉴要点',
    source: '抖音',
    engagement: 328.7,
    trend: 24
  },
  {
    title: '今年明前龙井产量下降20%，价格上涨30%',
    source: '微博',
    engagement: 276.9,
    trend: 62
  },
  {
    title: '西湖龙井与碧螺春、铁观音口感对比',
    source: '小红书',
    engagement: 218.4,
    trend: -5
  }
]);
</script>

<style lang="scss" scoped>
.hot-topics {
  width: 100%;
  height: 100%;
  background: rgba(8, 35, 43, 0.7);
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .title {
      font-size: 16px;
      font-weight: bold;
      color: #34ebd8;
    }
    
    .time {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
  
  .topics-list {
    flex: 1;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
    }
    
    .topic-item {
      display: flex;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      
      &:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .rank-number {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 3px;
        background: rgba(255, 255, 255, 0.1);
        font-size: 12px;
        font-weight: bold;
        margin-right: 10px;
        margin-top: 2px;
        
        &.top-three {
          background: linear-gradient(to right, #43e97b, #38f9d7);
          color: #000;
        }
      }
      
      .topic-content {
        flex: 1;
        
        .topic-title {
          font-size: 14px;
          margin-bottom: 5px;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .topic-info {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          
          .topic-source, .topic-engagement {
            margin-right: 15px;
            
            i {
              margin-right: 5px;
            }
          }
          
          .topic-trend {
            &.up {
              color: #4caf50;
            }
            
            &.down {
              color: #f44336;
            }
            
            i {
              margin-right: 3px;
            }
          }
        }
      }
    }
  }
}
</style> 
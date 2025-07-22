<template>
  <div class="tea-indicators">
    <div class="indicator-wrapper" v-for="(item, index) in indicators" :key="index">
      <div class="indicator-card">
        <div class="indicator-icon">
          <i :class="item.icon"></i>
        </div>
        <div class="indicator-content">
          <div class="indicator-value">{{ item.value }}</div>
          <div class="indicator-name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeaIndicators',
  data() {
    return {
      indicators: [
        {
          name: '茶园面积',
          value: '8,520 亩',
          icon: 'fas fa-tree',
          trendIcon: 'fas fa-arrow-up',
          trendValue: '3.2%',
          trendClass: 'trend-up'
        },
        {
          name: '预测产量',
          value: '65.8 吨',
          icon: 'fas fa-scale-balanced',
          trendIcon: 'fas fa-arrow-up',
          trendValue: '5.7%',
          trendClass: 'trend-up'
        },
        {
          name: '预测产值',
          value: '4,326 万',
          icon: 'fas fa-sack-dollar',
          trendIcon: 'fas fa-arrow-up',
          trendValue: '8.4%',
          trendClass: 'trend-up'
        },
        {
          name: '农户数量',
          value: '1,248 户',
          icon: 'fas fa-house-user',
          trendIcon: 'fas fa-arrow-up',
          trendValue: '1.6%',
          trendClass: 'trend-up'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-indicators {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  
  .indicator-wrapper {
    width: calc(25% - 18px);
    height: 90px;
    
    .indicator-card {
      width: 90%;
      height: 100%;
      background: rgba(6, 30, 65, 0.5);
      border-radius: 10px;
      border: 1px solid rgba(71, 200, 255, 0.3);
      box-shadow: 0 0 15px rgba(35, 253, 192, 0.1);
      padding: 15px;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(35, 253, 192, 0.2);
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 60%;
        height: 100%;
        background: radial-gradient(circle at top right, rgba(35, 253, 192, 0.1), transparent 70%);
        opacity: 0.5;
        pointer-events: none;
      }
      
      .indicator-icon {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        background: rgba(35, 253, 192, 0.1);
        border: 1px solid rgba(35, 253, 192, 0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 15px;
        flex-shrink: 0;
        
        i {
          font-size: 30px;
          color: #23fdc0;
        }
      }
      
      .indicator-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        
        .indicator-value {
          font-size: 26px;
          font-weight: 700;
          color: #d5f1f8;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        
        .indicator-name {
          font-size: 14px;
          color: rgba(213, 241, 248, 0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style> 
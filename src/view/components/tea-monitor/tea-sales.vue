<template>
  <div class="tea-sales">
    <div class="data-cards">
      <div class="data-card" v-for="(item, index) in salesData" :key="index">
        <div class="card-icon">
          <i :class="item.icon"></i>
        </div>
        <div class="card-content">
          <div class="card-value">
            {{ item.value }}
            <span v-if="item.unit" class="unit">{{ item.unit }}</span>
          </div>
          <div class="card-name">{{ item.name }}</div>
        </div>
        <div class="card-trend" :class="item.trend > 0 ? 'trend-up' : 'trend-down'">
          <i :class="item.trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
          <span>{{ Math.abs(item.trend) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeaSales',
  data() {
    return {
      salesData: [
        {
          name: '总销售额',
          value: '¥342.5万',
          unit: '',
          icon: 'fas fa-sack-dollar',
          trend: 12.6
        },
        {
          name: '客单价',
          value: '265',
          unit: '元',
          icon: 'fas fa-tag',
          trend: 5.8
        },
        {
          name: '订单量',
          value: '12,918',
          unit: '单',
          icon: 'fas fa-cart-shopping',
          trend: 8.2
        },
        {
          name: '转化率',
          value: '4.86',
          unit: '%',
          icon: 'fas fa-percent',
          trend: -1.2
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-sales {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px;
  
  .data-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 6px;
    width: 100%;
    height: 100%;
    
    .data-card {
      width: 85%;
      height: 80%;
      background: rgba(6, 30, 65, 0.4);
      border-radius: 6px;
      border: 1px solid rgba(71, 200, 255, 0.2);
      box-shadow: 0 0 10px rgba(35, 253, 192, 0.1);
      padding: 8px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 15px rgba(35, 253, 192, 0.15);
        border-color: rgba(71, 200, 255, 0.25);
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at top right, rgba(35, 253, 192, 0.1), transparent 70%);
        opacity: 0.4;
        pointer-events: none;
      }
      
      .card-icon {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 22px;
        height: 22px;
        border-radius: 4px;
        background: rgba(35, 253, 192, 0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        
        i {
          font-size: 12px;
          color: #23fdc0;
        }
      }
      
      .card-content {
        margin-top: 2px;
        padding-right: 24px;
        
        .card-value {
          font-size: 28px;
          font-weight: 700;
          color: #d5f1f8;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          
          .unit {
            font-size: 12px;
            font-weight: normal;
            color: rgba(213, 241, 248, 0.7);
            margin-left: 1px;
          }
        }
        
        .card-name {
          font-size: 11px;
          color: rgba(213, 241, 248, 0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .card-trend {
        position: absolute;
        bottom: 6px;
        right: 6px;
        font-size: 10px;
        font-weight: 600;
        display: flex;
        align-items: center;
        padding: 1px 4px;
        border-radius: 8px;
        background: rgba(6, 30, 65, 0.5);
        
        &.trend-up {
          color: #23fdc0;
        }
        
        &.trend-down {
          color: #FF5370;
        }
        
        i {
          margin-right: 1px;
          font-size: 8px;
        }
      }
    }
  }
}
</style> 
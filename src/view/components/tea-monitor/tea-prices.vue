<template>
  <div class="tea-inventory">
    <div class="inventory-summary">
      <div class="summary-item">
        <div class="item-icon">
          <i class="fas fa-warehouse"></i>
        </div>
        <div class="item-content">
          <div class="item-value">1,280 kg</div>
          <div class="item-label">总库存量</div>
        </div>
      </div>
      
      <div class="summary-item">
        <div class="item-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="item-content">
          <div class="item-value">28 天</div>
          <div class="item-label">预计可售</div>
        </div>
      </div>
    </div>
    
    <div class="grade-grid">
      <div class="grade-card" v-for="(item, index) in gradeData" :key="index" :style="{ borderColor: getGradeColor(index) }">
        <div class="grade-name" :style="{ background: getGradeColor(index) }">
          {{ item.name }}
        </div>
        <div class="grade-info">
          <div class="info-item">
            <span class="info-label">可售重量:</span>
            <span class="info-value">{{ item.weight }} kg</span>
          </div>
          <div class="info-item">
            <span class="info-label">可售数量:</span>
            <span class="info-value">{{ item.quantity }} 盒</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeaInventory',
  data() {
    return {
      gradeData: [
        { name: '特级', weight: 120, quantity: 240 },
        { name: '一级', weight: 210, quantity: 420 },
        { name: '二级', weight: 180, quantity: 360 },
        { name: '三级', weight: 110, quantity: 220 }
      ]
    }
  },
  methods: {
    getGradeColor(index) {
      const colors = [
        '#23fdc0',  // 特级 - 亮绿色
        '#47C8FF',  // 一级 - 亮蓝色
        '#5A66FF',  // 二级 - 蓝紫色
        '#FFBA5A'   // 三级 - 橙色
      ];
      
      return colors[index] || colors[0];
    }
  }
}
</script>

<style lang="scss" scoped>
.tea-inventory {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6px;
  
  .inventory-summary {
    display: flex;
    justify-content: space-around;
    margin-bottom: 8px;
    padding: 3px 0;
    
    .summary-item {
      display: flex;
      align-items: center;
      
      .item-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: rgba(35, 253, 192, 0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
        
        i {
          font-size: 18px;
          color: #23fdc0;
        }
      }
      
      .item-content {
        .item-value {
          font-size: 18px;
          font-weight: 700;
          color: #d5f1f8;
          line-height: 1.2;
        }
        
        .item-label {
          font-size: 12px;
          color: rgba(213, 241, 248, 0.6);
        }
      }
    }
  }
  
  .grade-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 6px;
    
    .grade-card {
      border-radius: 6px;
      border: 1px solid;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      background: rgba(6, 30, 65, 0.5);
      height: 60px;
      width: 92%;
      
      .grade-name {
        width: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 11px;
        font-weight: 600;
        color: #061e41;
        flex-shrink: 0;
      }
      
      .grade-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 4px;
        
        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 28px;
          
          .info-label {
            font-size: 11px;
            color: rgba(213, 241, 248, 0.6);
          }
          
          .info-value {
            font-size: 11px;
            font-weight: 600;
            color: #d5f1f8;
          }
        }
      }
    }
  }
}
</style> 
<template>
  <div class="customer-reviews">
    <div class="rating-section">
      <div class="rating-chart">
        <div class="chart-value">
          <span class="value">{{ goodRating }}%</span>
          <span class="label">好评率</span>
        </div>
        <div class="chart-ring">
          <svg viewBox="0 0 120 120">
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke="rgba(255, 255, 255, 0.1)" 
              stroke-width="6" 
            />
            <circle 
              cx="60" 
              cy="60" 
              r="54" 
              fill="none" 
              stroke="#38f9d7" 
              stroke-width="6" 
              stroke-dasharray="339.292" 
              stroke-dashoffset="0" 
              transform="rotate(-90 60 60)" 
              :style="{ 'stroke-dashoffset': dashOffset }" 
            />
          </svg>
        </div>
      </div>
      <div class="rating-details">
        <div class="detail-item">
          <div class="item-label">好评</div>
          <div class="item-value">{{ ratingData.good }}</div>
          <div class="item-percentage positive">{{ goodRating }}%</div>
        </div>
        <div class="detail-item">
          <div class="item-label">中评</div>
          <div class="item-value">{{ ratingData.neutral }}</div>
          <div class="item-percentage neutral">{{ neutralRating }}%</div>
        </div>
        <div class="detail-item">
          <div class="item-label">差评</div>
          <div class="item-value">{{ ratingData.bad }}</div>
          <div class="item-percentage negative">{{ badRating }}%</div>
        </div>
      </div>
    </div>
    <div class="reviews-section">
      <div class="section-title">差评关键词排行</div>
      <div class="keyword-list">
        <div class="keyword-item" v-for="(item, index) in badKeywords" :key="index">
          <div class="keyword-rank">{{ index + 1 }}</div>
          <div class="keyword-name">{{ item.keyword }}</div>
          <div class="keyword-count">{{ item.count }}次</div>
          <div class="keyword-bar">
            <div class="bar-inner" :style="{ width: item.percentage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const ratingData = ref({
  good: 8740,
  neutral: 978,
  bad: 235
});

const badKeywords = ref([
  { keyword: '价格高', count: 58, percentage: 100 },
  { keyword: '泡后苦涩', count: 45, percentage: 77.6 },
  { keyword: '送货慢', count: 36, percentage: 62.1 }
]);

let dataTimer = null;

const totalReviews = computed(() => ratingData.value.good + ratingData.value.neutral + ratingData.value.bad);
const goodRating = computed(() => Math.round((ratingData.value.good / totalReviews.value) * 100));
const neutralRating = computed(() => Math.round((ratingData.value.neutral / totalReviews.value) * 100));
const badRating = computed(() => Math.round((ratingData.value.bad / totalReviews.value) * 100));

const dashOffset = computed(() => {
  const perimeter = 2 * Math.PI * 54;
  return perimeter * (1 - goodRating.value / 100);
});

const updateData = () => {
  ratingData.value.good += Math.floor(Math.random() * 5);
  ratingData.value.neutral += Math.floor(Math.random() * 2 - 0.5);
  ratingData.value.bad += Math.floor(Math.random() * 1.2 - 0.1);
  
  ratingData.value.neutral = Math.max(0, ratingData.value.neutral);
  ratingData.value.bad = Math.max(0, ratingData.value.bad);
  
  badKeywords.value = badKeywords.value.map(kw => {
    const change = Math.floor(Math.random() * 3 - 1);
    return { ...kw, count: Math.max(10, kw.count + change) };
  }).sort((a,b) => b.count - a.count);
  
  const maxCount = badKeywords.value[0].count;
  badKeywords.value.forEach(kw => {
    kw.percentage = (kw.count / maxCount) * 100;
  });
};

onMounted(() => {
  dataTimer = setInterval(updateData, 3500);
});

onBeforeUnmount(() => {
  if (dataTimer) clearInterval(dataTimer);
});

</script>

<style lang="scss" scoped>
.customer-reviews {
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
  
  .rating-section {
    display: flex;
    margin-bottom: 15px;
    
    .rating-chart {
      width: 50%;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .chart-value {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        .value {
          font-size: 24px;
          font-weight: bold;
          color: #38f9d7;
        }
        
        .label {
          font-size: 14px;
          margin-top: 5px;
          color: rgba(255, 255, 255, 0.7);
        }
      }
      
      .chart-ring {
        width: 120px;
        height: 120px;
        
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    
    .rating-details {
      width: 50%;
      padding-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      .detail-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .item-label {
          width: 50px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .item-value {
          width: 60px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin-right: 10px;
        }
        
        .item-percentage {
          width: 45px;
          font-size: 14px;
          font-weight: bold;
          
          &.positive {
            color: #38f9d7;
          }
          
          &.neutral {
            color: #f7c84e;
          }
          
          &.negative {
            color: #f56c6c;
          }
        }
      }
    }
  }
  
  .reviews-section {
    flex: 1;
    
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #34ebd8;
    }
    
    .keyword-list {
      height: calc(100% - 25px);
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
      
      .keyword-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        
        .keyword-rank {
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.1);
          font-size: 12px;
          margin-right: 10px;
          
          &:nth-child(1) {
            background: #f56c6c;
            color: #fff;
          }
        }
        
        .keyword-name {
          width: 70px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 10px;
        }
        
        .keyword-count {
          width: 60px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          margin-right: 10px;
          text-align: right;
        }
        
        .keyword-bar {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          
          .bar-inner {
            height: 100%;
            background: linear-gradient(to right, #f56c6c, #ff9f7f);
            border-radius: 3px;
          }
        }
      }
    }
  }
}
</style> 
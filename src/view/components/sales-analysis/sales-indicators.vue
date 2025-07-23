<template>
  <div class="sales-indicators">
    <div class="indicators-title">
      <div class="title">销售核心指标</div>
      <div class="time">更新时间：{{ currentTime }}</div>
    </div>
    <div class="indicators-content">
      <!-- 全渠道总计区域 -->
      <div class="indicators-total">
        <div class="total-header">
          <div class="total-title">全渠道总计</div>
        </div>
        
        <!-- 总计数据 - 两行排列 -->
        <div class="total-data">
          <div class="data-row">
            <div class="data-item" v-for="(item, index) in totalData.slice(0, 4)" :key="index">
              <div class="item-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="item-info">
                <div class="item-value">{{ getDisplayValue(item) }}</div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-trend" :class="item.trend > 0 ? 'up' : 'down'">
                  <i class="fas" :class="item.trend > 0 ? 'fa-caret-up' : 'fa-caret-down'"></i>
                  {{ Math.round(Math.abs(item.trend)) }}%
                </div>
              </div>
            </div>
          </div>
          <div class="data-row">
            <div class="data-item" v-for="(item, index) in totalData.slice(4, 8)" :key="index + 4">
              <div class="item-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="item-info">
                <div class="item-value">{{ getDisplayValue(item) }}</div>
                <div class="item-name">{{ item.name }}</div>
                <div class="item-trend" :class="item.trend > 0 ? 'up' : 'down'">
                  <i class="fas" :class="item.trend > 0 ? 'fa-caret-up' : 'fa-caret-down'"></i>
                  {{ Math.round(Math.abs(item.trend)) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 渠道数据区域 - 按钮切换 -->
      <div class="channels-section">
        <div class="channels-header">
          <div class="channels-title">渠道数据</div>
          <div class="channel-buttons">
            <button 
              v-for="(channel, index) in channels.slice(1)" 
              :key="index + 1"
              class="channel-btn"
              :class="{ active: activeChannel === index }"
              @click="activeChannel = index"
            >
              <i :class="channel.icon"></i>
              {{ channel.name }}
            </button>
          </div>
        </div>
        
        <div class="channel-data-container">
          <!-- 淘宝数据 -->
          <div class="channel-data" v-if="activeChannel === 0 && channelData.length > 0">
            <div class="data-row">
              <div class="data-item" v-for="(item, index) in channelData[0].data" :key="index">
                <div class="item-icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="item-info">
                  <div class="item-value">{{ getDisplayValue(item) }}</div>
                  <div class="item-name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 京东数据 -->
          <div class="channel-data" v-if="activeChannel === 1 && channelData.length > 1">
            <div class="data-row">
              <div class="data-item" v-for="(item, index) in channelData[1].data" :key="index">
                <div class="item-icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="item-info">
                  <div class="item-value">{{ getDisplayValue(item) }}</div>
                  <div class="item-name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 拼多多数据 -->
          <div class="channel-data" v-if="activeChannel === 2 && channelData.length > 2">
            <div class="data-row">
              <div class="data-item" v-for="(item, index) in channelData[2].data" :key="index">
                <div class="item-icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="item-info">
                  <div class="item-value">{{ getDisplayValue(item) }}</div>
                  <div class="item-name">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import dayjs from 'dayjs';

const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
let timer = null;
const activeChannel = ref(0);

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const totalData = ref([
  { name: '销售金额', value: 1238560, trend: 8.5, icon: 'fas fa-money-bill-wave', unit: '¥' },
  { name: '销售单量', value: 12385, trend: 6.8, icon: 'fas fa-shopping-cart', unit: '' },
  { name: '浏览人数', value: 235689, trend: 12.4, icon: 'fas fa-eye', unit: '' },
  { name: '点击人数', value: 89754, trend: 9.2, icon: 'fas fa-mouse-pointer', unit: '' },
  { name: '点击率', value: 38.1, trend: -2.3, icon: 'fas fa-percentage', unit: '%' },
  { name: '转化率', value: 13.8, trend: 5.6, icon: 'fas fa-exchange-alt', unit: '%' },
  { name: '客单价', value: 98.5, trend: 1.7, icon: 'fas fa-tag', unit: '¥' },
  { name: '复购率', value: 32.6, trend: 3.9, icon: 'fas fa-redo', unit: '%' }
]);

const channels = ref([
  { name: '全部', icon: 'fas fa-globe' },
  { name: '淘宝', icon: 'fab fa-alipay' },
  { name: '京东', icon: 'fas fa-shopping-bag' },
  { name: '拼多多', icon: 'fas fa-tags' }
]);

const initialChannelData = () => {
  const icons = ['fas fa-money-bill-wave', 'fas fa-shopping-cart', 'fas fa-eye', 'fas fa-mouse-pointer',
                'fas fa-percentage', 'fas fa-exchange-alt', 'fas fa-tag', 'fas fa-redo'];
  return [
    { name: '淘宝', data: [
      { name: '销售金额', value: 658325, trend: 7.2, icon: icons[0], unit: '¥' },
      { name: '销售单量', value: 6854, trend: 5.3, icon: icons[1], unit: '' },
      { name: '浏览人数', value: 125478, trend: 10.8, icon: icons[2], unit: '' },
      { name: '点击人数', value: 48965, trend: 8.1, icon: icons[3], unit: '' },
      { name: '点击率', value: 39.0, trend: -1.8, icon: icons[4], unit: '%' },
      { name: '转化率', value: 14.0, trend: 6.2, icon: icons[5], unit: '%' },
      { name: '客单价', value: 96.0, trend: 1.9, icon: icons[6], unit: '¥' },
      { name: '复购率', value: 34.8, trend: 4.5, icon: icons[7], unit: '%' }
    ]},
    { name: '京东', data: [
      { name: '销售金额', value: 428965, trend: 9.8, icon: icons[0], unit: '¥' },
      { name: '销售单量', value: 3965, trend: 8.4, icon: icons[1], unit: '' },
      { name: '浏览人数', value: 75369, trend: 14.6, icon: icons[2], unit: '' },
      { name: '点击人数', value: 28452, trend: 11.3, icon: icons[3], unit: '' },
      { name: '点击率', value: 37.8, trend: -3.1, icon: icons[4], unit: '%' },
      { name: '转化率', value: 13.9, trend: 4.8, icon: icons[5], unit: '%' },
      { name: '客单价', value: 108.2, trend: 1.4, icon: icons[6], unit: '¥' },
      { name: '复购率', value: 30.5, trend: 2.7, icon: icons[7], unit: '%' }
    ]},
    { name: '拼多多', data: [
      { name: '销售金额', value: 151270, trend: 15.6, icon: icons[0], unit: '¥' },
      { name: '销售单量', value: 1566, trend: 12.9, icon: icons[1], unit: '' },
      { name: '浏览人数', value: 34842, trend: 18.2, icon: icons[2], unit: '' },
      { name: '点击人数', value: 12337, trend: 14.8, icon: icons[3], unit: '' },
      { name: '点击率', value: 35.4, trend: -3.5, icon: icons[4], unit: '%' },
      { name: '转化率', value: 12.7, trend: 9.2, icon: icons[5], unit: '%' },
      { name: '客单价', value: 86.5, trend: 2.7, icon: icons[6], unit: '¥' },
      { name: '复购率', value: 26.3, trend: 5.8, icon: icons[7], unit: '%' }
    ]}
  ];
};

const channelData = ref(initialChannelData());

const getDisplayValue = (item) => {
  if (item.unit === '¥') {
    return `${item.unit}${formatNumber(Math.round(item.value))}`;
  }
  if (item.unit === '%') {
    return `${Math.round(item.value)}${item.unit}`;
  }
  return formatNumber(Math.round(item.value));
};

const updateData = () => {
  currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
  
  const updateItem = (item) => {
    let changeFactor = 0.005;
    if (item.name.includes('率')) changeFactor = 0.001;

    const change = (Math.random() - 0.45) * item.value * changeFactor;
    item.value += change;
    item.trend += (Math.random() - 0.5) * 0.2;
    if (item.trend > 20) item.trend = 20;
    if (item.trend < -20) item.trend = -20;
    return item;
  };

  totalData.value.forEach(updateItem);
  channelData.value.forEach(channel => {
    channel.data.forEach(updateItem);
  });
};

onMounted(() => {
  timer = setInterval(updateData, 2000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

</script>

<style lang="scss" scoped>
.sales-indicators {
  width: 100%;
  height: auto;
  min-height: 100%;
  background: rgba(8, 35, 43, 0.7);
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
  color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
  
  .indicators-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .title {
      font-size: 18px;
      font-weight: bold;
      color: #34ebd8;
    }
    
    .time {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .indicators-content {
    display: flex;
    flex-direction: column;
    height: auto;
    
    .indicators-total {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 15px;
      
      .total-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .total-title {
          font-size: 16px;
          color: #fff;
          font-weight: bold;
        }
      }
      
      .total-data {
        .data-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .data-item {
            width: 23%;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            padding: 12px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            
            .item-icon {
              width: 40px;
              height: 40px;
              background: rgba(52, 235, 216, 0.2);
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-right: 10px;
              
              i {
                color: #34ebd8;
                font-size: 18px;
              }
            }
            
            .item-info {
              flex: 1;
              
              .item-value {
                font-size: 16px;
                font-weight: bold;
                color: #34ebd8;
              }
              
              .item-name {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.8);
                margin: 3px 0;
              }
              
              .item-trend {
                font-size: 12px;
                
                &.up {
                  color: #4caf50;
                }
                
                &.down {
                  color: #f44336;
                }
              }
            }
          }
        }
      }
    }
    
    .channels-section {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      padding: 15px;
      
      .channels-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        
        .channels-title {
          font-size: 16px;
          color: #fff;
          font-weight: bold;
        }
        
        .channel-buttons {
          display: flex;
          gap: 10px;
          
          .channel-btn {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: all 0.3s;
            
            i {
              margin-right: 6px;
              font-size: 14px;
            }
            
            &:hover {
              background: rgba(255, 255, 255, 0.2);
            }
            
            &.active {
              background: rgba(52, 235, 216, 0.2);
              color: #34ebd8;
            }
          }
        }
      }
      
      .channel-data-container {
        .channel-data {
          .data-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            
            .data-item {
              width: 12%;
              background: rgba(255, 255, 255, 0.05);
              border-radius: 6px;
              padding: 12px;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              
              .item-icon {
                width: 36px;
                height: 36px;
                background: rgba(52, 235, 216, 0.2);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 8px;
                
                i {
                  color: #34ebd8;
                  font-size: 16px;
                }
              }
              
              .item-info {
                width: 100%;
                
                .item-value {
                  font-size: 14px;
                  font-weight: bold;
                  color: #34ebd8;
                }
                
                .item-name {
                  font-size: 11px;
                  color: rgba(255, 255, 255, 0.8);
                  margin: 3px 0;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style> 
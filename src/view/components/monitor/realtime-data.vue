<template>
  <div class="realtime-data">
    <div class="data-grid">
      <div class="data-card" v-for="(item, index) in dataItems" :key="index">
        <div class="card-icon" :class="item.class">
          <i :class="item.icon"></i>
        </div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-title">{{ item.title }}</div>
            <div class="card-trend" :class="item.trendClass">
              <i :class="item.trendIcon"></i>
              <span>{{ item.trendValue }}</span>
            </div>
          </div>
          
          <div class="card-main">
            <div class="card-value">
              {{ item.value }} <span class="unit">{{ item.unit }}</span>
            </div>
            <div class="card-status" :class="getStatusClass(item)">{{ getStatusText(item) }}</div>
          </div>
          
          <div class="card-extras">
            <div class="status-bar">
              <div class="status" :style="{ width: getPercentage(item) + '%', background: getStatusColor(item) }"></div>
              <div class="range-markers">
                <div class="marker marker-warning" :style="{ left: getMarkerPosition(item, 'warning') + '%' }"></div>
                <div class="marker marker-danger" :style="{ left: getMarkerPosition(item, 'danger') + '%' }"></div>
              </div>
            </div>
            <div class="card-info" v-if="item.info">{{ item.info }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="summary-section">
      <div class="refresh-info">
        <i class="fas fa-clock"></i>
        <span>更新: {{ currentTime }} | </span>
        <i class="fas fa-cloud-sun"></i>
        <span>天气: 晴朗 23°C</span>
      </div>
      <div class="suggestion-list">
        <div class="suggestion-item" v-for="(suggestion, index) in suggestions" :key="index">
          <i :class="suggestion.icon"></i>
          <span>{{ suggestion.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonitorRealtimeData',
  data() {
    return {
      currentTime: "2025-04-01 10:30",
      dataItems: [
        {
          title: '空气质量',
          value: 45,
          unit: 'AQI',
          icon: 'fas fa-wind',
          class: 'air',
          max: 100,
          min: 0,
          danger: 75,
          warning: 50,
          trendIcon: 'fas fa-arrow-down',
          trendValue: '5%',
          trendClass: 'trend-down',
          info: '空气质量良好，PM2.5低'
        },
        {
          title: '二氧化碳',
          value: 426,
          unit: 'ppm',
          icon: 'fas fa-smog',
          class: 'co2',
          max: 1000,
          min: 300,
          danger: 800,
          warning: 600,
          trendIcon: 'fas fa-arrow-up',
          trendValue: '3%',
          trendClass: 'trend-up',
          info: '浓度在安全范围内'
        },
        {
          title: '温度',
          value: 24.5,
          unit: '°C',
          icon: 'fas fa-temperature-high',
          class: 'temperature',
          max: 40,
          min: 0,
          danger: 35,
          warning: 30,
          trendIcon: 'fas fa-arrow-up',
          trendValue: '1.2°C',
          trendClass: 'trend-up',
          info: '适宜植物生长'
        },
        {
          title: '湿度',
          value: 68,
          unit: '%',
          icon: 'fas fa-tint',
          class: 'humidity',
          max: 100,
          min: 0,
          danger: 90,
          warning: 80,
          trendIcon: 'fas fa-arrow-down',
          trendValue: '5%',
          trendClass: 'trend-down',
          info: '湿度适中，有利光合作用'
        },
        {
          title: '光照强度',
          value: 65,
          unit: 'klux',
          icon: 'fas fa-sun',
          class: 'light',
          max: 100,
          min: 0,
          danger: 85,
          warning: 75,
          trendIcon: 'fas fa-arrow-up',
          trendValue: '15%',
          trendClass: 'trend-up',
          info: '建议适当遮阴'
        },
        {
          title: '降雨量',
          value: 0,
          unit: 'mm',
          icon: 'fas fa-cloud-rain',
          class: 'rainfall',
          max: 50,
          min: 0,
          danger: 30,
          warning: 15,
          trendIcon: 'fas fa-equals',
          trendValue: '0mm',
          trendClass: 'trend-steady',
          info: '今日无降雨，建议浇水'
        }
      ],
      suggestions: [
        { icon: 'fas fa-hand-holding-water', text: '今日晴朗，建议增加灌溉量，防止土壤水分流失' },
        { icon: 'fas fa-umbrella-beach', text: '午后光照强，建议为幼苗提供遮阴' },
        { icon: 'fas fa-bug', text: '气温回升，注意监测害虫活动' }
      ]
    };
  },
  mounted() {
    // 更新时间定时器
    this.timer = setInterval(() => {
      this.currentTime = this.formatTime(new Date());
    }, 60000); // 每分钟更新一次
  },
  beforeUnmount() {
    // 清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    getPercentage(item) {
      if (item.isText) return 100;
      return ((item.value - item.min) / (item.max - item.min)) * 100;
    },
    getMarkerPosition(item, type) {
      if (item.isText || !item[type]) return 0;
      return ((item[type] - item.min) / (item.max - item.min)) * 100;
    },
    getStatusColor(item) {
      if (item.isText) return 'linear-gradient(90deg, #47C8FF 0%, #23fdc0 100%)';
      
      if (item.value >= item.danger) {
        return 'linear-gradient(90deg, #FF5370 0%, #ff8f70 100%)';
      } else if (item.value >= item.warning) {
        return 'linear-gradient(90deg, #FFBA5A 0%, #FFE45A 100%)';
      } else {
        return 'linear-gradient(90deg, #47C8FF 0%, #23fdc0 100%)';
      }
    },
    getStatusClass(item) {
      if (item.isText) return '';
      
      if (item.value >= item.danger) {
        return 'status-danger';
      } else if (item.value >= item.warning) {
        return 'status-warning';
      } else {
        return 'status-normal';
      }
    },
    getStatusText(item) {
      if (item.isText) return '';
      
      if (item.value >= item.danger) {
        return '偏高';
      } else if (item.value >= item.warning) {
        return '略高';
      } else {
        return '正常';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.realtime-data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .data-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;
    padding: 6px;
    
    .data-card {
      background: rgba(6, 30, 65, 0.5);
      border-radius: 6px;
      border: 1px solid rgba(71, 200, 255, 0.3);
      display: flex;
      align-items: center;
      padding: 8px;
      transition: all 0.3s ease;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 10px rgba(35, 253, 192, 0.2);
      }
      
      .card-icon {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
        font-size: 18px;
        color: #fff;
        position: relative;
        flex-shrink: 0;
        
        &::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          background: inherit;
          opacity: 0.3;
          filter: blur(3px);
          z-index: -1;
        }
        
        &.air {
          background: linear-gradient(135deg, #3B93FF 0%, #4ADEDE 100%);
        }
        
        &.co2 {
          background: linear-gradient(135deg, #5A66FF 0%, #A66CFF 100%);
        }
        
        &.temperature {
          background: linear-gradient(135deg, #FF5370 0%, #ff8f70 100%);
        }
        
        &.humidity {
          background: linear-gradient(135deg, #47C8FF 0%, #23fdc0 100%);
        }
        
        &.light {
          background: linear-gradient(135deg, #FFBA5A 0%, #FFE45A 100%);
        }
        
        &.rainfall {
          background: linear-gradient(135deg, #61E1FF 0%, #A09CFF 100%);
        }
      }
      
      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .card-title {
            font-size: 12px;
            font-weight: 500;
            color: rgba(213, 241, 248, 0.9);
          }
          
          .card-trend {
            display: flex;
            align-items: center;
            font-size: 11px;
            
            &.trend-up {
              color: #FF5370;
            }
            
            &.trend-down {
              color: #23fdc0;
            }
            
            &.trend-steady {
              color: #FFBA5A;
            }
            
            i {
              margin-right: 2px;
              font-size: 10px;
            }
          }
        }
        
        .card-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 2px 0;
          
          .card-value {
            font-size: 20px;
            font-weight: 600;
            color: #d5f1f8;
            display: flex;
            align-items: baseline;
            
            .unit {
              font-size: 11px;
              font-weight: normal;
              color: rgba(213, 241, 248, 0.7);
              margin-left: 2px;
            }
          }
          
          .card-status {
            font-size: 10px;
            font-weight: 500;
            padding: 1px 6px;
            border-radius: 3px;
            
            &.status-normal {
              background: rgba(35, 253, 192, 0.15);
              color: #23fdc0;
            }
            
            &.status-warning {
              background: rgba(255, 186, 90, 0.15);
              color: #FFBA5A;
            }
            
            &.status-danger {
              background: rgba(255, 83, 112, 0.15);
              color: #FF5370;
            }
          }
        }
        
        .card-extras {
          margin-top: 2px;
          
          .status-bar {
            height: 3px;
            background: rgba(213, 241, 248, 0.1);
            border-radius: 1.5px;
            overflow: hidden;
            position: relative;
            margin-bottom: 4px;
            
            .status {
              height: 100%;
              border-radius: 1.5px;
              transition: all 0.5s ease;
            }
            
            .range-markers {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              
              .marker {
                position: absolute;
                top: 0;
                height: 100%;
                width: 1px;
                
                &.marker-warning {
                  background: rgba(255, 186, 90, 0.7);
                }
                
                &.marker-danger {
                  background: rgba(255, 83, 112, 0.7);
                }
              }
            }
          }
          
          .card-info {
            font-size: 10px;
            color: rgba(213, 241, 248, 0.7);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  
  .summary-section {
    background: rgba(6, 30, 65, 0.5);
    border-radius: 6px;
    border: 1px solid rgba(71, 200, 255, 0.3);
    margin: 0 6px 6px;
    padding: 6px 10px;
    
    .refresh-info {
      display: flex;
      align-items: center;
      font-size: 11px;
      color: rgba(213, 241, 248, 0.7);
      margin-bottom: 3px;
      
      i {
        margin-right: 3px;
        font-size: 12px;
        color: #47C8FF;
      }
      
      span {
        margin-right: 5px;
      }
    }
    
    .suggestion-list {
      display: flex;
      justify-content: space-between;
      
      .suggestion-item {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 10px;
        color: rgba(213, 241, 248, 0.8);
        margin-right: 5px;
        
        &:last-child {
          margin-right: 0;
        }
        
        i {
          font-size: 12px;
          color: #23fdc0;
          margin-right: 4px;
          flex-shrink: 0;
        }
        
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style> 
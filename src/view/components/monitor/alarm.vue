<template>
  <div class="alarm-container">
    <div v-if="alarmList.length > 0" class="alarm-list">
      <div
        v-for="(alarm, index) in alarmList"
        :key="index"
        class="alarm-item"
        :class="{ 'high-priority': alarm.level === 'high', 'medium-priority': alarm.level === 'medium', 'low-priority': alarm.level === 'low' }"
      >
        <div class="alarm-icon">
          <i :class="getAlarmIcon(alarm.type)"></i>
        </div>
        <div class="alarm-content">
          <div class="alarm-title">{{ alarm.title }}</div>
          <div class="alarm-desc">{{ alarm.description }}</div>
          <div class="alarm-time">{{ alarm.time }}</div>
        </div>
        <div class="alarm-level" :class="'level-' + alarm.level">
          {{ getLevelText(alarm.level) }}
        </div>
      </div>
    </div>
    <div v-else class="no-alarm">
      <i class="iconfont icon-check-circle"></i>
      <p>暂无异常报警</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonitorAlarm',
  data() {
    return {
      alarmList: [
        {
          title: '温度异常警报',
          description: '东部区域温度过高，已超过预警阈值',
          type: 'temperature',
          level: 'high',
          time: '10:25:36'
        },
        {
          title: '土壤湿度异常',
          description: '南部区域土壤湿度低于30%，需要灌溉',
          type: 'soil',
          level: 'medium',
          time: '09:12:53'
        },
        {
          title: 'CO2浓度异常',
          description: '中心区域CO2浓度持续升高',
          type: 'co2',
          level: 'medium',
          time: '08:47:21'
        },
        {
          title: '光照强度不足',
          description: '西北区域光照强度低于正常值',
          type: 'light',
          level: 'low',
          time: '昨天 16:35:42'
        }
      ]
    };
  },
  methods: {
    getAlarmIcon(type) {
      const icons = {
        temperature: 'iconfont icon-temperature-warning',
        humidity: 'iconfont icon-humidity-warning',
        soil: 'iconfont icon-soil-warning',
        co2: 'iconfont icon-co2-warning',
        light: 'iconfont icon-light-warning',
        wind: 'iconfont icon-wind-warning'
      };
      return icons[type] || 'iconfont icon-warning';
    },
    getLevelText(level) {
      const levels = {
        high: '紧急',
        medium: '警告',
        low: '注意'
      };
      return levels[level] || '未知';
    }
  }
};
</script>

<style lang="scss" scoped>
.alarm-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  
  .alarm-list {
    height: 100%;
    overflow-y: auto;
    padding-right: 5px;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(213, 241, 248, 0.1);
      border-radius: 2px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(71, 200, 255, 0.5);
      border-radius: 2px;
    }
    
    .alarm-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 6px;
      margin-bottom: 8px;
      background: rgba(6, 30, 65, 0.5);
      border: 1px solid rgba(71, 200, 255, 0.3);
      position: relative;
      transition: all 0.3s ease;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }
      
      &.high-priority {
        border-left: 4px solid #FF5370;
        
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 83, 112, 0.05);
          pointer-events: none;
        }
        
        animation: pulse 2s infinite;
      }
      
      &.medium-priority {
        border-left: 4px solid #FFBA5A;
        
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 186, 90, 0.05);
          pointer-events: none;
        }
      }
      
      &.low-priority {
        border-left: 4px solid #47C8FF;
        
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(71, 200, 255, 0.05);
          pointer-events: none;
        }
      }
      
      .alarm-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        background: rgba(6, 30, 65, 0.8);
        color: #fff;
        font-size: 18px;
        flex-shrink: 0;
      }
      
      .alarm-content {
        flex: 1;
        
        .alarm-title {
          font-size: 14px;
          font-weight: 500;
          color: #d5f1f8;
          margin-bottom: 3px;
        }
        
        .alarm-desc {
          font-size: 12px;
          color: rgba(213, 241, 248, 0.7);
          margin-bottom: 3px;
        }
        
        .alarm-time {
          font-size: 11px;
          color: rgba(213, 241, 248, 0.5);
        }
      }
      
      .alarm-level {
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 11px;
        font-weight: 500;
        flex-shrink: 0;
        
        &.level-high {
          background: rgba(255, 83, 112, 0.2);
          color: #FF5370;
        }
        
        &.level-medium {
          background: rgba(255, 186, 90, 0.2);
          color: #FFBA5A;
        }
        
        &.level-low {
          background: rgba(71, 200, 255, 0.2);
          color: #47C8FF;
        }
      }
    }
  }
  
  .no-alarm {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgba(213, 241, 248, 0.5);
    
    i {
      font-size: 48px;
      margin-bottom: 15px;
      color: #23fdc0;
    }
    
    p {
      font-size: 16px;
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 83, 112, 0.4);
  }
  70% {
    box-shadow: 0 0 0 5px rgba(255, 83, 112, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 83, 112, 0);
  }
}

@font-face {
  font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_2952240_0hf6c1bkzgw.woff2') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-temperature-warning:before {
  content: "\e644";
}

.icon-humidity-warning:before {
  content: "\e645";
}

.icon-soil-warning:before {
  content: "\e646";
}

.icon-co2-warning:before {
  content: "\e647";
}

.icon-light-warning:before {
  content: "\e648";
}

.icon-wind-warning:before {
  content: "\e649";
}

.icon-warning:before {
  content: "\e650";
}

.icon-check-circle:before {
  content: "\e77d";
}
</style> 
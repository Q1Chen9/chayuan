<template>
  <div class="soil-params">
    <div class="params-container">
      <div class="params-header">
        <div class="header-title">
          <i class="fas fa-seedling"></i>
          <span>土壤养分监测</span>
        </div>
        <div class="header-time">更新时间: {{ currentTime }}</div>
      </div>
      
      <div class="content-layout">
        <div class="health-score">
          <div class="score-content">
            <div class="score-label">土壤健康指数</div>
            <div class="score-value">85</div>
            <div class="score-unit">/100</div>
            <div class="score-status">健康状态良好</div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, #23fdc0, #47C8FF)"></div>
            </div>
            <div class="score-tips">
              <div class="status-list">
                <div class="status-item">
                  <i class="status-dot" style="background: #23fdc0"></i>
                  <span>正常</span>
                </div>
                <div class="status-item">
                  <i class="status-dot" style="background: #FFBA5A"></i>
                  <span>警告</span>
                </div>
                <div class="status-item">
                  <i class="status-dot" style="background: #FF5370"></i>
                  <span>异常</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="params-grid">
          <div class="param-item" v-for="(item, index) in soilParams" :key="index">
            <div class="param-icon-container">
              <div class="param-icon" :class="item.class">
                <i :class="item.icon"></i>
              </div>
            </div>
            
            <div class="param-content">
              <div class="param-title">{{ item.title }} <span class="param-subtitle">({{ item.subtitle }})</span></div>
              <div class="param-value">
                {{ item.value }}<span class="unit">{{ item.unit }}</span>
                <span class="param-status" :class="getStatusClass(item)">{{ getStatusText(item) }}</span>
              </div>
              
              <div class="gauge-container">
                <div class="gauge-wrapper">
                  <div
                    class="gauge-fill"
                    :style="{
                      width: getPercentage(item) + '%',
                      background: getGradient(item)
                    }"
                  ></div>
                  <div class="gauge-markers">
                    <div
                      v-for="n in 5"
                      :key="n"
                      class="marker"
                      :style="{ left: (n - 1) * 25 + '%' }"
                    ></div>
                  </div>
                </div>
                <div class="gauge-scale">
                  <span class="min-value">{{ item.min }}</span>
                  <span class="max-value">{{ item.max }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="params-footer">
        <div class="params-note">
          <i class="fas fa-info-circle"></i>
          <span>土壤养分含量适宜，PH值略偏高，建议施用硫磺酸化调节剂优化土壤环境</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import dayjs from 'dayjs';

const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
const healthIndex = ref(85);
const soilParams = ref([
  {
    title: "氮含量",
    subtitle: "有效态",
    value: "128",
    unit: "mg/kg",
    min: "50",
    max: "200",
    ideal: { min: 100, max: 150 },
    warning: { min: 80, max: 180 },
    icon: "fas fa-leaf",
    class: "nitrogen"
  },
  {
    title: "磷含量",
    subtitle: "有效态",
    value: "35.4",
    unit: "mg/kg",
    min: "10",
    max: "60",
    ideal: { min: 30, max: 45 },
    warning: { min: 20, max: 55 },
    icon: "fas fa-atom",
    class: "phosphorus"
  },
  {
    title: "钾含量",
    subtitle: "速效态",
    value: "185",
    unit: "mg/kg",
    min: "100",
    max: "300",
    ideal: { min: 150, max: 250 },
    warning: { min: 120, max: 280 },
    icon: "fas fa-tint",
    class: "potassium"
  },
  {
    title: "PH值",
    subtitle: "酸碱度",
    value: "7.6",
    unit: "",
    min: "5.0",
    max: "9.0",
    ideal: { min: 6.0, max: 7.0 },
    warning: { min: 5.5, max: 8.0 },
    icon: "fas fa-flask",
    class: "ph"
  }
]);

let timer = null;

const updateData = () => {
  currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
  
  soilParams.value = soilParams.value.map(param => {
    let value = parseFloat(param.value);
    const min = parseFloat(param.min);
    const max = parseFloat(param.max);
    const range = max - min;
    
    // Simulate smaller, more realistic fluctuations
    const change = (Math.random() - 0.5) * (range * 0.02); 
    value += change;
    
    // Ensure value stays within bounds
    value = Math.max(min, Math.min(max, value));
    
    return {
      ...param,
      value: param.unit === 'mg/kg' ? Math.round(value) : value.toFixed(1)
    };
  });

  // Recalculate health index based on new values
  const totalScore = soilParams.value.reduce((acc, item) => {
    const value = parseFloat(item.value);
    const idealMin = item.ideal.min;
    const idealMax = item.ideal.max;
    // Simple scoring: 100 if in ideal range, 50 if in warning, 0 otherwise
    if (value >= idealMin && value <= idealMax) {
      return acc + 100;
    } else if (value >= item.warning.min && value <= item.warning.max) {
      return acc + 50;
    }
    return acc;
  }, 0);
  healthIndex.value = Math.round(totalScore / soilParams.value.length);
};

onMounted(() => {
  timer = setInterval(updateData, 2500);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const getPercentage = (item) => {
  const value = parseFloat(item.value);
  const min = parseFloat(item.min);
  const max = parseFloat(item.max);
  return ((value - min) / (max - min)) * 100;
};

const getGradient = (item) => {
  const value = parseFloat(item.value);
  
  if (value >= item.ideal.min && value <= item.ideal.max) {
    // 理想范围内
    return 'linear-gradient(90deg, #23fdc0 0%, #47C8FF 100%)';
  } else if (value >= item.warning.min && value <= item.warning.max) {
    // 警告范围内
    return 'linear-gradient(90deg, #FFBA5A 0%, #FFE45A 100%)';
  } else {
    // 超出警告范围
    return 'linear-gradient(90deg, #FF5370 0%, #ff8f70 100%)';
  }
};

const getStatusClass = (item) => {
  const value = parseFloat(item.value);
  
  if (value >= item.ideal.min && value <= item.ideal.max) {
    return 'status-ideal';
  } else if (value >= item.warning.min && value <= item.warning.max) {
    return 'status-warning';
  } else {
    return 'status-danger';
  }
};

const getStatusText = (item) => {
  const value = parseFloat(item.value);
  
  if (value >= item.ideal.min && value <= item.ideal.max) {
    return '正常';
  } else if (value >= item.warning.min && value <= item.warning.max) {
    if (value < item.ideal.min) {
      return '略低';
    } else {
      return '略高';
    }
  } else {
    if (value < item.warning.min) {
      return '偏低';
    } else {
      return '偏高';
    }
  }
};
</script>

<style lang="scss" scoped>
.soil-params {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .params-container {
    width: 100%;
    height: 100%;
    background: rgba(6, 30, 65, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(71, 200, 255, 0.3);
    box-shadow: 0 0 15px rgba(35, 253, 192, 0.1);
    display: flex;
    flex-direction: column;
    
    .params-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 12px;
      border-bottom: 1px solid rgba(71, 200, 255, 0.2);
      background: rgba(6, 30, 65, 0.7);
      height: 8%;
      min-height: 28px;
      
      .header-title {
        display: flex;
        align-items: center;
        
        i {
          font-size: 16px;
          color: #23fdc0;
          margin-right: 8px;
        }
        
        span {
          font-size: 14px;
          font-weight: 500;
          color: #d5f1f8;
        }
      }
      
      .header-time {
        font-size: 11px;
        color: rgba(213, 241, 248, 0.6);
      }
    }
    
    .content-layout {
      flex: 1;
      display: flex;
      height: 84%;
      
      .health-score {
        width: 25%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid rgba(71, 200, 255, 0.2);
        position: relative;
        padding: 0 10px;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(35, 253, 192, 0.05) 0%, rgba(6, 30, 65, 0) 70%);
          pointer-events: none;
        }
        
        .score-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
        
        .score-label {
          font-size: 13px;
          color: rgba(213, 241, 248, 0.8);
          margin-bottom: 8px;
          text-align: center;
        }
        
        .score-value {
          font-size: 72px;
          font-weight: 700;
          line-height: 1;
          background: linear-gradient(to bottom, #23fdc0, #00e1ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 20px rgba(35, 253, 192, 0.3);
          margin-bottom: 0;
          position: relative;
        }
        
        .score-unit {
          font-size: 15px;
          color: rgba(213, 241, 248, 0.7);
          margin-top: 2px;
        }
        
        .score-status {
          font-size: 13px;
          font-weight: 500;
          color: #23fdc0;
          margin-top: 5px;
          margin-bottom: 8px;
        }
        
        .progress-bar {
          width: 75%;
          height: 5px;
          background: rgba(213, 241, 248, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 10px;
          
          .progress-fill {
            height: 100%;
            border-radius: 3px;
            width: 85%;
          }
        }
        
        .score-tips {
          margin-top: 10px;
          
          .status-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            
            .status-item {
              display: flex;
              align-items: center;
              margin: 0 4px;
              
              .status-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                margin-right: 4px;
              }
              
              span {
                font-size: 10px;
                color: rgba(213, 241, 248, 0.7);
              }
            }
          }
        }
      }
      
      .params-grid {
        flex: 1;
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-gap: 8px;
        
        .param-item {
          background: rgba(6, 30, 65, 0.4);
          border-radius: 6px;
          padding: 8px;
          transition: all 0.3s ease;
          border: 1px solid rgba(71, 200, 255, 0.2);
          display: flex;
          flex-direction: column;
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 0 10px rgba(35, 253, 192, 0.1);
          }
          
          .param-icon-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 6px 0;
            
            .param-icon {
              width: 44px;
              height: 44px;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 22px;
              color: #fff;
              background: url("../../../assets/iconbg.png") no-repeat;
              background-size: 100% 100%;
              
              &.nitrogen {
                color: #47C8FF;
              }
              
              &.phosphorus {
                color: #FFBA5A;
              }
              
              &.potassium {
                color: #23fdc0;
              }
              
              &.ph {
                color: #FF5370;
              }
            }
          }
          
          .param-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            
            .param-title {
              font-size: 12px;
              color: rgba(213, 241, 248, 0.9);
              text-align: center;
              margin-bottom: 4px;
              
              .param-subtitle {
                font-size: 10px;
                color: rgba(213, 241, 248, 0.5);
              }
            }
            
            .param-value {
              font-size: 16px;
              font-weight: 600;
              color: #d5f1f8;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 5px;
              
              .unit {
                font-size: 10px;
                font-weight: normal;
                margin-left: 2px;
                color: rgba(213, 241, 248, 0.6);
              }
              
              .param-status {
                margin-left: 5px;
                font-size: 10px;
                font-weight: 500;
                padding: 1px 5px;
                border-radius: 3px;
                
                &.status-ideal {
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
            
            .gauge-container {
              margin-top: auto;
              
              .gauge-wrapper {
                background: rgba(213, 241, 248, 0.1);
                height: 4px;
                border-radius: 2px;
                margin-bottom: 3px;
                position: relative;
                overflow: hidden;
                
                .gauge-fill {
                  height: 100%;
                  border-radius: 2px;
                  transition: width 0.5s ease;
                }
                
                .gauge-markers {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  
                  .marker {
                    position: absolute;
                    top: 0;
                    width: 1px;
                    height: 100%;
                    background: rgba(213, 241, 248, 0.3);
                  }
                }
              }
              
              .gauge-scale {
                display: flex;
                justify-content: space-between;
                font-size: 9px;
                color: rgba(213, 241, 248, 0.5);
              }
            }
          }
        }
      }
    }
    
    .params-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 12px;
      background: rgba(6, 30, 65, 0.7);
      border-top: 1px solid rgba(71, 200, 255, 0.2);
      height: 8%;
      min-height: 24px;
      
      .params-note {
        display: flex;
        align-items: center;
        font-size: 11px;
        color: rgba(213, 241, 248, 0.7);
        
        i {
          color: #23fdc0;
          margin-right: 4px;
          font-size: 12px;
        }
      }
    }
  }
}
</style> 
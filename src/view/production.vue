<template>
  <div class="production">
    <top name="青芽智眸大数据智能运营平台"></top>
    <div class="production-main">
      <!-- 流程图主体 -->
      <div class="process-flow">
        <!-- 采摘步骤 -->
        <div class="process-step picking">
          <div class="step-header">
            <div class="step-icon">
              <i class="fas fa-hand-sparkles"></i>
            </div>
            <div class="step-title">采摘</div>
          </div>
          <div class="step-content">
            <div class="data-grid">
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-weight-scale"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">1,280 kg</div>
                  <div class="data-label">累计采摘重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-calendar-day"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">128 kg</div>
                  <div class="data-label">今日采摘重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <div class="card-content">
                    <div class="data-value">97.5%</div>
                    <div class="data-label">鲜叶合格率</div>
                </div>
              </div>
              <div class="data-card">
                  <div class="card-icon">
                      <i class="fas fa-tachometer-alt"></i>
                  </div>
                  <div class="card-content">
                      <div class="data-value">12.5 kg/h</div>
                      <div class="data-label">平均采摘效率</div>
                </div>
              </div>
            </div>
            <div class="chart-container trend-chart">
              <div class="chart-header">
                <i class="fas fa-chart-line"></i>
                <div class="chart-title">采摘重量趋势</div>
              </div>
              <div class="mini-chart">
                <div class="chart-bar" v-for="(value, index) in pickingTrend" :key="index" 
                     :style="{ height: value + '%', backgroundColor: getTrendColor(value, pickingTrend) }"></div>
              </div>
            </div>
            <div class="rank-list">
              <div class="list-header">
                <i class="fas fa-trophy"></i>
                <div class="rank-title">采摘工人排行</div>
              </div>
              <div class="rank-item" v-for="(worker, index) in pickingWorkers" :key="index">
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="rank-name">{{ worker.name }}</span>
                <span class="rank-value">{{ worker.value }}kg</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 摊青步骤 -->
        <div class="process-step spreading">
          <div class="step-header">
            <div class="step-icon">
              <i class="fas fa-wind"></i>
            </div>
            <div class="step-title">摊青</div>
          </div>
          <div class="step-content">
            <div class="data-grid">
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-temperature-low"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">25°C</div>
                  <div class="data-label">环境温度</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-hourglass-half"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">4.5 小时</div>
                  <div class="data-label">平均摊青时间</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-scale-balanced"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">980 kg</div>
                  <div class="data-label">生产重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-droplet-slash"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">42%</div>
                  <div class="data-label">水分蒸发率</div>
                </div>
              </div>
            </div>
            <div class="rank-list">
              <div class="list-header">
                <i class="fas fa-trophy"></i>
                <div class="rank-title">摊青工人排行</div>
              </div>
              <div class="rank-item" v-for="(worker, index) in spreadingWorkers" :key="index">
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="rank-name">{{ worker.name }}</span>
                <span class="rank-value">{{ worker.value }}m²</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 杀青步骤 -->
        <div class="process-step fixation">
          <div class="step-header">
            <div class="step-icon">
              <i class="fas fa-fire-flame-curved"></i>
            </div>
            <div class="step-title">杀青</div>
          </div>
          <div class="step-content">
            <div class="data-grid">
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-temperature-high"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">180°C</div>
                  <div class="data-label">杀青温度</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-clock"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">45 分钟</div>
                  <div class="data-label">杀青时间</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-weight-hanging"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">925 kg</div>
                  <div class="data-label">杀青重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-percent"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">95.2%</div>
                  <div class="data-label">成品率</div>
                </div>
              </div>
            </div>
            <div class="rank-list">
              <div class="list-header">
                <i class="fas fa-trophy"></i>
                <div class="rank-title">杀青工人排行</div>
              </div>
              <div class="rank-item" v-for="(worker, index) in fixationWorkers" :key="index">
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="rank-name">{{ worker.name }}</span>
                <span class="rank-value">{{ worker.value }}kg</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 回潮步骤 -->
        <div class="process-step rehydration">
          <div class="step-header">
            <div class="step-icon">
              <i class="fas fa-cloud-rain"></i>
            </div>
            <div class="step-title">回潮</div>
          </div>
          <div class="step-content">
            <div class="data-grid">
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-thermometer-half"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">22°C</div>
                  <div class="data-label">环境温度</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-droplet"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">75%</div>
                  <div class="data-label">环境湿度</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-scale-balanced"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">880 kg</div>
                  <div class="data-label">回潮重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-hourglass-half"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">2.5 小时</div>
                  <div class="data-label">回潮时间</div>
                </div>
              </div>
            </div>
            <div class="rank-list">
              <div class="list-header">
                <i class="fas fa-trophy"></i>
                <div class="rank-title">回潮工人排行</div>
              </div>
              <div class="rank-item" v-for="(worker, index) in rehydrationWorkers" :key="index">
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="rank-name">{{ worker.name }}</span>
                <span class="rank-value">{{ worker.value }}kg</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 辉锅步骤 -->
        <div class="process-step roasting">
          <div class="step-header">
            <div class="step-icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="step-title">辉锅</div>
          </div>
          <div class="step-content">
            <div class="data-grid">
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-temperature-arrow-up"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">140°C</div>
                  <div class="data-label">辉锅温度</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-stopwatch"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">35 分钟</div>
                  <div class="data-label">炒制时间</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-weight-scale"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">835 kg</div>
                  <div class="data-label">辉锅重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">7 批</div>
                  <div class="data-label">已完成批次</div>
                </div>
              </div>
            </div>
            <div class="rank-list">
              <div class="list-header">
                <i class="fas fa-trophy"></i>
                <div class="rank-title">辉锅工人排行</div>
              </div>
              <div class="rank-item" v-for="(worker, index) in roastingWorkers" :key="index">
                <span class="rank-number">{{ index + 1 }}</span>
                <span class="rank-name">{{ worker.name }}</span>
                <span class="rank-value">{{ worker.value }}kg</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 包装步骤 -->
        <div class="process-step packaging">
          <div class="step-header">
            <div class="step-icon">
              <i class="fas fa-box-archive"></i>
            </div>
            <div class="step-title">包装</div>
          </div>
          <div class="step-content">
            <div class="data-grid">
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-box-open"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">680 kg</div>
                  <div class="data-label">成品重量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-boxes-stacked"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">1,240 盒</div>
                  <div class="data-label">今日包装数量</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-gauge-high"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">92.5%</div>
                  <div class="data-label">包装效率</div>
                </div>
              </div>
              <div class="data-card">
                <div class="card-icon">
                  <i class="fas fa-check-double"></i>
                </div>
                <div class="card-content">
                  <div class="data-value">98.5%</div>
                  <div class="data-label">质检合格率</div>
                </div>
              </div>
              <div class="data-card">
                  <div class="card-icon">
                      <i class="fas fa-box"></i>
                  </div>
                  <div class="card-content">
                      <div class="data-value">0.8%</div>
                      <div class="data-label">包装破损率</div>
                  </div>
              </div>
            </div>
            <div class="grade-distribution">
              <div class="list-header">
                <i class="fas fa-ranking-star"></i>
                <div class="grade-title">茶叶分级数量</div>
              </div>
              <div class="grade-row">
                <div class="grade-item" v-for="(grade, index) in gradeData" :key="index">
                  <div class="grade-name">{{ grade.name }}</div>
                  <div class="grade-bar">
                    <div class="bar-value" :style="{ width: (grade.value / maxGradeValue * 100) + '%', background: getGradeColor(index) }"></div>
                  </div>
                  <div class="grade-value">{{ grade.value }} kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 流程连接线 -->
        <div class="process-connector-container">
          <div class="process-connector"></div>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import top from "./components/top/index.vue";

export default {
  name: 'Production',
  components: {
    top
  },
  setup() {
    // 采摘数据
    const pickingWorkers = ref([
      { name: '张师傅', value: 42 },
      { name: '李师傅', value: 38 },
      { name: '王师傅', value: 35 },
      { name: '赵师傅', value: 32 },
      { name: '刘师傅', value: 28 }
    ]);
    
    const pickingTrend = ref([45, 52, 49, 62, 57, 55, 60, 65, 58, 68, 75, 70]);
    
    // 摊青数据
    const spreadingWorkers = ref([
      { name: '陈师傅', value: 35 },
      { name: '孙师傅', value: 32 },
      { name: '周师傅', value: 28 },
      { name: '吴师傅', value: 26 },
      { name: '郑师傅', value: 24 }
    ]);
    
    // 杀青数据
    const fixationWorkers = ref([
      { name: '黄师傅', value: 185 },
      { name: '朱师傅', value: 175 },
      { name: '徐师傅', value: 165 },
      { name: '何师傅', value: 160 },
      { name: '胡师傅', value: 150 }
    ]);
    
    // 回潮数据
    const rehydrationWorkers = ref([
      { name: '高师傅', value: 170 },
      { name: '林师傅', value: 165 },
      { name: '郭师傅', value: 155 },
      { name: '马师傅', value: 145 },
      { name: '梁师傅', value: 140 }
    ]);
    
    // 辉锅数据
    const roastingWorkers = ref([
      { name: '谢师傅', value: 165 },
      { name: '唐师傅', value: 155 },
      { name: '冯师傅', value: 150 },
      { name: '于师傅', value: 145 },
      { name: '董师傅', value: 135 }
    ]);
    
    // 分级数据
    const gradeData = ref([
      { name: '特级', value: 120 },
      { name: '一级', value: 210 },
      { name: '二级', value: 180 },
      { name: '三级', value: 110 },
      { name: '四级', value: 60 }
    ]);
    
    const maxGradeValue = computed(() => {
      return Math.max(...gradeData.value.map(item => item.value));
    });
    
    // 颜色获取函数
    const getGradeColor = (index) => {
      const colors = [
        '#23fdc0',  // 特级 - 亮绿色
        '#47C8FF',  // 一级 - 亮蓝色
        '#5A66FF',  // 二级 - 蓝紫色
        '#FFBA5A',  // 三级 - 橙色
        '#FF5370'   // 四级 - 红色
      ];
      
      return colors[index] || colors[0];
    };
    
    const getTrendColor = (value, trendArray) => {
      const max = Math.max(...trendArray);
      const min = Math.min(...trendArray);
      const range = max - min;
      
      // 颜色从蓝色渐变到绿色
      const blueComponent = Math.max(0, Math.min(255, 255 - Math.floor(((value - min) / range) * 255)));
      const greenComponent = Math.max(0, Math.min(255, Math.floor(((value - min) / range) * 255)));
      
      return `rgb(71, ${greenComponent + 100}, ${blueComponent + 100})`;
    };
    
    onMounted(() => {
      // 移除远程 FontAwesome 引用
    });
    
    return {
      pickingWorkers,
      pickingTrend,
      spreadingWorkers,
      fixationWorkers,
      rehydrationWorkers,
      roastingWorkers,
      gradeData,
      maxGradeValue,
      getGradeColor,
      getTrendColor
    };
  }
}
</script>

<style lang="scss" scoped>
.production {
  width: 100%;
  position: fixed;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
  background: url("../assets/bg.jpg");
  background-size: 100% 100%;
}

.production-main {
  position: relative;
  width: 100%;
  height: calc(100% - 110px);
  margin-top: 80px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  overflow-x: auto;
}

.process-flow {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-width: 1800px;
  height: 100%;
  padding: 20px 0;
  
  /* 流程连接线容器 */
  .process-connector-container {
    position: absolute;
    left: 5%;
    right: 5%;
    top: 110px;
    height: 6px;
    z-index: 0;
    
    .process-connector {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        rgba(71, 200, 255, 0.2), 
        rgba(71, 200, 255, 0.7),
        rgba(35, 253, 192, 0.7),
        rgba(35, 253, 192, 0.2)
      );
      border-radius: 3px;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          90deg,
          transparent,
          transparent 15px,
          rgba(255, 255, 255, 0.4) 15px,
          rgba(255, 255, 255, 0.4) 20px
        );
        border-radius: 3px;
        animation: flow-animation 30s linear infinite;
      }
    }
  }
  
  .process-step {
    position: relative;
    width: 15%;
    height: 65vh;
    margin: 20px 0.5%;
    background: rgba(6, 30, 65, 0.8);
    border: 1px solid rgba(71, 200, 255, 0.3);
    border-radius: 12px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    z-index: 1;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
    }
    
    .step-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid rgba(71, 200, 255, 0.3);
      background: rgba(6, 30, 65, 0.5);
      
      .step-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(35, 253, 192, 0.15);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 12px;
        box-shadow: 0 0 15px rgba(35, 253, 192, 0.3);
        
        i {
          font-size: 30px;
          color: #23fdc0;
        }
      }
      
      .step-title {
        font-size: 24px;
        font-weight: bold;
        color: #d5f1f8;
        text-shadow: 0 0 10px rgba(35, 253, 192, 0.5);
      }
    }
    
    .step-content {
      padding: 15px;
      height: calc(100% - 120px);
      overflow-y: auto;
      
      /* 滚动条样式 */
      &::-webkit-scrollbar {
        width: 4px;
      }
      
      &::-webkit-scrollbar-track {
        background: rgba(213, 241, 248, 0.1);
      }
      
      &::-webkit-scrollbar-thumb {
        background: rgba(71, 200, 255, 0.5);
        border-radius: 2px;
      }
      
      .data-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 15px;
      }
      
      .data-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        
        .data-card {
          width: 48%;
          padding: 12px;
          background: rgba(71, 200, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(71, 200, 255, 0.2);
          position: relative;
          
          .card-icon {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 22px;
            height: 22px;
            border-radius: 4px;
            background: rgba(16, 130, 90, 0.2);
            display: flex;
            justify-content: center;
            align-items: center;
            
            i {
              font-size: 12px;
              color: #106b4a;
            }
          }
          
          .card-content {
            width: 100%;
            padding-right: 24px;
            
            .data-value {
              font-size: 18px;
              font-weight: bold;
              color: #d5f1f8;
              margin-bottom: 5px;
            }
            
            .data-label {
              font-size: 12px;
              color: rgba(213, 241, 248, 0.6);
            }
          }
        }
      }
      
      .chart-container {
        margin-bottom: 15px;
        background: rgba(6, 30, 65, 0.3);
        border-radius: 8px;
        padding: 12px;
        border: 1px solid rgba(71, 200, 255, 0.15);
        
        .chart-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          
          i {
            font-size: 16px;
            color: #106b4a;
            margin-right: 8px;
          }
          
          .chart-title {
            font-size: 14px;
            color: #d5f1f8;
            font-weight: 600;
          }
        }
        
        &.trend-chart {
          .mini-chart {
            height: 70px;
            display: flex;
            align-items: flex-end;
            background: rgba(6, 30, 65, 0.5);
            border-radius: 4px;
            padding: 5px;
            
            .chart-bar {
              flex: 1;
              margin: 0 1px;
              background: #47C8FF;
              min-height: 1px;
              transition: height 0.3s ease;
            }
          }
        }
      }
      
      .list-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        
        i {
          font-size: 16px;
          color: #106b4a;
          margin-right: 8px;
        }
        
        .rank-title, .grade-title {
          font-size: 14px;
          color: #d5f1f8;
          font-weight: 600;
        }
      }
      
      .rank-list {
        background: rgba(6, 30, 65, 0.3);
        border-radius: 8px;
        padding: 12px;
        border: 1px solid rgba(71, 200, 255, 0.15);
        margin-bottom: 15px;
        
        .rank-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dashed rgba(71, 200, 255, 0.2);
          
          &:last-child {
            border-bottom: none;
          }
          
          .rank-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(16, 130, 90, 0.1);
            color: #106b4a;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            margin-right: 10px;
            flex-shrink: 0;
          }
          
          .rank-name {
            flex: 1;
            font-size: 12px;
            color: rgba(213, 241, 248, 0.8);
          }
          
          .rank-value {
            font-size: 12px;
            color: #23fdc0;
            font-weight: bold;
          }
        }
      }
      
      .grade-distribution {
        background: rgba(6, 30, 65, 0.3);
        border-radius: 8px;
        padding: 12px;
        border: 1px solid rgba(71, 200, 255, 0.15);
        margin-bottom: 15px;
        
        .grade-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          
          .grade-name {
            width: 32px;
            font-size: 12px;
            color: rgba(213, 241, 248, 0.8);
            margin-right: 8px;
          }
          
          .grade-bar {
            flex: 1;
            height: 8px;
            background: rgba(213, 241, 248, 0.1);
            border-radius: 4px;
            margin-right: 8px;
            overflow: hidden;
            
            .bar-value {
              height: 100%;
              border-radius: 4px;
            }
          }
          
          .grade-value {
            width: 50px;
            font-size: 12px;
            color: #d5f1f8;
            text-align: right;
          }
        }
      }
    }
    
    /* 为每个步骤设置不同的图标颜色 */
    &.picking .step-icon {
      background: rgba(35, 253, 192, 0.15);
      i { color: #23fdc0; }
    }
    
    &.spreading .step-icon {
      background: rgba(71, 200, 255, 0.15);
      i { color: #47C8FF; }
    }
    
    &.fixation .step-icon {
      background: rgba(255, 83, 112, 0.15);
      i { color: #FF5370; }
    }
    
    &.rehydration .step-icon {
      background: rgba(90, 102, 255, 0.15);
      i { color: #5A66FF; }
    }
    
    &.roasting .step-icon {
      background: rgba(255, 186, 90, 0.15);
      i { color: #FFBA5A; }
    }
    
    &.packaging .step-icon {
      background: rgba(166, 108, 255, 0.15);
      i { color: #A66CFF; }
    }
  }
}

.footerbg {
  background: url("../assets/footerbg.png") no-repeat;
  width: 1824px;
  height: 28px;
  background-size: 100% 100%;
  position: fixed;
  bottom: 10px;
}

@keyframes flow-animation {
  from { background-position: 0 0; }
  to { background-position: 100px 0; }
}

/* 移动端适配 */
@media (max-width: 1600px) {
  .process-flow {
    overflow-x: auto;
    justify-content: flex-start;
    
    .process-step {
      min-width: 280px;
      margin: 20px 10px;
      
      &:first-child {
        margin-left: 20px;
      }
      
      &:last-child {
        margin-right: 20px;
      }
    }
  }
}
</style> 
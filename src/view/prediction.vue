<template>
  <div class="prediction-page">
    <top name="青芽智眸大数据智能运营平台"></top>
    <div class="main-content">
      <!-- Left Column -->
      <div class="column left-column">
        <div class="card warning-list-card">
          <div class="card-header">
            <i class="fas fa-triangle-exclamation"></i>
            <h3>实时预警</h3>
          </div>
          <ul class="warning-list">
            <li v-for="warning in pestWarnings" :key="warning.id" :class="getWarningClass(warning.level)">
              <div class="warning-header">
                <span class="warning-level">{{ warning.level }}</span>
                <span class="warning-name">{{ warning.name }}</span>
              </div>
              <div class="warning-details">
                <span><i class="fas fa-location-dot"></i> {{ warning.area }}</span>
                <span><i class="fas fa-clock"></i> {{ warning.time }}</span>
              </div>
              <div class="warning-suggestion">
                <i class="fas fa-lightbulb"></i> {{ warning.suggestion }}
              </div>
            </li>
          </ul>
        </div>
        <div class="card user-ranking-card">
          <div class="card-header">
            <i class="fas fa-users"></i>
            <h3>用户检测排行</h3>
          </div>
          <ul class="user-list">
            <li v-for="(user, index) in userDetections" :key="user.name">
              <span class="rank-number">{{ index + 1 }}</span>
              <span class="user-name">{{ user.name }}</span>
              <span class="detection-count">{{ user.count }} 次</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Center Column -->
      <div class="column center-column">
        <div class="card trend-chart-card">
          <div class="card-header">
            <i class="fas fa-chart-line"></i>
            <h3>近7日病虫害检测趋势</h3>
          </div>
          <DetectionTrendChart :chartData="detectionTrend" />
        </div>
        <div class="card pest-distribution-chart-card">
          <div class="card-header">
            <i class="fas fa-chart-pie"></i>
            <h3>病虫害种类分布</h3>
          </div>
          <PestDistributionChart :chartData="pestDistribution" />
        </div>
      </div>

      <!-- Right Column -->
      <div class="column right-column">
        <div class="card severity-chart-card">
          <div class="card-header">
            <i class="fas fa-shield-halved"></i>
            <h3>预警严重等级</h3>
          </div>
          <SeverityLevelChart :chartData="severityStats" />
        </div>
        <div class="card quick-actions-card">
          <div class="card-header">
            <i class="fas fa-bolt"></i>
            <h3>快速操作</h3>
          </div>
          <div class="action-buttons">
            <button class="action-btn"><i class="fas fa-plus"></i> 新建监测任务</button>
            <button class="action-btn"><i class="fas fa-file-export"></i> 导出预警报告</button>
            <button class="action-btn"><i class="fas fa-bell"></i> 推送预警通知</button>
            <button class="action-btn"><i class="fas fa-gear"></i> 管理预警规则</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import top from "./components/top/index.vue";
import PestDistributionChart from './components/prediction/PestDistributionChart.vue';
import SeverityLevelChart from './components/prediction/SeverityLevelChart.vue';
import DetectionTrendChart from './components/prediction/DetectionTrendChart.vue';

export default {
  name: 'Prediction',
  components: {
    top,
    PestDistributionChart,
    SeverityLevelChart,
    DetectionTrendChart,
  },
  setup() {
    const pestWarnings = ref([
      { id: 1, name: '藻斑病', level: '紧急', area: 'A1区', time: '2分钟前', suggestion: '立即隔离A1区，并采用石硫合剂进行全面喷洒。' },
      { id: 2, name: '茶盲蝽', level: '高', area: 'B3区', time: '15分钟前', suggestion: '使用杀虫灯诱杀，并喷洒高效氯氰菊酯。' },
      { id: 3, name: '褐枯病', level: '高', area: 'A2区', time: '30分钟前', suggestion: '剪除病枝，集中烧毁，喷洒70%甲基托布津。' },
      { id: 4, name: '赤叶枯病', level: '中', area: 'C1区', time: '1小时前', suggestion: '增施有机肥，改善通风，喷洒50%多菌灵。' },
      { id: 5, name: '灰枯病', level: '中', area: 'D4区', time: '2小时前', suggestion: '清除落叶，减少病源，喷洒波尔多液。' },
      { id: 6, name: '藻斑病', level: '低', area: 'B2区', time: '3小时前', suggestion: '注意观察，保持茶园干燥，暂不需用药。' },
    ]);

    const userDetections = ref([
      { name: '王农艺师', count: 128 },
      { name: '李技术员', count: 97 },
      { name: '张操作员', count: 85 },
      { name: '赵监测员', count: 72 },
      { name: '孙巡查员', count: 66 },
    ]);

    const pestDistribution = ref([
      { name: '藻斑病', percentage: 25, color: '#FF5370' },
      { name: '褐枯病', percentage: 20, color: '#FFBA5A' },
      { name: '灰枯病', percentage: 15, color: '#5A66FF' },
      { name: '健康', percentage: 10, color: '#23fdc0' },
      { name: '茶盲蝽', percentage: 18, color: '#47C8FF' },
      { name: '赤叶枯病', percentage: 12, color: '#A66CFF' },
    ]);
    
    const severityStats = ref([
      { name: '紧急', count: 5, color: '#FF5370' },
      { name: '高', count: 12, color: '#FFBA5A' },
      { name: '中', count: 34, color: '#47C8FF' },
      { name: '低', count: 58, color: '#23fdc0' },
    ]);

    const detectionTrend = ref({
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      values: [120, 132, 101, 134, 90, 230, 210],
    });

    const getWarningClass = (level) => {
      switch (level) {
        case '紧急': return 'level-critical';
        case '高': return 'level-high';
        case '中': return 'level-medium';
        case '低': return 'level-low';
        default: return '';
      }
    };

    onMounted(() => {
      // Future logic for fetching data or initializing charts
    });
    
    return {
      pestWarnings,
      userDetections,
      pestDistribution,
      severityStats,
      detectionTrend,
      getWarningClass,
    };
  }
}
</script>

<style lang="scss" scoped>
.prediction-page {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  background: url("../assets/bg.jpg") no-repeat center center;
  background-size: cover;
  color: #d5f1f8;
  font-family: 'PingFang SC', sans-serif;
}

.main-content {
  flex-grow: 1;
  display: grid;
  grid-template-columns: 3fr 5fr 3fr;
  gap: 15px;
  padding: 80px 15px 20px;
  margin-top: 20px;
  overflow: hidden;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: calc(100vh - 150px);
}

.card {
  background: rgba(6, 30, 65, 0.8);
  border: 1px solid rgba(71, 200, 255, 0.3);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(71, 200, 255, 0.2);
    flex-shrink: 0;

    i {
      font-size: 22px;
      color: #23fdc0;
      margin-right: 12px;
      text-shadow: 0 0 10px rgba(35, 253, 192, 0.5);
    }

    h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: #d5f1f8;
    }
  }
}

.warning-list-card, .user-ranking-card, .trend-chart-card, .pest-distribution-chart-card, .severity-chart-card, .quick-actions-card {
  flex: 1;
}

.warning-list {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: rgba(213, 241, 248, 0.1); }
  &::-webkit-scrollbar-thumb { background: rgba(71, 200, 255, 0.5); border-radius: 2px; }

  li {
    padding: 12px;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 4px solid;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(71, 200, 255, 0.1);
    }
    
    .warning-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .warning-level {
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
    .warning-name { font-size: 16px; font-weight: 500; }
    .warning-details {
      font-size: 12px;
      color: rgba(213, 241, 248, 0.7);
      display: flex;
      justify-content: space-between;
      i { margin-right: 5px; }
    }

    .warning-suggestion {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px dashed rgba(71, 200, 255, 0.2);
      font-size: 13px;
      color: rgba(35, 253, 192, 0.9);
      line-height: 1.4;
      i {
        margin-right: 5px;
        color: #FFBA5A;
      }
    }
  }
  .level-critical { border-color: #FF5370; .warning-level { background: rgba(255, 83, 112, 0.2); color: #FF5370; } }
  .level-high { border-color: #FFBA5A; .warning-level { background: rgba(255, 186, 90, 0.2); color: #FFBA5A; } }
  .level-medium { border-color: #47C8FF; .warning-level { background: rgba(71, 200, 255, 0.2); color: #47C8FF; } }
  .level-low { border-color: #23fdc0; .warning-level { background: rgba(35, 253, 192, 0.2); color: #23fdc0; } }
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  height: 100%;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: rgba(213, 241, 248, 0.1); }
  &::-webkit-scrollbar-thumb { background: rgba(71, 200, 255, 0.5); border-radius: 2px; }

  li {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px dashed rgba(71, 200, 255, 0.2);
    &:last-child { border-bottom: none; }

    .rank-number {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: rgba(35, 253, 192, 0.1);
      color: #23fdc0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin-right: 15px;
      flex-shrink: 0;
    }
    .user-name { flex: 1; font-size: 14px; color: rgba(213, 241, 248, 0.9); }
    .detection-count { font-size: 14px; color: #47C8FF; font-weight: bold; }
  }
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  .action-btn {
    background-color: rgba(71, 200, 255, 0.1);
    border: 1px solid rgba(71, 200, 255, 0.3);
    color: #d5f1f8;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s, border-color 0.3s;
    font-size: 14px;
    
    i {
      margin-right: 8px;
    }

    &:hover {
      background-color: rgba(71, 200, 255, 0.2);
      border-color: #47C8FF;
    }
  }
}

.footerbg {
  background: url("../assets/footerbg.png") no-repeat;
  width: 100%;
  height: 28px;
  background-size: 100% 100%;
  position: absolute;
  bottom: 10px;
  left:0;
}
</style> 
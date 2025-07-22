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
                <span><i class="fas fa-clock"></i> {{ formatTime(warning.time) }}</span>
              </div>
              <div class="warning-suggestion" @click="showFullSuggestion(warning.suggestion, $event)">
                <i class="fas fa-lightbulb"></i> {{ stripMarkdown(warning.suggestion) }}
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
            <h3>病虫害与茶叶分级分布</h3>
            <div class="chart-totals">
              <span>病虫害总数: {{ pestTotal }}</span>
              <span>茶叶分级检测总数: {{ leafGradeTotal }}</span>
            </div>
          </div>
          <div class="chart-row">
            <PestDistributionChart :chartData="pestDistribution" />
            <LeafGradeChart :chartData="leafGradeStats" />
          </div>
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
            <button class="action-btn" @click="newMonitoringTask"><i class="fas fa-plus"></i> 新建监测任务</button>
            <button class="action-btn" @click="exportWarningReport"><i class="fas fa-file-export"></i> 导出预警报告</button>
            <button class="action-btn" @click="pushWarningNotification"><i class="fas fa-bell"></i> 推送预警通知</button>
            <button class="action-btn" @click="manageWarningRules"><i class="fas fa-gear"></i> 管理预警规则</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
    <Pop :show="showPopup" :content="popupContent" @close="showPopup = false" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import top from "./components/top/index.vue";
import PestDistributionChart from './components/prediction/PestDistributionChart.vue';
import SeverityLevelChart from './components/prediction/SeverityLevelChart.vue';
import DetectionTrendChart from './components/prediction/DetectionTrendChart.vue';
import LeafGradeChart from './components/prediction/LeafGradeChart.vue';
import Pop from '../components/pop/pop.vue';

export default {
  name: 'Prediction',
  components: {
    top,
    PestDistributionChart,
    SeverityLevelChart,
    DetectionTrendChart,
    LeafGradeChart,
    Pop,
  },
  setup() {
    const pestWarnings = ref([]);
    const userDetections = ref([]);
    const pestDistribution = ref([]);
    const severityStats = ref([]);
    const leafGradeStats = ref([]);
    const pestTotal = ref(0);
    const leafGradeTotal = ref(0);
    const showPopup = ref(false);
    const popupContent = ref('');
    const detectionTrend = ref({
      labels: [],
      values: [],
    });

    const fetchData = async () => {
      try {
        const warningsRes = await axios.get('http://localhost:3000/api/warnings');
        pestWarnings.value = warningsRes.data;

        const userDetectionsRes = await axios.get('http://localhost:3000/api/user-detections');
        userDetections.value = userDetectionsRes.data;

        const pestDistributionRes = await axios.get('http://localhost:3000/api/pest-distribution');
        pestDistribution.value = pestDistributionRes.data.distribution;
        pestTotal.value = pestDistributionRes.data.total;

        const severityStatsRes = await axios.get('http://localhost:3000/api/severity-stats');
        severityStats.value = severityStatsRes.data;
        
        const trendRes = await axios.get('http://localhost:3000/api/detection-trend');
        detectionTrend.value = trendRes.data;

        const leafGradeRes = await axios.get('http://localhost:3000/api/leaf-grade-stats');
        leafGradeStats.value = leafGradeRes.data.stats;
        leafGradeTotal.value = leafGradeRes.data.total;

      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    const getWarningClass = (level) => {
      switch (level) {
        case '紧急': return 'level-critical';
        case '高': return 'level-high';
        case '中': return 'level-medium';
        case '低': return 'level-low';
        default: return '';
      }
    };
    
    const formatTime = (timeString) => {
      const date = new Date(timeString);
      const now = new Date();
      const diff = Math.abs(now - date);
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes}分钟前`;
      if (hours < 24) return `${hours}小时前`;
      return date.toLocaleDateString();
    }

    const showFullSuggestion = (suggestion, event) => {
      popupContent.value = suggestion;
      showPopup.value = true;
    };

    const stripMarkdown = (text) => {
      if (!text) return '暂无建议';
      return text
        .replace(/#{1,4}\s?/g, '') // remove hash-based headers
        .replace(/\*\*/g, '')      // remove bold
        .replace(/\*/g, '')       // remove italic
        .replace(/-\s/g, '')       // remove list dashes
        .replace(/`/g, '')        // remove backticks
        .replace(/\\n/g, ' ')     // replace escaped newlines with space
        .replace(/\n/g, ' ');      // replace newlines with space
    };

    const newMonitoringTask = () => {
      console.log('"新建监测任务" button clicked. Implementation pending.');
      alert('“新建监测任务”功能正在开发中。');
    };

    const exportWarningReport = () => {
      let reportContent = "实时预警报告\n\n";
      reportContent += "========================================\n\n";
      
      pestWarnings.value.forEach(warning => {
        reportContent += `预警名称: ${warning.name}\n`;
        reportContent += `预警等级: ${warning.level}\n`;
        reportContent += `发生区域: ${warning.area}\n`;
        reportContent += `发生时间: ${warning.time}\n`;
        reportContent += `处理建议: ${warning.suggestion}\n`;
        reportContent += "----------------------------------------\n";
      });

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `预警报告-${new Date().toISOString().split('T')[0]}.txt`;
      link.click();
      URL.revokeObjectURL(link.href);
    };

    const pushWarningNotification = () => {
      if (pestWarnings.value.length > 0) {
        const latestWarning = pestWarnings.value[0];
        alert(`新预警通知:\n\n名称: ${latestWarning.name}\n等级: ${latestWarning.level}\n区域: ${latestWarning.area}`);
      } else {
        alert("当前无新预警。");
      }
    };

    const manageWarningRules = () => {
      console.log('"管理预警规则" button clicked. Implementation pending.');
      alert('“管理预警规则”功能正在开发中。');
    };


    onMounted(() => {
      fetchData();
    });
    
    return {
      pestWarnings,
      userDetections,
      pestDistribution,
      severityStats,
      detectionTrend,
      getWarningClass,
      formatTime,
      leafGradeStats,
      newMonitoringTask,
      exportWarningReport,
      pushWarningNotification,
      manageWarningRules,
      stripMarkdown,
      showPopup,
      popupContent,
      showFullSuggestion,
      pestTotal,
      leafGradeTotal,
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
      flex-grow: 1;
    }
  }
}

.chart-totals {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #aaccdd;
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
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: normal;
      cursor: pointer;
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

.pest-distribution-chart-card .chart-row {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.pest-distribution-chart-card .chart-row > * {
  flex: 1;
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
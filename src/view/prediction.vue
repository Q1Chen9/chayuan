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
              <div 
                class="warning-suggestion" 
                :class="{ 'expanded': expandedSuggestionId === warning.id }"
                @click="toggleSuggestion(warning.id)"
              >
                <i class="fas fa-lightbulb"></i> 
                {{ stripMarkdown(warning.suggestion) }}
              </div>
            </li>
          </ul>
        </div>
        <div class="card user-ranking-card">
          <div class="card-header">
            <i class="fas fa-users"></i>
            <h3>用户检测排行</h3>
          </div>
          <UserRankingChart :chartData="userDetections" />
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
            <button class="action-btn" @click="activeModal = 'newTask'"><i class="fas fa-plus"></i> 新建监测任务</button>
            <button class="action-btn" @click="activeModal = 'exportReport'"><i class="fas fa-file-export"></i> 导出预警报告</button>
            <button class="action-btn" @click="activeModal = 'pushNotification'"><i class="fas fa-bell"></i> 推送预警通知</button>
            <button class="action-btn" @click="activeModal = 'manageRules'"><i class="fas fa-gear"></i> 管理预警规则</button>
          </div>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
    
    <!-- Modals for Quick Actions -->
    <Modal :show="activeModal === 'newTask'" @close="activeModal = null" title="新建监测任务">
      <form @submit.prevent="submitNewTask" class="modal-form">
        <div class="form-group">
          <label for="taskName">任务名称</label>
          <input type="text" id="taskName" v-model="newTask.name" required>
        </div>
        <div class="form-group">
          <label for="taskArea">监测区域</label>
          <select id="taskArea" v-model="newTask.area" required>
            <option disabled value="">请选择区域</option>
            <option>茶园A区</option>
            <option>茶园B区</option>
            <option>茶园C区</option>
          </select>
        </div>
        <div class="form-group">
          <label for="taskType">监测类型</label>
          <select id="taskType" v-model="newTask.type" required>
            <option disabled value="">请选择类型</option>
            <option>病虫害监测</option>
            <option>茶叶分级</option>
            <option>环境监测</option>
          </select>
        </div>
        <div class="form-group">
          <label for="taskUser">指派给</label>
          <select id="taskUser" v-model="newTask.assignedUser" required>
            <option disabled value="">请选择用户</option>
            <option v-for="user in userDetections" :key="user.name" :value="user.name">{{ user.name }}</option>
          </select>
        </div>
      </form>
      <template #footer>
        <button class="btn-primary" @click="submitNewTask">创建任务</button>
      </template>
    </Modal>

    <Modal :show="activeModal === 'exportReport'" @close="activeModal = null" title="导出预警报告">
      <p>请选择您想导出的报告格式：</p>
      <div class="export-options">
        <button class="export-btn" @click="exportWarningReport('txt')">.txt 格式</button>
        <button class="export-btn" @click="exportWarningReport('csv')">.csv 格式</button>
      </div>
      <template #footer></template> <!-- Hide default footer -->
    </Modal>
    
    <Modal :show="activeModal === 'pushNotification'" @close="activeModal = null" title="推送预警通知">
      <div v-if="pestWarnings.length > 0">
        <p>将向所有相关人员推送以下最新紧急预警：</p>
        <div class="notification-content">
          <strong>{{ pestWarnings[0].name }} ({{ pestWarnings[0].level }})</strong>
          <p><i class="fas fa-location-dot"></i> {{ pestWarnings[0].area }}</p>
          <p><i class="fas fa-clock"></i> {{ formatTime(pestWarnings[0].time) }}</p>
        </div>
      </div>
      <div v-else>
        <p>当前没有新的预警信息可以推送。</p>
      </div>
      <template #footer>
        <button v-if="pestWarnings.length > 0" class="btn-primary" @click="confirmPushNotification">确认推送</button>
        <button v-else class="btn-primary" @click="activeModal = null">关闭</button>
      </template>
    </Modal>
    
    <Modal :show="activeModal === 'manageRules'" @close="activeModal = null" title="管理预警规则">
      <div class="rules-management-container">
        <!-- Threshold Settings -->
        <div class="rules-section">
          <h4 class="rules-header">
            <i class="fas fa-tachometer-alt"></i> 预警等级阈值
          </h4>
          <div class="modal-form">
            <div class="threshold-settings">
              <div class="form-group">
                <label for="critical-threshold">紧急 ( > )</label>
                <input type="number" id="critical-threshold" v-model.number="warningSettings.warningThresholds.critical">
              </div>
              <div class="form-group">
                <label for="high-threshold">高 ( > )</label>
                <input type="number" id="high-threshold" v-model.number="warningSettings.warningThresholds.high">
              </div>
              <div class="form-group">
                <label for="medium-threshold">中 ( > )</label>
                <input type="number" id="medium-threshold" v-model.number="warningSettings.warningThresholds.medium">
              </div>
              <div class="form-group">
                <label>低</label>
                <span class="threshold-value">( &lt;= {{ warningSettings.warningThresholds.medium }} )</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Rules -->
        <div class="rules-section">
          <h4 class="rules-header">
            <i class="fas fa-bell"></i> 通知规则与人员
          </h4>
          <div class="notification-rules">
            <div class="rule-item" v-for="rule in warningSettings.notificationRules" :key="rule.condition">
              <div class="rule-main">
                <span class="rule-condition">当 <strong>{{ rule.condition }}</strong> 预警时</span>
                <span class="rule-action">执行: <strong>{{ rule.action }}</strong></span>
                <button class="btn-toggle" :class="{ active: rule.enabled }" @click="rule.enabled = !rule.enabled">
                  {{ rule.enabled ? '已启用' : '已禁用' }}
                </button>
              </div>
              <div class="rule-users">
                <label>通知人员:</label>
                <div class="user-tags">
                  <span v-for="user in rule.assignedUsers" :key="user" class="user-tag">
                    {{ user }} <i class="fas fa-times" @click="removeUserFromRule(rule, user)"></i>
                  </span>
                </div>
                <div class="user-assignment">
                  <select v-model="selectedUser[rule.condition]">
                    <option value="">添加用户</option>
                    <option v-for="user in availableUsers(rule)" :key="user.name" :value="user.name">{{ user.name }}</option>
                  </select>
                  <button @click="addUserToRule(rule, selectedUser[rule.condition])" :disabled="!selectedUser[rule.condition]">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-primary" @click="saveWarningSettings">保存设置</button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import top from "./components/top/index.vue";
import PestDistributionChart from './components/prediction/PestDistributionChart.vue';
import SeverityLevelChart from './components/prediction/SeverityLevelChart.vue';
import DetectionTrendChart from './components/prediction/DetectionTrendChart.vue';
import LeafGradeChart from './components/prediction/LeafGradeChart.vue';
import UserRankingChart from './components/prediction/UserRankingChart.vue';
import Modal from '../components/common/Modal.vue';

export default {
  name: 'Prediction',
  components: {
    top,
    PestDistributionChart,
    SeverityLevelChart,
    DetectionTrendChart,
    LeafGradeChart,
    UserRankingChart,
    Modal,
  },
  setup() {
    const pestWarnings = ref([]);
    const userDetections = ref([]);
    const pestDistribution = ref([]);
    const severityStats = ref([]);
    const leafGradeStats = ref([]);
    const pestTotal = ref(0);
    const leafGradeTotal = ref(0);
    const activeModal = ref(null);
    const expandedSuggestionId = ref(null);
    const newTask = ref({ name: '', area: '', type: '', assignedUser: '' });
    const warningSettings = ref({
      warningThresholds: { critical: 0, high: 0, medium: 0 },
      notificationRules: [],
    });
    const selectedUser = ref({});
    
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

    const fetchWarningSettings = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/warning-settings');
        warningSettings.value = res.data;
        // Initialize selectedUser for each rule
        res.data.notificationRules.forEach(rule => {
          selectedUser.value[rule.condition] = '';
        });
      } catch (error) {
        console.error('Failed to fetch warning settings:', error);
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

    const toggleSuggestion = (warningId) => {
      if (expandedSuggestionId.value === warningId) {
        expandedSuggestionId.value = null;
      } else {
        expandedSuggestionId.value = warningId;
      }
    };

    const stripMarkdown = (text) => {
      if (!text) return '暂无建议';
      return text
        .replace(/#{1,4}\s?/g, '') // remove hash-based headers
        .replace(/\*\*/g, '')      // remove bold
        .replace(/\*/g, '')       // remove italic
        .replace(/-\s/g, '')       // remove list dashes
        .replace(/`/g, '')        // remove backticks
        .replace(/\\n/g, '\n');    // replace escaped newlines with actual newlines
    };

    const newMonitoringTask = () => {
      activeModal.value = 'newTask';
    };

    const submitNewTask = async () => {
      if (newTask.value.name && newTask.value.area && newTask.value.type && newTask.value.assignedUser) {
        try {
          await axios.post('http://localhost:3000/api/tasks', newTask.value);
          alert(`已成功创建新任务并指派给 ${newTask.value.assignedUser}`);
          newTask.value = { name: '', area: '', type: '', assignedUser: '' }; // Reset form
          activeModal.value = null;
        } catch (error) {
          console.error('Failed to create task:', error);
          alert('创建任务失败，请稍后重试。');
        }
      } else {
        alert('请填写所有任务信息。');
      }
    };

    const exportWarningReport = (format) => {
      let reportContent = "实时预警报告\n\n========================================\n\n";
      let fileExtension = 'txt';
      let mimeType = 'text/plain;charset=utf-8';

      if (format === 'csv') {
        reportContent = "预警名称,预警等级,发生区域,发生时间,处理建议\n";
        pestWarnings.value.forEach(w => {
          reportContent += `"${w.name}","${w.level}","${w.area}","${w.time}","${w.suggestion.replace(/"/g, '""')}"\n`;
        });
        fileExtension = 'csv';
        mimeType = 'text/csv;charset=utf-8';
      } else {
        pestWarnings.value.forEach(w => {
          reportContent += `预警名称: ${w.name}\n预警等级: ${w.level}\n发生区域: ${w.area}\n发生时间: ${w.time}\n处理建议: ${w.suggestion}\n----------------------------------------\n`;
      });
      }

      const blob = new Blob([reportContent], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `预警报告-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
      link.click();
      URL.revokeObjectURL(link.href);
      activeModal.value = null;
    };

    const pushWarningNotification = () => {
      activeModal.value = 'pushNotification';
    };

    const confirmPushNotification = () => {
        const latestWarning = pestWarnings.value[0];
      alert(`已向相关人员推送通知:\n\n名称: ${latestWarning.name}\n等级: ${latestWarning.level}\n区域: ${latestWarning.area}`);
      activeModal.value = null;
    };

    const manageWarningRules = () => {
      fetchWarningSettings(); // Fetch latest settings when opening modal
      activeModal.value = 'manageRules';
    };

    const saveWarningSettings = async () => {
      try {
        await axios.post('http://localhost:3000/api/warning-settings', warningSettings.value);
        alert('预警设置已保存！');
        activeModal.value = null;
      } catch (error) {
        console.error('Failed to save warning settings:', error);
        alert('保存失败，请稍后重试。');
      }
    };
    
    const availableUsers = (rule) => {
      return userDetections.value.filter(u => !rule.assignedUsers.includes(u.name));
    };

    const addUserToRule = (rule, userName) => {
      if (userName && !rule.assignedUsers.includes(userName)) {
        rule.assignedUsers.push(userName);
        selectedUser.value[rule.condition] = ''; // Reset dropdown
      }
    };

    const removeUserFromRule = (rule, userName) => {
      rule.assignedUsers = rule.assignedUsers.filter(u => u !== userName);
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
      pestTotal,
      leafGradeTotal,
      activeModal,
      newTask,
      submitNewTask,
      warningSettings,
      saveWarningSettings,
      selectedUser,
      availableUsers,
      addUserToRule,
      removeUserFromRule,
      expandedSuggestionId,
      toggleSuggestion,
      stripMarkdown,
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

      &.expanded {
        -webkit-line-clamp: unset;
        white-space: pre-wrap;
      }
    }
  }
  .level-critical { border-color: #FF5370; .warning-level { background: rgba(255, 83, 112, 0.2); color: #FF5370; } }
  .level-high { border-color: #FFBA5A; .warning-level { background: rgba(255, 186, 90, 0.2); color: #FFBA5A; } }
  .level-medium { border-color: #47C8FF; .warning-level { background: rgba(71, 200, 255, 0.2); color: #47C8FF; } }
  .level-low { border-color: #23fdc0; .warning-level { background: rgba(35, 253, 192, 0.2); color: #23fdc0; } }
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

.modal-form {
  .form-group {
    margin-bottom: 15px;
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid rgba(71, 200, 255, 0.5);
      background-color: rgba(6, 30, 65, 0.9);
      color: #d5f1f8;
      font-size: 14px;
    }
  }
}

.export-options {
  display: flex;
  gap: 15px;
  .export-btn {
    flex: 1;
    padding: 10px;
    background-color: rgba(71, 200, 255, 0.1);
    border: 1px solid rgba(71, 200, 255, 0.3);
    color: #d5f1f8;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
      background-color: rgba(71, 200, 255, 0.2);
    }
  }
}

.notification-content {
  background-color: rgba(71, 200, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  border-left: 3px solid #23fdc0;
  p {
    margin: 5px 0;
  }
}

.rules-management {
  .rule-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(71, 200, 255, 0.2);
    &:last-child {
      border-bottom: none;
    }
    .btn-toggle {
      padding: 5px 10px;
      border-radius: 15px;
      cursor: pointer;
      border: 1px solid;
      background: transparent;
      &.active {
        color: #23fdc0;
        border-color: #23fdc0;
        background-color: rgba(35, 253, 192, 0.1);
      }
      &:not(.active) {
        color: #aaccdd;
        border-color: #aaccdd;
      }
    }
  }
}

.rules-management-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rules-section {
  background: rgba(6, 30, 65, 0.7);
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(71, 200, 255, 0.2);
}

.rules-header {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  i {
    margin-right: 10px;
    color: #23fdc0;
  }
}

.threshold-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 20px;

  .form-group {
    margin-bottom: 0;
  }
  
  .threshold-value {
    display: flex;
    align-items: center;
    height: 100%;
    color: #aaccdd;
    padding-left: 10px;
  }
}

.notification-rules {
  .rule-item {
    display: flex;
    flex-direction: column;
    padding: 15px 0;
    border-bottom: 1px solid rgba(71, 200, 255, 0.2);
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }

  .rule-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .rule-condition {
    flex-basis: 30%;
  }
  .rule-action {
    flex-basis: 30%;
  }

  .btn-toggle {
    padding: 5px 10px;
    border-radius: 15px;
    cursor: pointer;
    border: 1px solid;
    background: transparent;
    font-size: 12px;
    &.active {
      color: #23fdc0;
      border-color: #23fdc0;
      background-color: rgba(35, 253, 192, 0.1);
    }
    &:not(.active) {
      color: #aaccdd;
      border-color: #aaccdd;
    }
  }

  .rule-users {
    display: flex;
    align-items: center;
    gap: 10px;

    label {
      font-size: 14px;
      color: #aaccdd;
      flex-shrink: 0;
    }
  }

  .user-tags {
    flex-grow: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .user-tag {
    background: rgba(71, 200, 255, 0.2);
    color: #d5f1f8;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 13px;
    display: flex;
    align-items: center;

    i {
      margin-left: 6px;
      cursor: pointer;
      font-size: 10px;
      &:hover {
        color: #FF5370;
      }
    }
  }

  .user-assignment {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    select {
      max-width: 120px;
      padding: 4px;
      border-radius: 4px 0 0 4px;
      border: 1px solid rgba(71, 200, 255, 0.5);
      border-right: none;
      background-color: rgba(6, 30, 65, 0.9);
      color: #d5f1f8;
      font-size: 12px;
    }

    button {
      padding: 4px 8px;
      border-radius: 0 4px 4px 0;
      border: 1px solid rgba(71, 200, 255, 0.5);
      background: rgba(71, 200, 255, 0.3);
      color: #d5f1f8;
      cursor: pointer;
      &:hover {
        background: rgba(71, 200, 255, 0.5);
      }
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
}
</style> 
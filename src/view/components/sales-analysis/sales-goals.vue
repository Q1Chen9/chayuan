<template>
  <div class="sales-goals">
    <div class="goal-item" v-for="goal in goals" :key="goal.name">
      <div class="chart-container">
        <goals-chart :chartData="goal"></goals-chart>
      </div>
      <div class="goal-info">
        <div class="goal-name">{{ goal.name }}销售目标</div>
        <div class="goal-values">
          <span class="current-value">{{ goal.value }}</span> / <span class="total-value">{{ goal.total }}</span> 万元
        </div>
        <div class="goal-status" :style="{ color: goal.color }">
          <i class="fas" :class="getGoalStatusIcon(goal)"></i>
          {{ getGoalStatusText(goal) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import GoalsChart from './goals-chart.vue';

export default {
  name: 'SalesGoals',
  components: { GoalsChart },
  setup() {
    const goals = ref([
      { name: '年度', value: 3850, total: 5000, color: '#FFBA5A' },
      { name: '季度', value: 1100, total: 1250, color: '#47C8FF' },
      { name: '月度', value: 350, total: 400, color: '#23fdc0' }
    ]);

    const getGoalStatusIcon = (goal) => {
      const percentage = (goal.value / goal.total) * 100;
      if (percentage >= 100) return 'fa-check-circle';
      if (percentage >= 75) return 'fa-arrow-trend-up';
      return 'fa-hourglass-half';
    };

    const getGoalStatusText = (goal) => {
      const percentage = (goal.value / goal.total) * 100;
      if (percentage >= 100) return '已达标';
      if (percentage >= 75) return '进度良好';
      return '仍在进行';
    };

    return {
      goals,
      getGoalStatusIcon,
      getGoalStatusText
    };
  }
};
</script>

<style scoped>
.sales-goals {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  width: 100%;
}

.goal-item {
  display: flex;
  align-items: center;
}

.chart-container {
  width: 90px;
  height: 90px;
  margin-right: 15px;
}

.goal-info {
  display: flex;
  flex-direction: column;
}

.goal-name {
  font-size: 14px;
  color: #d5f1f8;
  margin-bottom: 5px;
}

.goal-values {
  font-size: 18px;
  color: #aaccdd;
  margin-bottom: 8px;
}

.current-value {
  font-weight: bold;
  color: #fff;
}

.goal-status {
  font-size: 13px;
  font-weight: 500;
}

.goal-status i {
  margin-right: 5px;
}
</style> 
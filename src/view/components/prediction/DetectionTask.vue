<template>
  <div class="task-item" :class="{ 'completed': task.is_read }">
    <div class="task-main-info">
      <i class="fas" :class="taskIcon"></i>
      <div class="task-details">
        <span class="task-name">{{ task.name }}</span>
        <span class="task-meta">{{ task.area }} | 分配给: {{ task.assignedUser }}</span>
      </div>
    </div>
    <div class="task-status">
      <span class="status-tag">{{ task.is_read ? '已完成' : '进行中' }}</span>
      <span class="task-time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'DetectionTask',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const taskIcon = computed(() => {
      switch (props.task.type) {
        case '病虫害监测':
          return 'fa-bug';
        case '茶叶分级':
          return 'fa-leaf';
        case '环境监测':
          return 'fa-wind';
        default:
          return 'fa-tasks';
      }
    });

    const formattedTime = computed(() => {
      const date = new Date(props.task.createdAt);
      return date.toLocaleString();
    });

    return {
      taskIcon,
      formattedTime,
    };
  },
};
</script>

<style scoped>
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(71, 200, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 4px solid #47C8FF;
  transition: all 0.3s;
}

.task-item.completed {
  border-color: #23fdc0;
  background: rgba(35, 253, 192, 0.05);
}

.task-main-info {
  display: flex;
  align-items: center;
}

.task-details {
  display: flex;
  flex-direction: column;
}

.task-name {
  font-weight: 600;
  color: #d5f1f8;
}

.task-meta {
  font-size: 12px;
  color: #aaccdd;
}

.task-status {
  text-align: right;
}

.status-tag {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 186, 90, 0.2);
  color: #FFBA5A;
}

.task-item.completed .status-tag {
  background: rgba(35, 253, 192, 0.2);
  color: #23fdc0;
}

.task-time {
  font-size: 12px;
  color: #aaccdd;
  display: block;
  margin-top: 4px;
}

.fas {
  font-size: 20px;
  margin-right: 15px;
  color: #47C8FF;
}

.task-item.completed .fas {
    color: #23fdc0;
}
</style> 
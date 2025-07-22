<template>
  <div class="itemBodys">
    <div class="topInfo">
      <div class="totalCount">设备总数: {{ totalEquipment }}台</div>
    </div>
    <div class="equipmentStats">
      <div class="statItem">
        <span class="statLabel">正常运行设备</span>
        <span class="statValue">
          <gsapNum :number="operationalEquipment" :duration="2" class="greenText" />
        </span>
      </div>
      <div class="statItem" @click="showMaintenanceRecords">
        <span class="statLabel">维修中设备</span>
        <span class="statValue">
          <gsapNum :number="underMaintenanceEquipment" :duration="2" class="greenText" />
        </span>
      </div>
      <div class="statItem">
        <span class="statLabel">设备完好率</span>
        <span class="statValue">
          <gsapNum :number="equipmentIntegrityRate" :duration="2" :decimals="2" class="greenText" />
          <span>%</span>
        </span>
      </div>
    </div>
    <pop ref="pop">
      <div class="maintenanceRecordsPopup">
        <h2>维修记录</h2>
        <div class="recordsHeader">
          <span class="date">日期</span>
          <span class="equipmentName">设备名称</span>
          <span class="issue">问题描述</span>
        </div>
        <div class="records-container">
          <ul>
            <li v-for="(record, index) in displayedMaintenanceRecords" :key="index">
              <span class="date">{{ record.date }}</span>
              <span class="equipmentName">{{ record.equipmentName }}</span>
              <span class="issue">{{ record.issue }}</span>
            </li>
          </ul>
        </div>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalRecords"
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          background
          small
          class="pagination"
        />
      </div>
    </pop>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import pop from "@/components/pop/pop.vue";
import gsapNum from "@/components/gsapNum/index.vue";

export default {
  components: { pop, gsapNum },
  setup() {
    const currentPage = ref(1);
    const pageSize = 10;
    const totalRecords = 50;

    const generateRandomRecords = () => {
      const records = [];
      const issues = ['传感器更换', '天线调整', '摄像头维修', '电池更换', '软件升级'];
      const equipmentTypes = ['监测站', '通信塔', '防火瞭望塔', '气象站', '水文站'];

      for (let i = 0; i < pageSize; i++) {
        const date = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
        records.push({
          date: date.toISOString().split('T')[0],
          equipmentName: `${equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)]}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
          issue: issues[Math.floor(Math.random() * issues.length)]
        });
      }

      return records;
    };

    const displayedMaintenanceRecords = ref([]);

    const handleCurrentChange = (val) => {
      currentPage.value = val;
      displayedMaintenanceRecords.value = generateRandomRecords();
    };

    onMounted(() => {
      displayedMaintenanceRecords.value = generateRandomRecords();
    });

    return {
      currentPage,
      pageSize,
      totalRecords,
      displayedMaintenanceRecords,
      handleCurrentChange,
    };
  },
  data() {
    return {
      totalEquipment: 32145,
      operationalEquipment: 30500,
      underMaintenanceEquipment: 1645,
      equipmentIntegrityRate: 94.88,
    }
  },
  mounted() {
    // 可以在这里添加数据获取逻辑
  },
  methods: {
    showMaintenanceRecords() {
      this.$refs.pop.getShow();
    }
  }
}
</script>

<style lang="scss" scoped>
.itemBodys {
  width: calc(100% - 40px);
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.topInfo {
  margin-bottom: 20px;
}

.totalCount {
  font-size: 18px;
  font-weight: bold;
  color: #14e48a;
  text-shadow: 0 0 5px rgba(20, 228, 138, 0.5);
}

.equipmentStats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.statItem {
  text-align: center;
  background: rgba(30, 201, 255, 0.1);
  padding: 10px;
  width: calc(33% - 30px);
  border-radius: 8px;
  cursor: pointer;
}

.statLabel {
  font-size: 14px;
  color: #fff;
}

.statValue {
  font-size: 18px;
  font-weight: bold;
  color: #28d180;
  text-shadow: 0 0 5px rgba(#28d180, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  :deep(.gsapNum) {
    font-size: inherit;
    font-weight: inherit;
    color: inherit;
    text-shadow: inherit;
  }
  span{
    margin-top: 2px;
    font-size: 12px;
  }
}

.maintenanceInfo {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;

  h3 {
    font-size: 18px;
    margin-bottom: 10px;
    color: #1ec9ff;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
    font-size: 14px;
    color: #ccc;
    padding: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.maintenanceRecordsPopup {
  padding: 20px;
  color: #fff;
  height: 600px;
  position: relative;
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    color: #0b987f;
    margin-top: -20px;
    padding: 0;
    margin: 0;
  }

  .recordsHeader {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    font-weight: bold;
    margin-top: 10px;
  }

  .records-container {
    flex-grow: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #006454 rgba(255, 255, 255, 0.1);

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #006454;
      border-radius: 4px;
    }
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
  }

  .date {
    flex: 1;
  }

  .equipmentName {
    flex: 2;
  }

  .issue {
    flex: 3;
  }
}

.pagination {
  margin-top: 20px;
  text-align: center;
  align-self: center;

  :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
    background-color: #14e48a;
  }

  :deep(.el-pagination.is-background .el-pager li:not(.disabled):hover) {
    color: #14e48a;
  }

  :deep(.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev) {
    background-color: rgba(20, 228, 138, 0.1);
    color: #14e48a;
  }
}
</style>

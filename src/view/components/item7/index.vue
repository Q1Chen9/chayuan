<template>
  <div class="listCom green">
    <vue-seamless-scroll class="scrollList" :data="list" direction="top" :step="0.5" :hover="true">
      <div class="listItem" v-for="(item, index) in list" :key="index">
        <div class="content-row">
          <div class="content">{{ item.content }}</div>
          <div class="date">{{ item.date }}</div>
        </div>
        <div class="details">
          <span class="pest">{{ item.pest }}</span>
          <span class="severity">风险等级: {{ item.severity }}</span>
          <span class="area">影响面积: {{ item.area }}</span>
        </div>
      </div>
    </vue-seamless-scroll>
  </div>
</template>

<script>

export default {
  name: "listCom",
  components: {
  },
  data() {
    return {
      list: this.generateData()
    }
  },
  methods: {
    generateData() {
      const areas = [
        "长安区", "桥西区", "新华区", "井陉矿区", "裕华区", "藁城区", "鹿泉区", "栾城区",
        "井陉县", "正定县", "行唐县", "灵寿县", "高邑县", "深泽县", "赞皇县", "无极县",
        "平山县", "元氏县", "赵县"
      ];
      const pests = ["松毛虫", "杨树天牛", "落叶松针蛾", "松褐天牛", "松材线虫"];
      const severities = ["低", "中", "高", "严重"];

      return Array.from({length: 15}, () => {
        const date = this.randomDate();
        const area = areas[Math.floor(Math.random() * areas.length)];
        const pest = pests[Math.floor(Math.random() * pests.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const affectedArea = Math.floor(Math.random() * 1000) + 100; // 100到1100公顷

        return {
          date: date,
          content: `石家庄市${area}发现${pest}疫情`,
          pest: pest,
          severity: severity,
          area: `${affectedArea}公顷`
        };
      });
    },
    randomDate() {
      const start = new Date(2023, 8, 1); // 9月1日
      const end = new Date(2023, 8, 30); // 9月30日
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

      const month = randomDate.getMonth() + 1;
      const day = randomDate.getDate();
      const hour = randomDate.getHours();
      const minute = randomDate.getMinutes();

      return `${month}月${day}日${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }
  }
}
</script>

<style lang="scss" scoped>
.listCom {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .scrollList {
    height: 100%;
  }

  .listItem {
    padding: 10px;
    border-bottom: 1px solid rgba(13, 159, 127, 0.2);

    .content-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }

    .date {
      font-size: 14px;
      font-weight: bold;
      color: rgba(66, 207, 176, 1);
    }

    .content {
      font-size: 14px;
      color: rgba(220, 255, 236, 1);
      flex-grow: 1;
      margin-right: 10px;
    }

    .details {
      font-size: 12px;
      color: rgba(180, 230, 210, 1);

      .pest, .severity, .area {
        margin-right: 10px;
      }

      .severity {
        color: rgba(255, 165, 0, 1);
      }
    }
  }
}

.listCom.green {
  background: rgba(0, 255, 194, 0.05);
}
</style>

<template>
  <div class="sales">
    <top name="青芽智眸大数据智能运营平台"></top>
    <div class="salesmain">
      <!-- 左栏 -->
      <div class="salesmainl">
        <div class="item1">
          <item name="渠道销售矩阵" icon="icon-scatter-chart" :duration="0.5" :delay="0">
            <bubble-chart></bubble-chart>
          </item>
        </div>
        <div class="item2">
          <item name="品牌销量对比" icon="icon-bar-chart" :duration="0.5" :delay="0.5">
            <sales-comparison></sales-comparison>
          </item>
        </div>
        <div class="item3">
          <item name="销售地域分布" icon="icon-map" :duration="0.5" :delay="1">
            <region-distribution></region-distribution>
          </item>
        </div>
      </div>
      
      <!-- 中栏 -->
      <div class="salesmainc">
        <div class="item1">
          <sales-indicators></sales-indicators>
        </div>
        <div class="item2">
          <item name="龙井茶相关热词" icon="icon-cloud" :duration="0.5" :delay="0.5">
            <word-cloud></word-cloud>
          </item>
        </div>
      </div>
      
      <!-- 右栏 -->
      <div class="salesmainr">
        <div class="item1">
          <item name="客户评价分析" icon="icon-star" :duration="0.5" :delay="0">
            <customer-reviews></customer-reviews>
          </item>
        </div>
        <div class="item1">
          <item name="渠道话题占比" icon="icon-pie-chart" :duration="0.5" :delay="0.5">
            <topic-distribution></topic-distribution>
          </item>
        </div>
        <div class="item1">
          <item name="热门话题声量" icon="icon-volume" :duration="0.5" :delay="1">
            <hot-topics></hot-topics>
          </item>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import top from "./components/top/index.vue";
import item from "./components/item/index.vue";
import WOW from "wow.js";

// 导入组件（这些是自定义组件，需要创建）
import BubbleChart from "./components/sales-analysis/bubble-chart.vue";
import SalesComparison from "./components/sales-analysis/sales-comparison.vue";
import RegionDistribution from "./components/sales-analysis/region-distribution.vue";
import SalesIndicators from "./components/sales-analysis/sales-indicators.vue";
import WordCloud from "./components/sales-analysis/word-cloud.vue";
import CustomerReviews from "./components/sales-analysis/customer-reviews.vue";
import TopicDistribution from "./components/sales-analysis/topic-distribution.vue";
import HotTopics from "./components/sales-analysis/hot-topics.vue";

onMounted(() => {
  const wow = new WOW({
    boxClass: "wow",
    animateClass: "animated"
  });
  wow.init();
});
</script>

<style lang="scss" scoped>
.sales {
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

.salesmain {
  position: relative;
  width: calc(100% - 0px);
  height: calc(100% - 110px);
  display: flex;
  margin-top: 80px;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;

  .salesmainl {
    width: calc(22% - 30px);
    position: relative;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
    margin-left: 30px;
    z-index: 1;

    .item1 {
      width: calc(100% - 0px);
      height: calc(35% - 10px);
      position: relative;
    }

    .item2 {
      width: calc(100% - 0px);
      height: calc(30% - 10px);
      position: relative;
    }

    .item3 {
      width: calc(100% - 0px);
      height: calc(35% - 10px);
      position: relative;
    }
  }

  .salesmainc {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
    position: relative;
    width: calc(56% - 60px);
    height: 100%;
    z-index: 0;

    .item1 {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;
      position: relative;
      margin-top: 10px;
    }

    .item2 {
      width: 100%;
      height: calc(100% - 390px);
      margin-top: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      position: relative;
      align-content: flex-start;
    }
  }

  .salesmainr {
    width: calc(22% - 30px);
    position: relative;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
    margin-right: 30px;
    z-index: 1;

    .item1 {
      width: calc(100% - 0px);
      height: calc(33.33% - 10px);
      position: relative;
      margin-bottom: 5px;
      
      &:last-child {
        margin-bottom: 0;
      }
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
</style> 
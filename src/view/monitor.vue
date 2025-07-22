<template>
  <div class="monitor">
    <top name="青芽智眸大数据智能运营平台"></top>
    <div class="monitormain">
      <!-- 左侧栏 - 原右侧栏内容 -->
      <div class="monitormainl">
        <div class="item1">
          <item name="土壤环境" icon="icon-soil-params" :duration="0.5" :delay="0">
            <monitor-soil-params></monitor-soil-params>
          </item>
        </div>
        <div class="item2">
          <item name="肥料使用占比" icon="icon-fertilizer" :duration="0.5" :delay="0.3">
            <monitor-fertilizer></monitor-fertilizer>
          </item>
        </div>
        <div class="item3">
          <item name="农药使用占比" icon="icon-pesticide" :duration="0.5" :delay="0.6">
            <monitor-pesticide></monitor-pesticide>
          </item>
        </div>
      </div>

      <!-- 中间栏 - 实时数据和监控视频 -->
      <div class="monitormaincenter">
        <div class="item1">
          <item-big name="实时环境数据" icon="icon-realtime" :duration="0.5" :delay="0.5">
            <monitor-realtime-data></monitor-realtime-data>
          </item-big>
        </div>
        <div class="item2">
          <item-big name="监控视频" icon="icon-video" :duration="0.5" :delay="1">
            <monitor-video></monitor-video>
          </item-big>
        </div>
      </div>

      <!-- 右侧栏 - 原左侧栏内容 -->
      <div class="monitormainr">
        <div class="item1">
          <item name="空气质量" icon="icon-air" :duration="0.5" :delay="0">
            <monitor-air-trend></monitor-air-trend>
          </item>
        </div>
        <div class="item2">
          <item name="二氧化碳浓度" icon="icon-co2" :duration="0.5" :delay="0.3">
            <monitor-co2-trend></monitor-co2-trend>
          </item>
        </div>
        <div class="item3">
          <item name="温湿度" icon="icon-temperature" :duration="0.5" :delay="0.6">
            <monitor-temp-humidity-trend></monitor-temp-humidity-trend>
          </item>
        </div>
        <div class="item4">
          <item name="土壤环境" icon="icon-soil" :duration="0.5" :delay="0.9">
            <monitor-soil-trend></monitor-soil-trend>
          </item>
        </div>
        <div class="item5">
          <item name="光照" icon="icon-light" :duration="0.5" :delay="1.2">
            <monitor-light-trend></monitor-light-trend>
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
import itemBig from "./components/itemBig/index.vue";
import MonitorAirTrend from "./components/monitor/air-trend.vue";
import MonitorCo2Trend from "./components/monitor/co2-trend.vue";
import MonitorTempHumidityTrend from "./components/monitor/temp-humidity-trend.vue";
import MonitorSoilTrend from "./components/monitor/soil-trend.vue";
import MonitorLightTrend from "./components/monitor/light-trend.vue";
import MonitorRealtimeData from "./components/monitor/realtime-data.vue";
import MonitorVideo from "./components/monitor/video.vue";
import MonitorAlarm from "./components/monitor/alarm.vue";
import MonitorSoilParams from "./components/monitor/soil-params.vue";
import MonitorFertilizer from "./components/monitor/fertilizer.vue";
import MonitorPesticide from "./components/monitor/pesticide.vue";
import WOW from "wow.js";
import { gsap } from 'gsap';

onMounted(() => {
  const wow = new WOW({
    boxClass: "wow",
    animateClass: "animated"
  });
  wow.init();
});
</script>

<style lang="scss" scoped>
.monitor {
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

.monitormain {
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

  .monitormainl {
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
      height: calc(50% - 15px);
      position: relative;
    }

    .item2, .item3 {
      width: calc(100% - 0px);
      height: calc(25% - 10px);
      position: relative;
    }
  }

  .monitormaincenter {
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
      height: calc(35% - 15px);
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;
      position: relative;
    }

    .item2 {
      width: 100%;
      height: calc(65% - 15px);
      margin-top: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      position: relative;
      align-content: flex-start;
    }
  }

  .monitormainr {
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

    .item1, .item2, .item3, .item4, .item5 {
      width: calc(100% - 0px);
      height: calc(20% - 10px);
      position: relative;
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
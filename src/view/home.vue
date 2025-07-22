<template>
  <div class="home">
    <top name="青芽智眸大数据智能运营平台"></top>
    <div class="homemain">
      <div class="homemainl">
        <div class="item1">
          <item name="整体健康" icon="icon-environment" :duration="0.5" :delay="0">
            <env-health></env-health>
          </item>
        </div>
        <div class="item2">
          <item name="品种树龄分析" icon="icon-tea-leaf" :duration="0.5" :delay="0.5">
            <tea-variety></tea-variety>
          </item>
        </div>
        <div class="item3">
          <item name="生产进度" icon="icon-harvest" :duration="0.5" :delay="1">
            <tea-harvest></tea-harvest>
          </item>
        </div>
      </div>
      <div class="homemainc">
        <div class="item1">
          <tea-indicators></tea-indicators>
        </div>
        <div class="item2" ref="item11Container">
          <item10></item10>
        </div>
      </div>
      <div class="homemainr">
        <div class="item1">
          <item name="销量分析" icon="icon-sales" :duration="0.5" :delay="0">
            <tea-sales></tea-sales>
          </item>
        </div>
        <div class="item1">
          <item name="渠道分析" icon="icon-channel" :duration="0.5" :delay="0.5">
            <tea-channels></tea-channels>
          </item>
        </div>
        <div class="item1">
          <item name="地域分布" icon="icon-region" :duration="0.5" :delay="1">
            <tea-regions></tea-regions>
          </item>
        </div>
        <div class="item1">
          <item name="库存分析" icon="icon-price" :duration="0.5" :delay="1.5">
            <tea-prices></tea-prices>
          </item>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import top from "./components/top/index.vue";
import item from "./components/item/index.vue";
import itemBig from "./components/itemBig/index.vue";
import item10 from "./components/item10/index.vue";
import EnvHealth from "./components/tea-monitor/env-health.vue";
import TeaVariety from "./components/tea-monitor/tea-variety.vue";
import TeaHarvest from "./components/tea-monitor/tea-harvest.vue";
import TeaIndicators from "./components/tea-monitor/tea-indicators.vue";
import TeaSales from "./components/tea-monitor/tea-sales.vue";
import TeaChannels from "./components/tea-monitor/tea-channels.vue";
import TeaRegions from "./components/tea-monitor/tea-regions.vue";
import TeaPrices from "./components/tea-monitor/tea-prices.vue";
import WOW from "wow.js";
import { gsap } from 'gsap';

const item11Container = ref(null);

onMounted(() => {
  const wow = new WOW({
    boxClass: "wow",
    animateClass: "animated"
  });
  wow.init();
  
  // 使用GSAP为地图添加从小到大的动画效果
  gsap.from(item11Container.value, {
    duration: 1,
    scale: 0,
    opacity: 0,
    ease: "back.out(1.7)",
    delay: 0.5
  });
});
</script>

<style lang="scss" scoped>
.home {
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

.homemain {
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

  .homemainl {
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
      height: calc(45% - 15px);
      position: relative;
    }

    .item2 {
      width: calc(100% - 0px);
      height: calc(25% - 15px);
      position: relative;
    }

    .item3 {
      width: calc(100% - 0px);
      height: calc(30% - 15px);
      position: relative;
    }
  }

  .homemainc {
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
      height: 120px;
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
      height: calc(100% - 150px);
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

  .homemainr {
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
      height: calc(25% - 10px);
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

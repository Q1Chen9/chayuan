<template>
  <div class="monitor">
    <top name="青芽智眸大数据智能运营平台"></top>
    <div class="city-selector">
      <input v-model="cityInput" @keyup.enter="handleCityChange" placeholder="输入城市后按回车切换" />
    </div>
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
            <monitor-realtime-data :weather-data="weatherData"></monitor-realtime-data>
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
            <monitor-air-trend :weather-data="weatherData"></monitor-air-trend>
          </item>
        </div>
        <div class="item2">
          <item name="二氧化碳浓度" icon="icon-co2" :duration="0.5" :delay="0.3">
            <monitor-co2-trend></monitor-co2-trend>
          </item>
        </div>
        <div class="item3">
          <item name="温湿度" icon="icon-temperature" :duration="0.5" :delay="0.6">
            <monitor-temp-humidity-trend :weather-data="weatherData"></monitor-temp-humidity-trend>
          </item>
        </div>
        <div class="item4">
          <item name="土壤环境" icon="icon-soil" :duration="0.5" :delay="0.9">
            <monitor-soil-trend></monitor-soil-trend>
          </item>
        </div>
        <div class="item5">
          <item name="光照" icon="icon-light" :duration="0.5" :delay="1.2">
            <monitor-light-trend :weather-data="weatherData"></monitor-light-trend>
          </item>
        </div>
      </div>
    </div>
    <div class="footerbg wow fadeInUp"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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

const weatherData = ref(null);
let dataTimer = null;
const cityInput = ref('');
let currentLocationId = null;
let currentLat = null;
let currentLon = null;

const QWEATHER_KEY = '9339ef6eff254f5ba087d791d6bc8423';
const QWEATHER_HOST = 'pm2tundcmy.re.qweatherapi.com';

// 经纬度转城市id
async function fetchLocationId(lat, lon) {
  const url = `https://${QWEATHER_HOST}/geo/v2/city/lookup?location=${lon},${lat}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code === '200' && data.location && data.location.length > 0) {
    return data.location[0].id;
  }
  throw new Error('获取城市ID失败');
}

// 获取实时天气
async function fetchWeatherNow(locationId) {
  const url = `https://${QWEATHER_HOST}/v7/weather/now?location=${locationId}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  return await res.json();
}

// 获取实时空气质量
async function fetchAirNow(locationId) {
  const url = `https://${QWEATHER_HOST}/v7/air/now?location=${locationId}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  return await res.json();
}

// 获取24小时温湿度
async function fetchWeather24h(locationId) {
  const url = `https://${QWEATHER_HOST}/v7/weather/24h?location=${locationId}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  return await res.json();
}

// 获取5天空气质量
async function fetchAir5d(locationId) {
  const url = `https://${QWEATHER_HOST}/v7/air/5d?location=${locationId}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  return await res.json();
}

// 获取24h太阳辐射 - 注意：此接口使用经纬度
async function fetchSolarRadiation24h(lat, lon) {
  const url = `https://${QWEATHER_HOST}/v7/solar-radiation/24h?location=${lon},${lat}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  return await res.json();
}

// 城市名转locationId
async function fetchLocationIdByName(cityName) {
  const url = `https://${QWEATHER_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(cityName)}&key=${QWEATHER_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code === '200' && data.location && data.location.length > 0) {
    return data.location[0].id;
  }
  throw new Error('未找到该城市');
}

// 核心数据获取逻辑
async function fetchAllData(lat, lon) {
  try {
    const locationId = await fetchLocationId(lat, lon);
    const [weather, air, weather24h, air5d, solarRadiation24h] = await Promise.all([
      fetchWeatherNow(locationId),
      fetchAirNow(locationId),
      fetchWeather24h(locationId),
      fetchAir5d(locationId),
      fetchSolarRadiation24h(lat, lon) // 直接传递经纬度
    ]);
    // 适配hourly结构
    let hourly = { time: [], temperature_2m: [], relative_humidity_2m: [] };
    if (weather24h && weather24h.hourly && Array.isArray(weather24h.hourly)) {
      hourly.time = weather24h.hourly.map(h => h.fxTime);
      hourly.temperature_2m = weather24h.hourly.map(h => parseFloat(h.temp));
      hourly.relative_humidity_2m = weather24h.hourly.map(h => parseFloat(h.humidity));
    }
    weatherData.value = { weather, air, hourly, air5d, solarRadiation24h };
  } catch (e) {
    console.error('获取和风天气数据失败', e);
    weatherData.value = null;
    }
}

// 处理城市切换
const handleCityChange = async () => {
  if (!cityInput.value) return;
  try {
    // 切换城市时，我们没有原始经纬度，可以先获取城市信息再获取天气
    // 为了简化，我们暂时只更新ID依赖的数据，或需要更复杂的逻辑来获取新城市的经纬度
    // 此处我们先获取ID，并用ID更新依赖ID的数据
    const locationId = await fetchLocationIdByName(cityInput.value);
    currentLocationId = locationId;
    
    // 由于太阳辐射需要经纬度，我们需要先获取新城市的经纬度
    const cityLookupUrl = `https://${QWEATHER_HOST}/geo/v2/city/lookup?location=${encodeURIComponent(cityInput.value)}&key=${QWEATHER_KEY}`;
    const cityRes = await fetch(cityLookupUrl);
    const cityData = await cityRes.json();
    if (cityData.code === '200' && cityData.location.length > 0) {
        const { lat, lon } = cityData.location[0];
        currentLat = lat;
        currentLon = lon;
        startDataUpdates();
    } else {
        throw new Error('无法获取新城市的经纬度');
    }

  } catch (error) {
    alert('找不到城市，请检查输入是否正确。');
    console.error(error);
  }
};

// 封装启动更新的逻辑
const startDataUpdates = () => {
  if (!currentLocationId || currentLat === null || currentLon === null) return;
  if (dataTimer) clearInterval(dataTimer);
  fetchAllData(currentLat, currentLon);
  dataTimer = setInterval(() => fetchAllData(currentLat, currentLon), 5 * 60 * 1000);
};

onMounted(() => {
  const wow = new WOW({
    boxClass: "wow",
    animateClass: "animated"
  });
  wow.init();

  const initLocation = (lat, lon) => {
    currentLat = lat;
    currentLon = lon;
    fetchLocationId(lat, lon).then(id => {
      currentLocationId = id;
      startDataUpdates();
    }).catch(error => {
        console.error("Failed to initialize location ID.", error);
    });
  };

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        initLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Geolocation error:", error.message, ". Using default location.");
        const hangzhou = { latitude: 30.2741, longitude: 120.1551 };
        initLocation(hangzhou.latitude, hangzhou.longitude);
      }
    );
  } else {
    console.log("Geolocation is not supported. Using default location.");
    const hangzhou = { latitude: 30.2741, longitude: 120.1551 };
    initLocation(hangzhou.latitude, hangzhou.longitude);
  }
});

onBeforeUnmount(() => {
  if (dataTimer) {
    clearInterval(dataTimer);
  }
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

.city-selector {
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  input {
    background: rgba(13, 42, 82, 0.8);
    border: 1px solid rgba(71, 200, 255, 0.6);
    color: #d5f1f8;
    padding: 8px 15px;
    border-radius: 20px;
    text-align: center;
    font-size: 14px;
    outline: none;
    transition: all 0.3s ease;
    &::placeholder {
      color: rgba(213, 241, 248, 0.5);
    }
    &:focus {
      border-color: #23fdc0;
      box-shadow: 0 0 10px rgba(35, 253, 192, 0.3);
    }
  }
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
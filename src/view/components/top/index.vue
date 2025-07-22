<template>
  <div class="pageTop wow fadeInDown green">
    <sequence fileLength="74" IntervalTime="50"></sequence>
    <div class="left">
      <div class="nav-buttons">
        <button class="nav-btn" @click="navigateTo('/')">首页</button>
        <button class="nav-btn" @click="navigateTo('/monitor')">环境</button>
        <button class="nav-btn" @click="navigateTo('/production')">生产</button>
        <button class="nav-btn" @click="navigateTo('/sales')">销售</button>
        <button class="nav-btn" @click="navigateTo('/prediction')">预测</button>
      </div>
    </div>
    <div class="title">
      <span :title="name">{{ name }}</span>
    </div>
    <div class="right">
      <div class="date">
        <span>{{ currentTime }}</span>
        <p>{{ currentDate }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-cn';
import sequence from "./sequence/index.vue";
import { computed } from 'vue';
import { useRouter } from 'vue-router';

dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.updateLocale('zh-cn', {
  weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
});

dayjs.locale('zh-cn');

export default {
  name: "pageTop",
  components: {sequence},
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  setup() {
    const router = useRouter();
    
    const navigateTo = (path) => {
      router.push(path);
    };
    
    return {
      navigateTo
    };
  },
  data() {
    return {
      currentTime: '10:30:45',
      currentDate: '2025/04/01 周二',
      timer: null
    };
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    updateTime() {
      this.currentTime = '10:30:45';
      this.currentDate = '2025/04/01 周二';
    }
  }
}
</script>

<style lang="scss" scoped>
.pageTop {
  width: 100%;
  height: 200px;
  flex-shrink: 0;
  top: 0;
  pointer-events: none;
  position: fixed;
  display: flex;
  //background: url("./assets/theme/blue/topbg.png") no-repeat;
  //background-size: 100% 200px;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  z-index: 101;
  pointer-events: none;

  .left {
    position: relative;
    height: 60px;
    width: 40%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;

    img {
      width: 42px;
      margin-left: 40px;
      margin-right: 10px;
    }

    span {
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      font-size: 18px;
      margin-right: 20px;
      color: #aaccdd;
    }

    .nav-buttons {
      display: flex;
      gap: 12px;
      margin-left: 40px;
      pointer-events: auto;
    }

    .nav-btn {
      padding: 8px 18px;
      border: none;
      border-radius: 6px;
      background: rgba(8, 35, 43, 0.6);
      box-shadow: 0 0 15px rgba(52, 235, 216, 0.15);
      border: 1px solid rgba(52, 235, 216, 0.3);
      color: #34ebd8;
      font-family: PingFang SC, PingFang SC;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(52, 235, 216, 0.1) 0%, rgba(8, 35, 43, 0) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(52, 235, 216, 0.25);
        border-color: rgba(52, 235, 216, 0.5);
        
        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(52, 235, 216, 0.2);
      }
    }
  }

  .right {
    position: relative;
    height: 60px;
    width: 40%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;


    .line {
      width: 1px;
      height: 41px;
      background: rgba(0, 194, 206, 0.24);
      margin-left: 20px;
    }

    .date {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: nowrap;
      flex-direction: column;
      width: 140px;
      align-content: flex-start;
      margin-left: 30px;
pointer-events: initial;


      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 20px;
        color: #d5f1f8;
      }

      p {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #74a1c6;
      }
    }
  }

  .title {
    position: relative;
    width: 40%;
    height: 100%;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
  }

  .title span {
    font-family: PangMenZhengDao;
    font-weight: 400;
    font-size: 40px;
    letter-spacing: 3px;
    text-align: left;
    font-style: normal;
pointer-events: initial;

    text-transform: none;
    background: linear-gradient(180deg, #F2FCFF 0%, #47C8FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 20px;
    position: relative;
  }

  .title span::before {
    content: attr(title);
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    color: transparent;
    text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.51);
  }
}
.pageTop.green {
  .left {
    .nav-buttons {
      display: flex;
      gap: 12px;
      margin-left: 40px;
      pointer-events: auto;
    }

    .nav-btn {
      padding: 8px 18px;
      border: none;
      border-radius: 6px;
      background: rgba(8, 35, 43, 0.6);
      box-shadow: 0 0 15px rgba(52, 235, 216, 0.15);
      border: 1px solid rgba(52, 235, 216, 0.3);
      color: #34ebd8;
      font-family: PingFang SC, PingFang SC;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, rgba(52, 235, 216, 0.1) 0%, rgba(8, 35, 43, 0) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(52, 235, 216, 0.25);
        border-color: rgba(52, 235, 216, 0.5);
        
        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 10px rgba(52, 235, 216, 0.2);
      }
    }

    span {
      color: rgba(223, 253, 255, 1);
    }
  }

  .right {
    .line {
      width: 1px;
      height: 41px;
      background: rgba(0, 194, 206, 0.24);
      margin-left: 20px;
    }

    .date {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: nowrap;
      flex-direction: column;
      width: 140px;
      align-content: flex-start;
      margin-left: 30px;

      span {
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 20px;
        color: #d5f1f8;
      }

      p {
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: rgba(223, 253, 255, 1);
      }
    }
  }

  .title span {
    text-align: left;
    font-style: normal;
    text-transform: none;
    background: linear-gradient(180deg, #F2FCFF 0%, #67c5b4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-top: 20px;
    position: relative;
  }
}
</style>

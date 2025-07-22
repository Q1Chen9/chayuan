<template>
  <div class="monitor-video">
    <div class="video-container">
      <img 
        src="../../../assets/tea.jpg"
        alt="茶园实时监控"
        class="monitor-image"
      />
    </div>
    <div class="video-info">
      <div class="info-item">
        <div class="info-icon location">
          <i class="iconfont icon-location"></i>
        </div>
        <div class="info-text">
          <div class="info-label">监控位置</div>
          <div class="info-value">茶园东北角 - 站点03</div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-icon time">
          <i class="iconfont icon-time"></i>
        </div>
        <div class="info-text">
          <div class="info-label">实时画面</div>
          <div class="info-value">{{ currentTime }}</div>
        </div>
      </div>
      <div class="info-item">
        <div class="info-icon status">
          <i class="iconfont icon-status"></i>
        </div>
        <div class="info-text">
          <div class="info-label">设备状态</div>
          <div class="info-value status-normal">正常运行</div>
        </div>
      </div>
    </div>
    <div class="video-controls">
      <button class="control-btn" @click="switchCamera(1)">
        <i class="iconfont icon-camera"></i>
        茶园东
      </button>
      <button class="control-btn" @click="switchCamera(2)">
        <i class="iconfont icon-camera"></i>
        茶园南
      </button>
      <button class="control-btn" @click="switchCamera(3)">
        <i class="iconfont icon-camera"></i>
        茶园西
      </button>
      <button class="control-btn" @click="switchCamera(4)">
        <i class="iconfont icon-camera"></i>
        茶园北
      </button>
    </div>
  </div>
</template>

<script>
import teaImage from '@/assets/tea.jpg'

export default {
  name: 'MonitorVideo',
  data() {
    return {
      currentTime: '10:30:45',
      timer: null,
      teaImage
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
    },
    switchCamera(id) {
      // 实际应用中，这里会切换不同的摄像头视频源
      console.log(`切换到摄像头 ${id}`);
      // 这里只是模拟切换效果
      const video = this.$refs.videoPlayer;
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.monitor-video {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .video-container {
    flex: 1;
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    border: 1px solid rgba(71, 200, 255, 0.3);
    box-shadow: 0 0 15px rgba(35, 253, 192, 0.1);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(6, 30, 65, 0.3), rgba(6, 30, 65, 0.1));
      z-index: 1;
      pointer-events: none;
    }
    
    .monitor-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &:after {
      content: '';
      position: absolute;
      top: 10px;
      right: 10px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #23fdc0;
      box-shadow: 0 0 10px #23fdc0;
      animation: blink 1.5s infinite;
      z-index: 2;
    }
    
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
  }
  
  .video-info {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding: 0 10px;
    
    .info-item {
      display: flex;
      align-items: center;
      
      .info-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        font-size: 20px;
        color: #fff;
        
        &.location {
          background: linear-gradient(135deg, #3B93FF 0%, #4ADEDE 100%);
        }
        
        &.time {
          background: linear-gradient(135deg, #47C8FF 0%, #23fdc0 100%);
        }
        
        &.status {
          background: linear-gradient(135deg, #5DE593 0%, #41C7AF 100%);
        }
      }
      
      .info-text {
        .info-label {
          font-size: 12px;
          color: rgba(213, 241, 248, 0.7);
        }
        
        .info-value {
          font-size: 14px;
          color: #d5f1f8;
          font-weight: 500;
          
          &.status-normal {
            color: #5DE593;
          }
        }
      }
    }
  }
  
  .video-controls {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    
    .control-btn {
      flex: 1;
      background: rgba(6, 30, 65, 0.5);
      border: 1px solid rgba(71, 200, 255, 0.3);
      color: #d5f1f8;
      padding: 8px 0;
      font-size: 12px;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin: 0 5px;
      border-radius: 4px;
      
      &:first-child {
        margin-left: 0;
      }
      
      &:last-child {
        margin-right: 0;
      }
      
      i {
        font-size: 16px;
        margin-bottom: 3px;
      }
      
      &:hover {
        background: rgba(71, 200, 255, 0.2);
        transform: translateY(-2px);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
  }
}

@font-face {
  font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_2952240_0hf6c1bkzgw.woff2') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-location:before {
  content: "\e790";
}

.icon-time:before {
  content: "\e62e";
}

.icon-status:before {
  content: "\e69d";
}

.icon-camera:before {
  content: "\e665";
}
</style> 
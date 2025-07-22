<template>
  <teleport to="body">
    <div class="popWin" v-if="show">
      <div class="popWinBg" v-if="show" @click="getHide"></div>
      <div class="popWinMain" ref="popWinMain" :style="popWinMainStyle" v-if="show">
        <div class="popClose" ref="popClose" v-if="showInner" @click="getHide"></div>
        <div class="popWinMainInner">
          <div class="slot">
            <slot v-if="showInner"></slot>
          </div>
          <div class="popFooter"></div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script>

import gsap from 'gsap'
import popbg from './assets/popbg.png'

export default {
  data() {
    return {
      show: false,
      showInner: false
    }
  },
  computed: {
    popWinMainStyle() {
      return {
        height: this.popHeight,
        backgroundImage: `url(${popbg})`
      }
    }
  },
  mounted() {
  },
  props: {
    name: {
      type: String,
      default() {
        return '';
      }
    },
    popWidth: {
      type: String,
      default() {
        return '1255px';
      }
    },
    popHeight: {
      type: String,
      default: '745px'
    }
  },
  methods: {
    animateElement(element, properties, onComplete) {
      gsap.to(element, {
        duration: 1,
        ...properties,
        onComplete
      });
    },

    getShow() {
      this.show = true;
      this.$nextTick(() => {
        this.currentWidth = this.popWidth;
        this.animateElement(this.$refs.popWinMain, {width: this.popWidth}, () => {
          this.showInner = true;
        });
      });
    },

    getHide() {
      this.showInner = false;
      this.$nextTick(() => {
        this.currentWidth = '0px';
        this.animateElement(this.$refs.popWinMain, {width: '0px'}, () => {
          this.show = false;
        });
      });
    }
  },
}
</script>

<style lang="scss" scoped>
.popWinBg {
  position: fixed;
  z-index: 8;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: initial;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.titleBody {
  width: calc(100% - 0px);
  margin: auto;
  height: 38px;
  position: relative;
  display: flex;
  background: #0E273E;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  opacity: 1;
  z-index: 0;
  border-bottom: 1px solid #204253;

  span {
    font-family: TRENDS;
    font-weight: 400;
    font-size: 20px;
    color: #FFFFFF;
  }

  .title_right_zhuangshi {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 74px;
  }
}

.popWin {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  position: fixed;
  z-index: 1000;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  pointer-events: none;

}

.popWinMainInner {
  pointer-events: initial;
  position: relative;
  width: calc(100% - 50px);
  height: calc(100% - 50px);
}

.popIcon {
  width: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;

  img {
    width: 16px;
  }
}

.popWinMain {
  pointer-events: initial;
  position: relative;
  width: 0;
  max-width: 1642px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  z-index: 100;
  background: url("./assets/popbg.png") no-repeat;
  background-size: 100% 100%;

  .slot {
    position: relative;
    background: #01342a;
    z-index: 100;
    width: calc(100% - 0px);
    height: calc(100% - 19px);
  }
}

.popClose {
  background: url("./assets/icon_close.png") no-repeat;
  width: 15px;
  height: 15px;
  background-size: 100% 100%;
  cursor: pointer;
  z-index: 1;
  position: absolute;
  right: 30px;
  top: 5px;
}

</style>

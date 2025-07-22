<template>
  <div class="itemBody" :class="itemBodyClass">
    <div class="itemBody2" ref="inner" v-if="show">
      <div class="pageTitle" ref="pageTitle">
        <sequence></sequence>
        <div class="icon">
          <component :is="iconComponent"></component>
        </div>
        <div class="pageTitlel" ref="pageTitlel">
          <p class="text" v-for="(char, index) in titleArray" :key="index"
             :style="{ '--delay': index * 0.1 + 0.8 + 's' }">{{ char }}</p>
        </div>
        <div class="pageTitler">
          {{ desc }}
        </div>
        <div class="dot"></div>
      </div>
      <div class="itemBodyInner" :class="{ itemBodyInner2: !name }">
        <slot></slot>
      </div>
    </div>
    <div class="bg" ref="bg" v-if="!show"></div>
  </div>
</template>

<script>
import {gsap} from 'gsap';
import sequence from "./sequence/index.vue";
import icon1 from './icon1/index.vue'
import icon2 from './icon2/index.vue'
import icon3 from './icon3/index.vue'
import icon4 from './icon4/index.vue'
import icon5 from './icon5/index.vue'
import icon6 from './icon6/index.vue'
import icon7 from './icon7/index.vue'
import icon8 from './icon8/index.vue'

export default {
  components: {
    sequence,
    icon1,
    icon2,
    icon3,
    icon4,
    icon5,
    icon6,
    icon7,
    icon8,
  },
  data() {
    return {
      show: false,
      iconPath: '',
      basePath: '',
      theme: 'green' // 默认主题为green
    }
  },
  computed: {
    titleArray() {
      return this.name.split('');
    },
    itemBodyClass() {
      return {
        'green': this.theme === 'green'
      };
    },
    iconComponent() {
      return this.icon;
    }
  },
  props: {
    delay: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0.5
    },
    name: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  watch: {
    theme: {
      handler(newTheme) {
        this.updateBasePath();
      },
      immediate: true
    }
  },
  mounted() {
    this.updateBasePath();

    var that = this;
    gsap.to(this.$refs.bg, {
      height: '100%',
      delay: that.delay,
      duration: that.duration,
      ease: 'none',
      onComplete: () => {
        this.getMainAnimation();
      }
    });
  },
  methods: {
    updateBasePath() {
      this.basePath = `./assets/theme/${this.theme}/`;
    },
    getMainAnimation() {
      var that = this;
      setTimeout(() => {
        that.show = true;
        that.$nextTick(() => {
          gsap.to(that.$refs.inner, {
            opacity: 1,
            duration: 1
          });
          that.getTitleAnimation();
        });
      }, 100);
    },
    getTitleAnimation() {
      const pageTitle = this.$refs.pageTitle;
      const pageTitlel = this.$refs.pageTitlel;

      gsap.set([pageTitle, pageTitlel], {opacity: 0, width: '100%'});

      const tl = gsap.timeline();

      tl.to(pageTitle, {width: '100%', opacity: 1, duration: 1, ease: 'power1.inOut'})
          .to(pageTitlel, {width: '50%', opacity: 1, duration: 0.5});
    }
  }
}
</script>

<style lang="scss" scoped>
.itemBody {
  position: relative;
  width: 100%;
  height: 100%;

  .itemBody2 {
    position: relative;
    width: 100%;
    height: calc(100% - 0px);
  }

  .pageTitle {
    width: 100%;
    height: 43px;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    position: relative;

    .icon {
      width: 30px;
      display: flex;
      margin-left: 40px;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;
    }

    .pageTitlel {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      margin-left: 8px;
      margin-bottom: 3px;

      .text {
        opacity: 0;
        font-family: PingFang SC, PingFang SC;
        font-weight: bold;
        font-size: 18px;
        color: #00D1FF;
        text-shadow: 0px 3px 5px rgba(0, 25, 90, 0.3);
        transform: translateY(1em);
        animation: appear 0.5s forwards;
        animation-delay: var(--delay);
      }
    }

    .pageTitler {
      font-size: 12px;
      font-family: AlibabaPuHuiTiR;
      font-weight: 400;
      font-style: italic;
      color: #C6ECEB;
      margin-right: 15px;
      text-align: right;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .dot {
      width: 10px;
      height: 2px;
      background: #00D1FF;
      border-radius: 0px 0px 0px 0px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .itemBodyInner {
    position: relative;
    width: calc(100% - 0px);
    height: calc(100% - 43px);
    display: flex;
    background: linear-gradient(180deg, rgba(18, 127, 161, 0) 0%, rgba(18, 101, 161, 0.33) 100%);
    border-radius: 0px 0px 0px 0px;
    border: 1px solid;
    border-image: linear-gradient(180deg, rgba(0, 91, 157, 0.09), rgba(0, 91, 157, 0.67)) 1 1;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-direction: column;
    align-content: flex-start;
  }

  .itemBodyInner2 {
    height: calc(100% - 0px) !important;
  }

  .bg {
    height: 0%;
    margin-top: 5px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 0;
    background: linear-gradient(to bottom, #0f2b53, #0b3c6f);
  }
}

.itemBody.green {
  .pageTitle {
    //background: url("./assets/theme/green/titlebg.png") no-repeat;
    //background-size: 100% 100%;

    .pageTitlel {
      .text {
        color: #00FFB2;
        text-shadow: 0px 3px 5px rgba(0, 25, 90, 0.3);
      }
    }

    .pageTitler {
      font-size: 12px;
      font-family: AlibabaPuHuiTiR;
      font-weight: 400;
      font-style: italic;
      color: #C6ECEB;
      margin-right: 15px;
      text-align: right;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .dot {
      background: #00ffb2;
    }
  }

  .itemBodyInner {
    background: linear-gradient(180deg, rgba(18, 161, 127, 0) 0%, rgba(18, 161, 127, 0.33) 100%);
    border-radius: 0px 0px 0px 0px;
    border: 1px solid;
    border-image: linear-gradient(180deg, rgba(0, 157, 101, 0), rgba(0, 157, 101, 0.2)) 1 1;
  }

  .bg {
    height: 0%;
    margin-top: 5px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-top: 0;
    background: linear-gradient(to bottom, rgba(18, 161, 127, 0.33), rgba(18, 161, 127, 0.8));
  }
}

@keyframes appear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

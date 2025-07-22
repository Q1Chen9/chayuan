<template>
  <div class="soil-icon">
    <!-- 氮元素图标 -->
    <svg v-if="type === 'nitrogen'" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        ref="nitrogenPath1"
        d="M256 128v768h128V128H256z m384 0v768h128V128H640z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
      <path
        ref="nitrogenPath2"
        d="M384 128L640 896"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
    </svg>

    <!-- 磷元素图标 -->
    <svg v-if="type === 'phosphorus'" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        ref="phosphorusPath1"
        d="M256 128v768h128V128H256z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
      <path
        ref="phosphorusPath2"
        d="M384 128h256c88.4 0 160 71.6 160 160s-71.6 160-160 160H384V128z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
    </svg>

    <!-- 钾元素图标 -->
    <svg v-if="type === 'potassium'" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        ref="potassiumPath1"
        d="M256 128v768h128V128H256z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
      <path
        ref="potassiumPath2"
        d="M384 512L640 128"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
      <path
        ref="potassiumPath3"
        d="M384 512L640 896"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
    </svg>

    <!-- PH值图标 -->
    <svg v-if="type === 'ph'" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        ref="phPath1"
        d="M256 128v768h128V128H256z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
      <path
        ref="phPath2"
        d="M384 128h256c88.4 0 160 71.6 160 160s-71.6 160-160 160H384V128z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
      <path
        ref="phPath3"
        d="M588 448v448h128V448H588z"
        fill="none"
        stroke="currentColor"
        stroke-width="20"
      />
    </svg>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  name: 'SoilIcon',
  props: {
    type: {
      type: String,
      required: true,
      validator: value => ['nitrogen', 'phosphorus', 'potassium', 'ph'].includes(value)
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 动画效果实现
      if (this.type === 'nitrogen') {
        this.animateNitrogen();
      } else if (this.type === 'phosphorus') {
        this.animatePhosphorus();
      } else if (this.type === 'potassium') {
        this.animatePotassium();
      } else if (this.type === 'ph') {
        this.animatePh();
      }
    });
  },
  methods: {
    animateNitrogen() {
      const path1 = this.$refs.nitrogenPath1;
      const path2 = this.$refs.nitrogenPath2;
      
      if (!path1 || !path2) return;
      
      const length1 = path1.getTotalLength();
      const length2 = path2.getTotalLength();
      
      gsap.set([path1, path2], {
        strokeDasharray: (i) => i === 0 ? length1 : length2,
        strokeDashoffset: (i) => i === 0 ? length1 : length2,
        fill: 'none'
      });

      gsap.timeline()
        .to([path1, path2], {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.2
        })
        .to([path1, path2], {
          fill: 'currentColor',
          duration: 0.8,
          ease: "power2.inOut"
        });
    },
    animatePhosphorus() {
      const path1 = this.$refs.phosphorusPath1;
      const path2 = this.$refs.phosphorusPath2;
      
      if (!path1 || !path2) return;
      
      const length1 = path1.getTotalLength();
      const length2 = path2.getTotalLength();
      
      gsap.set([path1, path2], {
        strokeDasharray: (i) => i === 0 ? length1 : length2,
        strokeDashoffset: (i) => i === 0 ? length1 : length2,
        fill: 'none'
      });

      gsap.timeline()
        .to([path1, path2], {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.2
        })
        .to([path1, path2], {
          fill: 'currentColor',
          duration: 0.8,
          ease: "power2.inOut"
        });
    },
    animatePotassium() {
      const path1 = this.$refs.potassiumPath1;
      const path2 = this.$refs.potassiumPath2;
      const path3 = this.$refs.potassiumPath3;
      
      if (!path1 || !path2 || !path3) return;
      
      const length1 = path1.getTotalLength();
      const length2 = path2.getTotalLength();
      const length3 = path3.getTotalLength();
      
      gsap.set([path1, path2, path3], {
        strokeDasharray: (i) => i === 0 ? length1 : i === 1 ? length2 : length3,
        strokeDashoffset: (i) => i === 0 ? length1 : i === 1 ? length2 : length3,
        fill: 'none'
      });

      gsap.timeline()
        .to([path1, path2, path3], {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.15
        })
        .to([path1, path2, path3], {
          fill: 'currentColor',
          duration: 0.8,
          ease: "power2.inOut"
        });
    },
    animatePh() {
      const path1 = this.$refs.phPath1;
      const path2 = this.$refs.phPath2;
      const path3 = this.$refs.phPath3;
      
      if (!path1 || !path2 || !path3) return;
      
      const length1 = path1.getTotalLength();
      const length2 = path2.getTotalLength();
      const length3 = path3.getTotalLength();
      
      gsap.set([path1, path2, path3], {
        strokeDasharray: (i) => i === 0 ? length1 : i === 1 ? length2 : length3,
        strokeDashoffset: (i) => i === 0 ? length1 : i === 1 ? length2 : length3,
        fill: 'none'
      });

      gsap.timeline()
        .to([path1, path2, path3], {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.15
        })
        .to([path1, path2, path3], {
          fill: 'currentColor',
          duration: 0.8,
          ease: "power2.inOut"
        });
    }
  }
};
</script>

<style scoped>
.soil-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.icon {
  width: 24px;
  height: 24px;
}
</style> 
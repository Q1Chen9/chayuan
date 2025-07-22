<template>
  <div>
    <svg t="1728031864147" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="25" height="25">
      <path
        ref="path1"
        d="M453.294528 751.128186v107.513801a60.652085 60.652085 0 0 0 53.629212 60.269019l7.022873 0.383066a60.652085 60.652085 0 0 0 60.269019-53.565368L574.598697 858.705831v-107.577645h66.206539c12.896549 0.063844 24.707744 7.342094 30.453731 18.897913l102.15088 204.301759a34.029012 34.029012 0 0 1-30.453731 49.287799H278.55268a34.029012 34.029012 0 0 1-30.453731-49.287799l102.150879-204.301759a34.029012 34.029012 0 0 1 30.453731-18.834069H453.294528zM510.754398 0a510.754398 510.754398 0 0 1 288.06548 932.573686l-32.943659-54.906098a446.910098 446.910098 0 1 0-512.988948-1.915329l-32.879814 54.969942A510.754398 510.754398 0 0 1 510.754398 0z m33.645946 180.679368l187.446864 455.40139a34.029012 34.029012 0 0 1-31.411396 46.989405H546.890271v170.272747a34.029012 34.029012 0 0 1-68.058023 0v-170.272747H325.350551a34.029012 34.029012 0 0 1-31.475239-46.989405L481.38602 180.679368a34.092856 34.092856 0 0 1 63.014324 0z"
        fill="none"
        stroke="#00f8bf"
        stroke-width="40"
      />
    </svg>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  mounted() {
    this.$nextTick(() => {
      const path = this.$refs.path1;
      const length = path.getTotalLength();
      
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: 'none'
      });

      gsap.timeline()
        .to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut"
        })
        .to(path, {
          fill: '#00f8bf',
          duration: 1,
          ease: "power2.inOut"
        });
    });
  },
};
</script>

<style scoped>
.icon {
  width: 25px;
  height: 25px;
  font-size: 25px;
}
</style>

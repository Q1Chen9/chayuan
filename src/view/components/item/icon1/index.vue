<template>
  <div>
    <svg
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
    >
      <path
        ref="path1"
        d="M950.6 108c-6.2-7.1-15.2-11.2-24.6-11.2h-55.9c-211.9 0-370.9 2.2-489.1 30.8-61.4 12.3-118.9 39.1-167.7 78.3-47 40.6-80.4 94.7-95.6 154.9-11.4 47.4-13.6 96.5-6.4 144.7v0.1l0.1 0.4v0.1c2.8 18.5 6.9 36.7 12.3 54.5 8.4 27.1 21 52.7 37.3 75.9-64.2 102.8-96.8 151.3-96.8 263.1 0 8.6 3.4 16.8 9.5 22.9 6.1 6.1 14.3 9.5 22.9 9.5l0.6 0.9c8.6 0 16.9-3.4 23-9.6 6.1-6.1 9.5-14.4 9.4-23 0-98.9 29.2-170.1 67.2-225.3 59.1 62.6 138.4 90.7 223 98 12.7 1.5 25 1.5 37.3 1.5 64.7 0.3 128.3-16 184.9-47.3 78.2-46.1 142.3-112.8 185.3-192.7C886.2 432.4 930.5 298 958.9 134.2c1.2-9.5-1.8-19.1-8.3-26.2zM257.3 621.1c-22.2 25.1-72-8.6-51.8-30.8 35.1-38.4 236.8-254.4 502.9-302.2-274.7 111.5-420.8 298.9-451.1 333z"
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

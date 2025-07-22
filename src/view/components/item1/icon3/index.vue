<template>
  <div>
    <svg t="1728041062687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
      <path
        ref="path1"
        d="M822.792982 345.393404c-14.37193-14.37193-37.726316-14.37193-52.098245 0-17.964912 17.964912-176.05614 183.242105-176.056141 314.385964 0 132.940351 84.435088 229.950877 201.207018 229.950878 116.77193 0 201.207018-97.010526 201.207018-229.950878 0-131.14386-156.294737-296.421053-174.25965-314.385964z"
        fill="none"
        stroke="#00f8bf"
        stroke-width="20"
      />
      <path
        ref="path2"
        d="M335.94386 119.035509c-14.37193-14.37193-37.726316-14.37193-52.098246 0-10.778947 10.778947-256.898246 264.084211-256.898246 456.308772 0 190.42807 116.77193 323.368421 282.049123 323.368421s282.049123-132.940351 282.049123-323.368421c0-192.224561-246.119298-445.529825-255.101754-456.308772z m-32.336842 661.108772c-52.098246-12.575439-91.621053-39.522807-114.975439-79.045614-46.708772-80.842105-14.37193-183.242105-12.575439-188.631579l25.150878 7.185965 25.150877 7.185965s-26.947368 86.231579 7.185965 145.515789c16.168421 26.947368 41.319298 44.912281 79.045614 53.894737l-8.982456 53.894737z"
        fill="none"
        stroke="#00f8bf"
        stroke-width="20"
      />
    </svg>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  mounted() {
    this.$nextTick(() => {
      const path1 = this.$refs.path1;
      const path2 = this.$refs.path2;
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
          duration: 2,
          ease: "power2.inOut"
        })
        .to([path1, path2], {
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
  width: 20px;
  height: 20px;
  font-size: 20px;
}
</style>

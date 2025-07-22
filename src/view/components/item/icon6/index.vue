<template>
  <div>
    <svg
      t="1728031396858"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
    >
      <path
        ref="path1"
        d="M926.17 562.42q0 13.14-9.85 22.76a32.29 32.29 0 0 1-23.32 9.61H776.79q0 86.51-34.75 146.7l107.89 105.72q9.86 9.62 9.85 22.76t-9.85 22.77q-9.34 9.6-23.34 9.61t-23.34-9.61l-102.71-99.65a98.58 98.58 0 0 1-7.78 6.57q-5.19 4.05-21.78 14.42a331.36 331.36 0 0 1-33.72 18.46q-17.12 8.1-42.53 14.67a200.39 200.39 0 0 1-50.31 6.58V400.54H478v453.25a208 208 0 0 1-52.62-6.79q-26.2-6.84-45.13-16.7T346 810.54q-15.3-9.87-22.57-16.44l-7.76-7.1-94.91 104.73a33.58 33.58 0 0 1-24.9 10.62 34.24 34.24 0 0 1-22.31-8.09 32.13 32.13 0 0 1-10.63-22.52 31.69 31.69 0 0 1 8-23.51l104.82-114.84q-30.09-57.66-30.09-138.6H129.46a32.29 32.29 0 0 1-23.34-9.61q-9.84-9.61-9.85-22.76t9.85-22.76a32.31 32.31 0 0 1 23.34-9.61h116.19V381.32l-89.73-87.51q-9.85-9.62-9.86-22.76t9.86-22.77a33.15 33.15 0 0 1 46.68 0l89.73 87.52h437.78l89.73-87.52a33.16 33.16 0 0 1 46.69 0q9.86 9.61 9.85 22.77t-9.85 22.76l-89.73 87.51v148.73H893a32.29 32.29 0 0 1 23.34 9.61q9.85 9.6 9.86 22.76zM677.2 271h-332q0-67.28 48.5-114.57t117.48-47.3q69 0 117.49 47.3T677.21 271z m0 0"
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

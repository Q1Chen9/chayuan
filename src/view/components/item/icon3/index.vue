<template>
  <div>
    <svg
      t="1728030844702"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
    >
      <path
        ref="path1"
        d="M732.689655 0h-247.172414c-30.013793 0-52.965517 22.951724-52.965517 52.965517v812.137931h-70.62069v-812.137931c0-28.248276-22.951724-52.965517-52.965517-52.965517h-247.172414c-30.013793 0-52.965517 22.951724-52.965517 52.965517v918.068966c0 28.248276 22.951724 52.965517 52.965517 52.965517h247.172414c30.013793 0 52.965517-22.951724 52.965517-52.965517v-35.310345h70.62069v35.310345c0 28.248276 22.951724 52.965517 52.965517 52.965517h247.172414c30.013793 0 52.965517-22.951724 52.965517-52.965517v-918.068966c0-30.013793-22.951724-52.965517-52.965517-52.965517z m-564.965517 935.724138h-70.62069v-70.62069h70.62069v70.62069z m105.931034-776.827586h-176.551724v-70.62069h176.551724v70.62069z m317.793104 776.827586h-70.62069v-70.62069h70.62069v70.62069z m105.931034-776.827586h-176.551724v-70.62069h176.551724v70.62069zM963.972414 1024c-28.248276 0-51.2-22.951724-51.2-51.2v-921.6c0-28.248276 22.951724-51.2 51.2-51.2 28.248276 0 51.2 22.951724 51.2 51.2v921.6c0 28.248276-22.951724 51.2-51.2 51.2z"
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
  width: 22px;
  height: 22px;
  font-size: 22px;
}
</style>

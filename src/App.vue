<script setup>
import AIAssistant from './components/AIAssistant.vue'
</script>

<template>
  <router-view/>
  <AIAssistant />
</template>

<style lang="scss">
@import './fonts/iconfont/iconfont.css';
@import './fonts/all.min.css';
@import './fonts/fontawesome.css';

p {
  margin: 0;
}
@font-face {
  font-family: 'PangMenZhengDao';
  src: url('./fonts/PangMenZhengDao.TTF');
}

</style>

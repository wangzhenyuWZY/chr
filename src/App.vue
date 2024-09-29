<template>
  <div class="p-4 pt-2 min-h-screen relative pb-10">
    <router-view v-slot="{ Component, route }">
      <Header v-if="route.meta.showHeader" />
      <div class="py-3"><component :is="Component" /></div>

      <Footer v-if="route.meta.showHeader" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
// 监听路由变化
watch(() => route.fullPath, () => {
  setTimeout(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 平滑滚动
    });
  },500)
});
</script>

<style scoped></style>

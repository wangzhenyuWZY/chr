<template>
  <div class="flex">
    <div
      class="flex justify-start items-center py-2 px-5 bg-panelBg border border-solid border-borderBlack rounded-full"
    >
      <div @click="$router.go(-1)">
        <img src="@/assets/images/back.png" />
      </div>
      <i class="w-[1px] h-6 bg-borderBlack mx-4"></i>
      <h2 class="text-white text-lg font-bold text-center">{{ title }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['title']);
</script>

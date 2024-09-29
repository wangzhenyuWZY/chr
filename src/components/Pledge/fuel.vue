<template>
  <div class="pb-7">
    <div class="flex justify-between items-center">
      <div class="w-[90%]">
        <van-progress
          color="linear-gradient(to right, #FFB803, #FFF803)"
          stroke-width="8"
          track-color="#2E3333"
          :show-pivot="false"
          :percentage="remaining_fuel_pr"
        />
      </div>
      <span
        class="text-white text-xs leading-[22px] font-medium font-Montserrat"
        >{{remaining_fuel_pr}}%</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['remaining_fuel_amount','remaining_fuel_pr'])
</script>

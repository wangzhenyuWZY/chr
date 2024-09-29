<template>
  <div class="py-[30px] flex justify-center">
    <div
      class="flex justify-center items-center bg-textBlack bobrder border-solid border-borderBlack rounded-full overflow-hidden"
    >
      <span
        class="text-center leading-[30px] text-sm w-1/2 whitespace-nowrap min-w-[100px] font-bold"
        :class="action === 0 ? 'text-textBlack bg-bgYellow rounded-full': 'text-textGray'"
        @click="action = 0"
        >{{ $t('chr16') }}</span
      >
      <span
        class="text-center leading-[30px] text-sm w-1/2 whitespace-nowrap min-w-[100px] font-bold"
        :class="action === 1 ? 'text-textBlack bg-bgYellow  rounded-full': 'text-textGray'"
        @click="action = 1"
        >{{ $t('chr23') }}</span
      >
    </div>
  </div>
  <div>
    <PledgeInfo v-if="action === 0" />
    <EarnDetail type="earns" v-else />
  </div>
</template>
<script setup lang="ts">
const action = ref<number>(0);
</script>

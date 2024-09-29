<template>
  <div>
    <h2 class="text-textBlack1 text-xl text-center font-medium pb-6">
      {{ $t('chr10') }}
    </h2>
    <div class="bg-grayBg rounded-full w-full px-5 py-2 box-border mb-2.5">
      <input
        class="w-full text-base"
        :placeholder='$t("chr11")'
        v-model="inviteCode"
      />
    </div>
    <p class="text-textGray1 text-xs pb-6">{{ $t('chr12') }}</p>
    <div
      class="w-full rounded-full bg-bgYellow text-center h-11 text-base text-textBlack1 font-bold leading-[50px] cursor-pointer"
      @click="toBindInviteCode"
    >
      {{ $t('chr13') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['toBindInviteCode']);
const inviteCode = ref('');
const toBindInviteCode = () => {
  emit('toBindInviteCode', inviteCode.value);
}
</script>

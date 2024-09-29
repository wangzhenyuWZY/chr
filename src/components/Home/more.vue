<template>
  <!-- <div
    class="w-full rounded-full bg-textGreen1 text-textBlack1 text-base font-medium text-center leading-[44px] cursor-pointer mt-24"
    @click="commingsoon"
  >
    {{ $t('chr77') }}
  </div>
  <p class="pt-[102px] flex justify-center items-center text-xs text-white/60">
    <img src="@/assets/images/logo.png" class="h-6" />
    {{ $t('chr78') }}
  </p> -->
  <div class="text-center text-sm text-white px-[20%]">
    <div class="flex justify-center flex-col pt-[45px] pb-[35px]">
      <h2 class="text-[28px] font-bold pb-3">
        <span class="text-bgYellow font-bold">{{ $t('chr107') }}</span
        >{{ $t('chr108') }}
      </h2>
      <p class="pb-7">
        {{ $t('chr109') }}
      </p>
      <div class="text-center">
        <img src="@/assets/images/home_img3.svg" class="w-[114px]" />
      </div>
    </div>
    <div class="flex justify-center flex-col pt-[45px] pb-[35px]">
      <h2 class="text-[28px] font-bold pb-3">
        <span class="text-bgYellow font-bold">{{ $t('chr101') }}</span
        >{{ $t('chr102') }}
      </h2>
      <p class="pb-7">{{ $t('chr103') }}</p>
      <div class="text-center">
        <img src="@/assets/images/home_img1.svg" class="w-[114px]" />
      </div>
    </div>
    <div class="flex justify-center flex-col pt-[45px] pb-[35px]">
      <h2 class="text-[28px] font-bold pb-3">
        {{ $t('chr104')


        }}<span class="text-bgYellow font-bold">{{ $t('chr105') }}</span>
      </h2>
      <p class="pb-7">{{ $t('chr106') }}</p>
      <div class="text-center">
        <img src="@/assets/images/home_img2.svg" class="w-[114px]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useI18n } from 'vue-i18n';
// const { t } = useI18n();
// import { showToast } from 'vant';
// const commingsoon = () => {
// 	showToast(t('chr79'));
// }
</script>

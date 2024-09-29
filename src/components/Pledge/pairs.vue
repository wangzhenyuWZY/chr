<template>
  <div
    class="py-4 px-8 bg-panelBg flex justify-around items-center rounded-full"
  >
    <div class="w-[49%]">
      <h2 class="text-xs text-white pb-2.5 text-center">
        {{ $t('chr14') }}
      </h2>
      <p
        class="text-xl text-white font-bold text-center uppercase font-Montserrat"
      >
        {{ symbolInfo.name }}/USDT
      </p>
    </div>
    <div class="w-[1px] h-10 bg-[#555A5A]"></div>
    <div class="w-[49%]">
      <h2 class="text-xs text-white pb-2.5 text-center">{{ $t('chr15') }}</h2>
      <p
        class="text-xl text-white font-bold text-center uppercase  font-Montserrat"
      >
        {{ symbolInfo.price }}
      </p>
    </div>
  </div>
  <div class="my-4 relative">
    <div class="absolute top-[14px] left-[20px] w-full">
      <p class="text-white font-bold text-[28px]">
        {{ $t('chr110')}}
        <span class="text-bgYellow font-bold">{{ $t('chr111') }}</span>
      </p>
      <p class="text-white text-base max-w-[50%]">{{ $t('chr112') }}</p>
    </div>
    <img src="@/assets/images/pairBanner.png" class="w-full" />
  </div>
</template>

<script setup lang="ts">
import { getCoinPrice } from '@/api';

interface SymbolInfo {
	name: string;
	price: string;
	pr: string;
}
const symbolInfo = ref<SymbolInfo>({} as SymbolInfo);

getCoinPrice().then((res) => {
	if(res.code === 1){
		symbolInfo.value = res.data;
	}
})
</script>

<template>
  <div class="py-[68px]">
    <div class="flex justify-center">
      <img src="@/assets/images/logo.svg" />
    </div>
    <div class="flex justify-center pt-2 pb-5">
      <div
        class="bg-panelBg border border-solid border-[#1F2222] rounded py-1 px-2.5 flex justify-center items-center gap-2"
      >
        <span class="w-[6px] h-[6px] rounded-full bg-[#00CB8D]"></span>
        <span class="text-xs text-white font-bold">{{ $t('chr118') }}</span>
      </div>
    </div>
    <div
      class="border border-l-0 border-r-0 border-solid border-panelBg py-5 flex justify-around items-start"
    >
      <div>
        <h2 class="text-sm text-white font-bold pb-2.5">{{ $t('chr119') }}</h2>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr120') }}
        </p>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr121') }}
        </p>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr122') }}
        </p>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr123') }}
        </p>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr124') }}
        </p>
      </div>
      <div>
        <h2 class="text-sm text-white font-bold pb-2.5">{{ $t('chr125') }}</h2>
        <p class="text-textGray3 text-xs pb-1 font-normal">CHRChain</p>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr126') }}
        </p>
        <p class="text-textGray3 text-xs pb-1 font-normal">
          {{ $t('chr127') }}
        </p>
        <p class="text-textGray3 text-xs pb-1 font-normal">CHR Coin</p>
      </div>
    </div>
    <div class="border-0 border-b-1 border-solid border-panelBg py-5 ">
      <h2 class="text-sm font-bold text-center pb-4">{{ $t('chr128') }}</h2>
      <div class="flex justify-center items-center pb-5 gap-8">
        <a
          class="bg-bgYellow rounded-lg text-center flex justify-center items-center w-6 h-6"
          ><img class="" src="@/assets/images/link5.svg"
        /></a>
        <a
          class="bg-bgYellow rounded-lg text-center flex justify-center items-center w-6 h-6"
          ><img class="" src="@/assets/images/link4.svg"
        /></a>
        <a
          class="bg-bgYellow rounded-lg text-center flex justify-center items-center w-6 h-6"
          ><img class="" src="@/assets/images/link3.svg"
        /></a>
        <a
          class="bg-bgYellow rounded-lg text-center flex justify-center items-center w-6 h-6"
          ><img class="" src="@/assets/images/link2.svg"
        /></a>
        <a
          class="bg-bgYellow rounded-lg text-center flex justify-center items-center w-6 h-6"
          ><img class="" src="@/assets/images/link1.svg"
        /></a>
      </div>
      <div class="text-center text-xs text-white">
        {{ $t('chr129') }}
        <span class="text-bgYellow font-normal"
          >[https://www.coinhome.pro/mobile/]</span
        >
      </div>
    </div>
    <div class="py-4 flex justify-between items-center">
      <div class="flex justify-start items-center gap-6">
        <a class="text-textGray4 text-xs font-normal">{{ $t('chr130') }}</a>
        <a class="text-textGray4 text-xs font-normal">{{ $t('chr131') }}</a>
      </div>
      <div class="text-textGray4 text-xs font-normal">
        © 版权所有 CHRDAO, inc
      </div>
    </div>
  </div>
</template>

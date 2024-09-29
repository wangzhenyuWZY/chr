<template>
  <div class="border-0 border-b border-solid border-[#2A2C2E] pb-7">
    <div class="pt-10 pb-5">
      <h2 class="text-[32px] text-white font-bold text-center font-Montserrat">
        ${{ parseFloat(String(totalAssets)).toFixed(4) }}
      </h2>
      <p class="pt-1 text-sm font-bold text-white text-center w-1/2 mx-auto">
        <van-text-ellipsis
          rows="1"
          :content="address"
          position="middle"
          class="font-bold"
        />
      </p>
    </div>
    <div class='py-4 px-5 flex justify-between items-center'>
      <span class="text-sm text-white font-bold">{{ $t('chr5') }}</span>
      <p
        class="flex justify-center items-center text-sm text-white pt-1 font-medium"
        v-show="isShow"
        @click="$router.push('/assets/detail')"
      >
        {{ $t('chr54') }}
        <van-icon name="arrow" class="ml-2.5" />
      </p>
    </div>
    <div class="grid grid-cols-4 gap-2.5 pb-4">
      <div class="w-full rounded-full bg-bgYellow text-center h-[45px] text-base text-textBlack font-bold leading-[45px] cursor-pointer" @click='showRechage = true'>{{ $t('chr136') }}</div>
      <div
        class="w-full rounded-full text-center text-white text-base font-bold leading-[45px] border border-solid border-bgYellow"
         @click="showWithdraw = true"
      >
        {{ $t('chr90') }}
      </div>
      <div
        class="w-full rounded-full text-center text-white text-base font-bold leading-[45px] border border-solid border-bgYellow"
        @click='showSwap = true'
      >
        {{ $t('chr137') }}
      </div>
      <div
        class="w-full rounded-full text-center text-white text-base font-bold leading-[45px] border border-solid border-bgYellow"
        @click='showTransfer = true'
      >
        {{ $t('chr149') }}
      </div>
    </div>
    <div class="">
      <div
        class="bg-panelBg rounded-full py-4 px-5 flex justify-between items-center mb-2.5"
        v-for="(item,index) in myAssets"
        :key="index"
      >
        <p
          class="text-white text-sm font-bold pb-1.5 uppercase items-center flex justify-start"
        >
          <img
            :src="item.account === 'chr' ? ChrLogo : item.account === 'ac' ? AcLogo : item.account === 'usde' ? UsdeLogo : item.account === 'ect' ? EctLogo : UsdLogo"
            class="w-[26px] mr-2.5"
          />
          {{ item.account }}
        </p>
        <p
          class="text-sm text-white font-bold flex justify-end items-center font-Montserrat"
        >
          <div>
            <p class='font-bold text-right'>{{ item.balance }}</p>
            <p class='text-xs text-textGray5 font-bold text-right'>${{ item.usdt_price }}</p>
          </div>
          
          <a
            class="px-[18px] py-[5px] bg-bgYellow rounded-full text-textBlack text-xs font-bold ml-2.5"
            v-show='getAppend(item.account)'
            @click="toAppend(item)"
            >{{ $t('chr152') }}</a
          >
        </p>
      </div>
    </div>
    
  </div>
  <van-popup
    v-model:show="showWithdraw"
    position="bottom"
    round
    closeable
    :style="{ padding: '32px' }"
  >
    <Withdraw @withdraw="getAssets"/>
  </van-popup>
  <van-popup
    v-model:show="showRechage"
    position="bottom"
    round
    closeable
    :style="{ padding: '32px' }"
  >
    <Recharge @rechargeSuc="sucCallBack" />
  </van-popup>
  <van-popup
    v-model:show="showSwap"
    position="bottom"
    round
    closeable
    :style="{ padding: '32px' }"
  >
    <Swap @swapSuc="sucCallBack" />
  </van-popup>
  <van-popup
    v-model:show="showTransfer"
    position="bottom"
    round
    closeable
    :style="{ padding: '32px' }"
  >
    <Transfer @swapSuc="sucCallBack" />
  </van-popup>
  <van-popup
    v-model:show="showAppend"
    position="bottom"
    round
    closeable
    :style="{ padding: '32px' }"
  >
    <Reinvestment :appendAccount='appendAccount' @appendSuc="sucCallBack" />
  </van-popup>
</template>
<script setup lang="ts">
import { getMyAssets, getAppendAccount } from '@/api';
import { useRoute } from 'vue-router';
import { useAccount } from '@wagmi/vue';
import ChrLogo from '@/assets/images/coin_chr_logo.svg';
import AcLogo from '@/assets/images/coin_ac_logo.svg';
import UsdLogo from '@/assets/images/usdtLogo.svg';
import UsdeLogo from '@/assets/images/usdeLogo.svg';
import EctLogo from '@/assets/images/ectLogo.svg';
import eventBus from '@/utils/eventBus';
import Reinvestment from '../Pledge/reinvestment.vue';
const { address } = useAccount();
const route = useRoute();
const isShow = route.name === 'my' ? true : false
const showWithdraw = ref(false);
const showRechage = ref(false);
const showSwap = ref(false);
const showTransfer = ref(false);
const showAppend = ref(false);

interface Assets {
	account: string;
	balance: string;
	freeze_balance: string;
  usdt_price: string;
}
interface Append{
  account: string;
  min_amount: number;
  power: number;
}
const myAssets = ref<Assets[]>([]);
const appendAccound = ref<Append[]>([]);
const totalAssets = ref<number>(0);
const getAssets = () => {
	showWithdraw.value = false;
  totalAssets.value = 0;
	getMyAssets().then((res) => {
		if(res.code === 1){
			myAssets.value = res.data;
      res.data.forEach((item: Assets) => {
        totalAssets.value += Number(item.usdt_price)
      })
		}
	});
  getAppendAccount().then((res) => {
    if(res.code === 1){
      appendAccound.value = res.data;
    }
  })
}
getAssets();

const getAppend  = (account) => {
  let flag = false;
  if(appendAccound.value.length > 0){
    const res = appendAccound.value.find(item => item.account === account)
    if(res){
      flag = true;
    }else{
      flag = false;
    }
  }
  return flag;
}
const appendAccount = ref({});
const toAppend = (item) => {
  appendAccount.value = {
    ...item,
    appound: appendAccound.value.find(val => val.account === item.account)
  }
  console.log(appendAccount.value)
  showAppend.value = true;
}

const sucCallBack = () => {
  showWithdraw.value = false;
  showRechage.value = false;
  showSwap.value = false;
  showTransfer.value = false;
  showAppend.value = false;
  getAssets();
}

eventBus.on('loginRequest', getAssets);
</script>

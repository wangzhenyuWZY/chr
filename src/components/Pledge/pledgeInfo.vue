<template>
  <div class="p-7 bg-panelBg rounded-[40px]">
    <div class="pb-4">
      <p class="text-xs text-white ">{{ $t('chr17') }}</p>
      <p class="text-[26px] text-white font-bold font-Montserrat">
        {{ pledgeInfo.order_amount }}
      </p>
    </div>
    <div class="pb-4">
      <p class="text-xs text-white ">{{ $t('chr18') }}</p>
      <p class="text-[26px] text-white font-bold font-Montserrat">
        {{ pledgeInfo.remaining_fuel_amount }}
      </p>
    </div>
    <Fuel
      :remaining_fuel_amount="pledgeInfo.remaining_fuel_amount"
      :remaining_fuel_pr="pledgeInfo.remaining_fuel_pr"
    />
    <div class="grid grid-cols-2 gap-[6px] pb-3">
      <div class="py-4">
        <h2 class="text-xs text-white leading-[22px] pb-1.5">
          {{ $t('chr115') }}CHR
        </h2>
        <p class="text-white text-xl font-bold font-Montserrat">
          {{ todayChrEarn }}
        </p>
      </div>
      <div class="py-4">
        <h2 class="text-xs text-white leading-[22px] pb-1.5">
          {{ $t('chr116') }}CHR
        </h2>
        <p class="text-white text-xl font-bold font-Montserrat">
          {{  totalChrEarn }}
        </p>
      </div>
      <div class="py-4">
        <h2 class="text-xs text-white leading-[22px] pb-1.5">
          {{ $t('chr115') }}AC
        </h2>
        <p class="text-white text-xl font-bold font-Montserrat">
          {{  todayAcEarn }}
        </p>
      </div>
      <div class="py-4">
        <h2 class="text-xs text-white leading-[22px] pb-1.5">
          {{ $t('chr116') }}AC
        </h2>
        <p class="text-white text-xl font-bold font-Montserrat">
          {{  totalAcEarn }}
        </p>
      </div>
      <div class="py-4">
        <h2 class="text-xs text-white leading-[22px] pb-1.5">
          {{ $t('chr115') }}ECT
        </h2>
        <p class="text-white text-xl font-bold font-Montserrat">
          {{  todayEctEarn }}
        </p>
      </div>
      <div class="py-4">
        <h2 class="text-xs text-white leading-[22px] pb-1.5">
          {{ $t('chr116') }}ECT
        </h2>
        <p class="text-white text-xl font-bold font-Montserrat">
          {{  totalEctEarn }}
        </p>
      </div>
    </div>
    <!-- <div
      class="mt-9 w-full rounded-full text-center bg-bgYellow text-textBlack1 text-base font-bold leading-[50px]"
      @click="pledged(1)"
    >
      {{ $t('chr132') }}
    </div> -->
    <div
      class="mt-9 w-full rounded-full text-center text-bgYellow text-base font-bold leading-[50px] border border-solid border-bgYellow"
      @click="pledged(2)"
    >
      {{ $t('chr133') }}
    </div>
  </div>
  <van-popup
    v-model:show="pledgePopShow"
    round
    closeable
    position="bottom"
    :style="{ padding: '32px',width: '100%' }"
  >
    <PledgePop @getInfo="pledgeSuc" :type="type" />
  </van-popup>
</template>

<script setup lang="ts">
import { getMyPledge, getIncomeInfo } from '@/api'
import eventBus from '@/utils/eventBus';
const pledgePopShow = ref(false);
interface PledgeInfo {
	count_income_amount: number;
	order_amount: number;
	remaining_fuel_amount: number;
	remaining_fuel_pr: number;
	count_income_main_amount: number;
	count_income_sub_amount: number;
}

const pledgeInfo = ref<PledgeInfo>({} as PledgeInfo)
const queryMyPledgeInfo = () => {
  getMyPledge().then((res) => {
    if(res.code === 1){
      pledgeInfo.value = res.data
    }
  })
  queryIncomeInfo();
}


const getToday = () => {
  const date = new Date();
  date.setDate(date.getDate());
  const yy = date.getFullYear();
  const MM =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return `${yy}-${MM}-${dd}`;
}

const todayChrEarn = ref<number>(0);
const totalChrEarn = ref<number>(0);
const todayAcEarn = ref<number>(0);
const totalAcEarn = ref<number>(0);
const todayEctEarn = ref<number>(0);
const totalEctEarn = ref<number>(0);
const queryIncomeInfo = () => {
  const params = [
    {
      account: 'chr',
      date: getToday()
    },
    {
      account: 'chr'
    },
    {
      account: 'ac',
      date: getToday()
    },
    {
      account: 'ac'
    },
    {
      account: 'ect',
      date: getToday()
    },
    {
      account: 'ect'
    },
  ]
  params.forEach((item,index) => {
    getIncomeInfo(item).then((res)=>{
      if(res.code === 1){
        if(index === 0){
          todayChrEarn.value = res.data.amount;
        }
        if(index === 1){
          totalChrEarn.value = res.data.amount;
        }
        if(index === 2){
          todayAcEarn.value = res.data.amount;
        }
        if(index === 3){
          totalAcEarn.value = res.data.amount;
        }
        if(index === 4){
          todayEctEarn.value = res.data.amount;
        }
        if(index === 5){
          totalEctEarn.value = res.data.amount;
        }
      }
    })
  })
}

const type = ref<number>();
const pledged = (typeNum: number) => {
  type.value = typeNum;
  pledgePopShow.value = true
}

queryMyPledgeInfo();

const pledgeSuc = () => {
  queryMyPledgeInfo();
  pledgePopShow.value = false
}
eventBus.on('loginRequest', queryMyPledgeInfo);
</script>

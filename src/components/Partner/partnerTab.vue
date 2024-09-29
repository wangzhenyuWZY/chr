<template>
  <h2
    class="py-10 text-center text-base font-bold text-white"
    v-show="myPartner.length"
  >
    {{ $t('chr100') }}{{ myPartner[myPartner.length-1]?.name }}
  </h2>

  <div class="px-4">
    <div
      class="flex justify-center items-center border border-solid border-borderBlack rounded-full"
    >
      <div
        class="text-[13px] font-bold relative py-[6px] w-1/3 rounded-full text-center"
        v-for="(item, index) in partnerList"
        :class="action === index ? 'bg-bgYellow text-textBlack' : 'text-textGray'"
        @click="changeTab(index)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>

  <div class="py-4">
    <div class="w-full">
      <div class="pt-[33px] text-center">
        <img
          :src="action === 0 ? PartnerLogo1 : action === 1 ? PartnerLogo2 : PartnerLogo3"
          class="w-[130px]"
        />
        <p
          class="pt-[14px] text-xl font-bold"
          :class="{'text-white': action === 0, 'text-[#A999FF]': action === 1, 'text-bgYellow': action === 2}"
        >
          {{ curPartner.name }}
        </p>
      </div>
    </div>
    <div class="p-7 bg-panelBg rounded-2xl mt-10">
      <div class="flex justify-start items-center pb-5">
        <div class="pr-[90px]">
          <p class="text-white text-xs">{{ $t('chr40') }}</p>
          <p class="text-white text-xl font-bold font-Montserrat">
            {{ curPartner.price }}
          </p>
        </div>
        <!-- <div>
          <p class="text-white text-xs">{{ $t('chr41') }}</p>
          <p class="text-white text-xl font-bold font-Montserrat">
            {{ curPartner.stock }}
          </p>
        </div> -->
      </div>
      <div>
        <p class="text-white text-xs">{{ $t('chr42') }}</p>
        <p class="text-bgYellow text-lg font-bold font-Montserrat">
          {{ $t('chr80',{rewardNum: curPartner.reward_num}) }}
        </p>
      </div>
      <div
        class="mt-[50px] w-full rounded-full bg-bgYellow text-center text-base font-bold text-textBlack leading-[50px] cursor-pointer"
        @click="buyPopShow = true"
        v-show="!isBuyed"
      >
        {{ $t('chr43') }}
      </div>
    </div>
  </div>

  <van-popup
    v-model:show="buyPopShow"
    round
    closeable
    position="bottom"
    :style="{ padding: '32px',width: '100%' }"
  >
    <BuyPartner :curPartner="curPartner" @getInfo="buyCallBack" />
  </van-popup>
</template>

<script setup lang="ts">
import PartnerLogo1 from '@/assets/images/partnerLogo1.png';
import PartnerLogo2 from '@/assets/images/partnerLogo2.png';
import PartnerLogo3 from '@/assets/images/partnerLogo3.png';
import eventBus from '@/utils/eventBus';
import { getPartnerList, getMyPartner } from '@/api';
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
const action = ref(0);
const buyPopShow = ref(false);
interface GiveLevel {
	name: string;
}
interface Partner {
	name: string;
	price: number;
	stock: number;
	reward_num: number;
	give_level: GiveLevel;
  node_id: number;
}
const curPartner = ref<Partner>({} as Partner);
const partnerList = ref<Partner[]>([]);
const isBuyed = ref(false);


const queryPartnerList = () => {
  getPartnerList().then((res: any) => {
    if(res.code === 1){
      res.data.forEach((item,index) => {
        item.node_id = index + 1;
      })
      partnerList.value = res.data;
      changeTab(0);
    }
  })
}

interface BuyPartnerInfo {
  give_level_name: string;
  name: string;
  node_id: number;
  reward_num: number;
}
const myPartner = ref<BuyPartnerInfo[]>([]);
const queryMyPartner = () => {
  getMyPartner().then((res: any) => {
    if(res.code === 1){
      if(res.data){
        myPartner.value = res.data;
      }
    }
    queryPartnerList();
  })
}
queryMyPartner();

const changeTab = (index: number) => {
	action.value = index;
	curPartner.value = partnerList.value[index];
  const hasIdOne = myPartner.value.some((obj: BuyPartnerInfo) => obj.node_id === index+1);
  if(hasIdOne){
    isBuyed.value = true;
  }else{
    isBuyed.value = false;
  }
}

const buyCallBack = () => {
  buyPopShow.value = false;
  queryMyPartner();
}

eventBus.on('loginRequest', queryMyPartner);
</script>

<style scoped></style>

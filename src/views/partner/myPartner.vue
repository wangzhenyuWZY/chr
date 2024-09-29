<template>
  <ChildrenHeader :title="$t('chr49')" />
  <div class="py-4">
    <div class="w-full" v-show="hasNode">
      <div class="pt-[33px] text-center">
        <img
          :src="action === 1 ? PartnerLogo1 : action === 2 ? PartnerLogo2 : PartnerLogo3"
          class="w-[130px]"
        />
        <p
          class="pt-[14px] text-xl font-bold"
          :class="{'text-white': action === 1, 'text-[#A999FF]': action === 2, 'text-bgYellow': action === 3}"
        >
          {{ curPartner.name }}
        </p>
      </div>
    </div>
    <div class="p-7 bg-panelBg rounded-2xl mt-10">
      <div v-show="hasNode">
        <p class="text-white text-xs">{{ $t('chr42') }}</p>
        <p class="text-bgYellow text-lg font-bold">
          {{ $t('chr80',{rewardNum: curPartner.reward_num}) }}
        </p>
      </div>
      <div
        class="mt-[50px] w-full rounded-full bg-bgYellow text-center text-base font-bold text-textBlack leading-[50px] cursor-pointer"
        @click="buyPopShow = true"
        v-show="curPartner.node_id < 3 || !hasNode"
      >
        {{ $t('chr113') }}
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
    <BuyPartner :curPartner="nextPartner" @getInfo="buyCallBack" />
  </van-popup>
</template>

<script setup lang="ts">
import PartnerLogo1 from '@/assets/images/partnerLogo1.png';
import PartnerLogo2 from '@/assets/images/partnerLogo2.png';
import PartnerLogo3 from '@/assets/images/partnerLogo3.png';
import { getMyPartner, getPartnerList } from '@/api';
const action = ref<number>(0);
const buyPopShow = ref(false);
// interface GiveLevel {
// 	name: string;
// }
interface Partner {
	node_id: number;
	name: string;
	price: number;
	stock: number;
	reward_num: number;
	give_level_name: string;
}
const myPartner = ref<Partner[]>([]);
const curPartner = ref<Partner>({} as Partner);
const nextPartner = ref();
const partnerList = ref();
const hasNode = ref(false);
const queryPartnerList = () => {
  getPartnerList().then((res: any) => {
    if(res.code === 1){
      res.data.forEach((item,index) => {
        item.id = index + 1;
      })
      partnerList.value = res.data;
      queryMyPartner();
    }
  })
}
const queryMyPartner = () => {
  getMyPartner().then((res: any) => {
    if(res.code === 1){
      if(res.data){
        hasNode.value = true;
        myPartner.value = res.data;
        curPartner.value = myPartner.value[myPartner.value.length -1];
        action.value = curPartner.value.node_id;
        nextPartner.value = partnerList.value[myPartner.value.length]
      }else{
        nextPartner.value = partnerList.value[0]
      }
    }
  })
}
queryPartnerList();

const buyCallBack = () => {
  buyPopShow.value = false;
  queryPartnerList();
}
</script>

<style scoped>
.borderLinear::after{
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width:100%;
	height:1px;
	background: linear-gradient(to right, #09FA97, #141716)
}
.partnerBg{
	background:url('@/assets/images/partnerBg.png') no-repeat;
	background-size: 100% 100%;
}
.partnerBg1{
	background:url('@/assets/images/partnerBg1.png') no-repeat;
	background-size: 100% 100%;
}
.partnerBg2{
	background:url('@/assets/images/partnerBg2.png') no-repeat;
	background-size: 100% 100%;
}
</style>

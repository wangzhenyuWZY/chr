<template>
  <div class=" bg-panelBg rounded-[40px] p-7">
    <div class="overflow-x-scroll">
      <div class="flex justify-start items-center gap-3 text-center w-auto">
        <span
          class="pb-3 text-sm font-bold border-0 whitespace-nowrap"
          :class="action === 0 ? 'text-white border-b-[3px] border-bgYellow border-solid' : 'text-textGray'"
          @click="changeAction('', 0)"
          >{{ $t('chr96') }}</span
        >
        <span
          class="pb-3 text-sm font-bold border-0 whitespace-nowrap"
          :class="action === 1 ? 'text-white border-b-[3px] border-bgYellow border-solid' : 'text-textGray'"
          @click="changeAction('chr', 1)"
          >{{ $t('chr97') }}</span
        >
        <span
          class="pb-3 text-sm font-bold border-0 whitespace-nowrap"
          :class="action === 2 ? 'text-white border-b-[3px] border-bgYellow border-solid' : 'text-textGray'"
          @click="changeAction('ac', 2)"
          >{{ $t('chr98') }}</span
        >
        <span
          class="pb-3 text-sm font-bold border-0 font-Inter whitespace-nowrap"
          :class="action === 3 ? 'text-white border-b-[3px] border-bgYellow border-solid' : 'text-textGray'"
          @click="changeAction('ect', 3)"
          >{{ $t('chr99') }}</span
        >
        <span
          class="pb-3 text-sm font-bold border-0 font-Inter whitespace-nowrap"
          :class="action === 4 ? 'text-white border-b-[3px] border-bgYellow border-solid' : 'text-textGray'"
          @click="changeAction('usdt', 4)"
          >{{ $t('chr147') }}</span
        >
        <span
          class="pb-3 text-sm font-bold border-0 font-Inter whitespace-nowrap"
          :class="action === 5 ? 'text-white border-b-[3px] border-bgYellow border-solid' : 'text-textGray'"
          @click="changeAction('usde', 5)"
          >{{ $t('chr148') }}</span
        >
      </div>
    </div>

    <div class="">
      <!-- <div class="grid grid-cols-8 items-center text-white/40 text-sm pb-3">
        <span class="col-span-2">{{ $t('chr24') }}</span>
        <span class="col-span-2 text-center">{{ $t('chr25') }}</span>
        <span class="col-span-2 text-center">{{ $t('chr26') }}</span>
        <span class="col-span-2 text-right">{{ $t('chr27') }}</span>
      </div> -->
      <div
        class="overflow-y-scroll"
        :class="type == 'earns' ? 'h-[400px]' : 'h-[500px]'"
      >
        <van-empty
          :image="Nodata"
          image-size="40"
          :description="$t('chr28')"
          v-if="!earnList.length"
        />
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text=""
          @load="onLoad"
        >
          <div
            class="flex justify-between items-top py-3 text-white"
            v-for="(item, index) in earnList"
            :key="index"
          >
            <div class="flex justify-start items-baseline">
              <div>
                <img src="@/assets/images/icon_coin.png" class="w-5" />
              </div>

              <div class="pl-2">
                <p
                  class="  text-base font-bold uppercase font-Montserrat"
                  :class="item.amount > 0 ? 'text-textGreen' : 'text-[#ff6034]'"
                >
                  {{ item.amount }} {{ item.account}}
                </p>
                <p class="text-xs">{{ item.created_at }}</p>
              </div>
            </div>
            <span class="text-sm text-right">{{ item.msg }}</span>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssetsLog } from '@/api';
import Nodata from '@/assets/images/nodata.png';
const props = defineProps(['type'])
const loading = ref(false);
const finished = ref(false);
const curPage = ref(0);
const action = ref(0);
const account = ref<string>('');
interface earn {
	created_at: string;
	account: string;
	amount: number;
	type: string;
  msg: string;
}
const earnList = ref<earn[]>([]);
const onLoad = () => {
  curPage.value++;
  queryEarnList();
};
const changeAction = (accountName: string,index: number) => {
  action.value = index;
  earnList.value = [];
  curPage.value = 0;
  account.value = accountName;
  onLoad();
}

const queryEarnList = async () => {
  try {
    const res = await getAssetsLog({
      account: account.value,
      change: props.type == 'earns' ? 'in' : '',
      page: curPage.value,
    });
    loading.value = false;
    if (res.code === 1) {
      res.data.data.forEach((item: earn) => {
        earnList.value.push(item);
      });
      if (earnList.value.length >= res.data.total_rows) {
        finished.value = true;
      }
    }else {
			finished.value = true;
		}
  } catch (e) {
    loading.value = false;
		finished.value = true;
    console.log(e);
  }
};
</script>

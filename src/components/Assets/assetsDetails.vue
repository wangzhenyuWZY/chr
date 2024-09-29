<template>
  <div class="bg-panelBg2 p-4 rounded-lg mt-4">
    <div
      class="flex justify-start items-center text-base font-medium space-x-[30px]"
    >
      <span
        :class='action === 0 ? "text-white/90" : "text-white/40"'
        @click="changeAction(0)"
        >{{ $t('chr75') }}</span
      >
      <span
        :class='action === 1 ? "text-white/90" : "text-white/40"'
        @click="changeAction(1)"
        >{{ $t('chr76') }}</span
      >
    </div>

    <div class="p-4">
      <div class="grid grid-cols-8 items-center text-white/40 text-sm pb-3">
        <span class="col-span-2">{{ $t('chr24') }}</span>
        <span class="col-span-2 text-center">{{ $t('chr25') }}</span>
        <span class="col-span-2 text-center">{{ $t('chr26') }}</span>
        <span class="col-span-2 text-right">{{ $t('chr27') }}</span>
      </div>
      <div class="overflow-y-scroll h-[300px]">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="$t('chr28')"
          @load="onLoad"
        >
          <div
            class="grid grid-cols-8 items-center py-2 text-sm text-white/90 font-medium"
            v-for="(item, index) in earnList"
            :key="index"
          >
            <span class="col-span-2">{{ item.created_at }}</span>
            <span class="col-span-2 text-center">{{
              item.account
            }}</span>
            <span class="col-span-2 text-center">{{ item.amount }}</span>
            <span class="col-span-2 text-right">{{ item.msg }}</span>
          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAssetsLog } from '@/api';
import eventBus from '@/utils/eventBus';
const action = ref(0);
const loading = ref(false);
const finished = ref(false);
const curPage = ref(0);
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

const queryEarnList = async () => {
  try {
    const res = await getAssetsLog({
      account: action.value === 0 ? 'chr' : 'usdt',
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

const changeAction = (index: number) => {
	action.value = index;
	earnList.value = [];
	finished.value = false;
	curPage.value = 0;
	onLoad();
};
eventBus.on('loginRequest', queryEarnList);
</script>

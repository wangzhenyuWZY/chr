<template>
  <div>
    <h2 class="text-black text-base font-bold pb-6">
      {{ $t('chr56') }}
    </h2>
    <div class="flex justify-between items-center pb-2.5">
      <span class="text-sm text-black font-medium">{{ $t('chr25') }}</span>
      <span class="text-sm text-black font-medium"
        >{{ $t('chr57')






        }}<a class="font-bold">{{ curWithdrawInfo?.balance }}</a></span
      >
    </div>
    <div class=" mb-4">
      <div class="relative">
        <div
          class="flex justify-between items-center bg-bgGray p-3"
          @click="isShow = !isShow"
        >
          <div
            class="flex justify-start items-center text-sm text-black font-bold uppercase"
          >
            <img :src="curWithdrawInfo.src" class="w-[26px] mr-2.5" />
            {{ curWithdrawInfo.account }}
          </div>
          <van-icon name="arrow-down" />
        </div>
      </div>
    </div>
    <p class="text-sm text-black font-medium pb-2.5">{{ $t('chr26') }}</p>
    <div class="w-full rounded bg-bgGray flex justify-between items-center">
      <input
        class="px-2.5 py-4 text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold"
        :placeholder='$t("chr59")'
        type="number"
        v-model.number="withdrawAmount"
        @update:model-value="getExpectedReceive"
      />
      <span
        class="text-textBlack text-sm font-bold pr-2.5"
        @click="withdrawAmount = Number(curWithdrawInfo.balance)"
        >MAX</span
      >
    </div>
    <div class="pt-2.5 pb-1 flex justify-between items-center">
      <span class="text-sm text-black">{{ $t('chr60') }}</span>
      <span class="text-sm text-black font-bold uppercase"
        >{{ expectedReceive }} {{ curWithdrawInfo.account }}</span
      >
    </div>
    <div class="pb-3 flex justify-between items-center">
      <span class="text-sm text-black">{{ $t('chr61') }}</span>
      <span class="text-sm text-black font-bold uppercase"
        >{{ curWithdrawInfo.withdraw_fee_type === 1 ? curWithdrawInfo.withdraw_fee * 100 : curWithdrawInfo.withdraw_fee }}
        {{ curWithdrawInfo.withdraw_fee_type === 1 ? '%' : curWithdrawInfo.account }}</span
      >
    </div>
    <p class="text-textGreen2 text-sm">
      {{ $t('chr62', {num: curWithdrawInfo.min_withdraw_amount}) }}
    </p>
    <div
      class="mt-9 w-full rounded-full bg-bgYellow text-center leading-[50px] text-base text-textBlack font-bold cursor-pointer"
      @click="withdraw"
    >
      {{ $t('chr13') }}
    </div>
  </div>
  <van-popup
    v-model:show="isShow"
    position="bottom"
    round
    :style="{ padding: '32px' }"
  >
    <h2 class="text-base text-black font-bold pb-5">
      <van-icon name="arrow-left" />{{ $t('chr138') }}
    </h2>
    <div
      class="py-3 flex justify-between items-center"
      v-for="(item,index) in withdrawInfo"
      :key="index"
      @click="changeCurCoin(item)"
    >
      <div
        class="flex justify-start items-center text-sm text-black font-bold uppercase"
      >
        <img :src="item.src" class="w-[26px] mr-2.5" />
        {{ item.account }}
      </div>
      <span class="text-sm text-black font-medium"
        >{{ $t('chr57')}}<a class="font-bold">{{ item.balance }}</a></span
      >
    </div>
  </van-popup>
</template>

<script setup lang="ts">
// import { useAccount } from '@wagmi/vue';
import { getWithdrawAccount, doWithdraw, getChainInfo, getMyAssets } from '@/api';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import ChrLogo from '@/assets/images/coin_chr_logo.svg';
import AcLogo from '@/assets/images/coin_ac_logo.svg';
import UsdLogo from '@/assets/images/usdtLogo.svg';
import UsdeLogo from '@/assets/images/usdeLogo.svg';
import EctLogo from '@/assets/images/ectLogo.svg';
// const { address } = useAccount();
const { t } = useI18n();
const emit = defineEmits(['withdraw']);
const isShow = ref(false);

interface WithdrawInfo {
	account: string;
	withdraw_fee_type:number;
	min_withdraw_amount:number;
	max_withdraw_amount:number;
	multiple_amount:number;
	withdraw_fee:number;
  src: string;
  balance: string;
}
const withdrawInfo = ref<WithdrawInfo[]>([]);
const curWithdrawInfo = ref<WithdrawInfo>({} as WithdrawInfo);

interface Assets {
	account: string;
	balance: string;
	freeze_balance: string;
  usdt_price: string;
}
const myAssets = ref<Assets[]>([]);
const getAssets = () => {
	getMyAssets().then((res) => {
		if(res.code === 1){
			myAssets.value = res.data;
      queryWithdrawAccount();
		}
	});
}
getAssets();

const withdrawAmount = ref<number>();
interface ChainInfo {
	chain: string;
	rpc_url: string;
	chain_id: number;
	browser_url: string;
}
const chainInfo = ref<ChainInfo>({} as ChainInfo);
getChainInfo().then((res) => {
	if(res.code === 1){
		chainInfo.value = res.data;
	}
})
const withdraw = () => {
	if(!withdrawAmount.value ) {
		showToast(t('chr86'));
		return
	} else if (Number(withdrawAmount.value) > Number(curWithdrawInfo.value.balance)) {
		showToast(t('chr46'));
		return
	}
	const params = {
		chain: chainInfo.value.chain,
		account: curWithdrawInfo.value.account,
		amount: withdrawAmount.value,
	}
	doWithdraw(params).then((res) => {
		if(res.code === 1){
			showToast(t('chr84'));
			emit('withdraw');
		} else {
			showToast(t('chr85'));
		}
	})

}

const queryWithdrawAccount = () => {
  getWithdrawAccount().then((res) => {
    if(res.code === 1){
      res.data.forEach((item)=>{
        if(item.account === 'chr'){
          item.src = ChrLogo
          const result = myAssets.value.find(assets => assets.account === "chr");
          item.balance = result?.balance;
        } else if (item.account === 'usdt'){
          item.src = UsdLogo
          const result = myAssets.value.find(assets => assets.account === "usdt");
          item.balance = result?.balance;
        } else if (item.account === 'usde'){
          item.src = UsdeLogo
          const result = myAssets.value.find(assets => assets.account === "usde");
          item.balance = result?.balance;
        } else if (item.account === 'ac'){
          item.src = AcLogo
          const result = myAssets.value.find(assets => assets.account === "ac");
          item.balance = result?.balance;
        } else if (item.account === 'ect'){
          item.src = EctLogo
          const result = myAssets.value.find(assets => assets.account === "ect");
          item.balance = result?.balance;
        }
        withdrawInfo.value.push(item);
      })
      curWithdrawInfo.value = withdrawInfo.value[0];
    }
  })
}

const changeCurCoin = (item:WithdrawInfo) => {
  isShow.value = false;
  curWithdrawInfo.value = item;
}


const expectedReceive = ref<number>();
const getExpectedReceive = () => {
	if(withdrawAmount.value) {
		if(curWithdrawInfo.value.withdraw_fee_type === 1){
			expectedReceive.value = withdrawAmount.value - withdrawAmount.value * curWithdrawInfo.value.withdraw_fee;
		}else{
			expectedReceive.value = withdrawAmount.value - curWithdrawInfo.value.withdraw_fee;
		}
	}
}
</script>

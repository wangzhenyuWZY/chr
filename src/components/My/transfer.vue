<template>
  <div>
    <h2 class="text-black text-base font-bold pb-6">
      {{ $t('chr149') }}
    </h2>
    <div class="flex justify-between items-center pb-2.5">
      <span class="text-sm text-black font-medium">{{ $t('chr47') }}</span>
    </div>
    <div class=" bg-bgGray px-3 mb-4">
      <van-field
        v-model="receiveAddress"
        :placeholder='$t("chr150")'
        class="text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold pl-2.5 text-right w-full"
        style="background: #F0F0F0;color:#000;font-weight: bold;"
      />
      <!-- <input
        class="text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold pl-2.5 text-right w-2/3"
        :placeholder='$t("chr141")'
        type="number"
        v-model.number="sendAmount"
      /> -->
    </div>
    <!-- <div class="flex justify-center items-center py-4">
      <img src="@/assets/images/swapIcon.svg" width="32px" />
    </div> -->
    <div class="flex justify-between items-center pb-2.5">
      <span class="text-sm text-black font-medium">{{ $t('chr26') }}</span>
      <span class="text-sm text-black font-medium">
        {{ $t('chr57')}}
        <a class="font-bold">{{ receiveCoinInfo?.balance }}</a>
      </span>
    </div>
    <div class="flex justify-between items-center bg-bgGray px-3 mb-4">
      <div class="relative w-1/3">
        <div
          class="flex justify-start items-center text-sm text-black font-bold uppercase gap-2.5"
          @click="isAccountShow = !isAccountShow"
        >
          <img :src="receiveCoinInfo.src" class="w-[26px]" />
          {{ receiveCoinInfo.account }}
          <van-icon name="arrow-down" />
        </div>

        <div
          class="w-full absolute top-[38px] left-[-10px] p-2.5 bg-bgGray flex flex-col gap-1"
          v-show="isAccountShow"
        >
          <div
            class="flex justify-start items-center text-sm text-black font-bold uppercase gap-2.5"
            v-for="(item,index) in myAssets"
            :key="index"
            @click="changeSendCoin(item)"
            v-show="item.account !== receiveCoinInfo.account && (item.account === 'usde' || item.account === 'usdt')"
          >
            <img :src="item.src" class="w-[26px]" />
            {{ item.account }}
          </div>
        </div>
      </div>
      <van-field
        type="digit"
        v-model="sendAmount"
        :placeholder='$t("chr142")'
        class="text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold pl-2.5 text-right w-2/3"
        style="background: #F0F0F0;color:#000;font-weight: bold;"
      />
      <!-- <input
        class="text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold pl-2.5 text-right w-2/3"
        :placeholder='$t("chr142")'
        type="number"
        v-model.number="receiveAmount"
      /> -->
    </div>
    <!-- <div class="flex justify-between items-center">
      <span class="text-sm text-black font-medium">{{ $t("chr61") }}</span>
      <span class="text-sm text-black font-bold">1 USDT ≈ {{ pr }} USDE</span>
    </div> -->
    <div
      class="mt-9 w-full rounded-full bg-bgYellow text-center leading-[50px] text-base text-textBlack font-bold cursor-pointer"
      @click="toSwap"
    >
      {{ $t('chr13') }}
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useAccount } from '@wagmi/vue';
import {  useSignMessage,useAccount,useConnect  } from '@wagmi/vue';
import {  userTransfer, getChainInfo, getMyAssets, getRechagePr } from '@/api';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import ChrLogo from '@/assets/images/coin_chr_logo.svg';
import AcLogo from '@/assets/images/coin_ac_logo.svg';
import UsdLogo from '@/assets/images/usdtLogo.svg';
import UsdeLogo from '@/assets/images/usdeLogo.svg';
import EctLogo from '@/assets/images/ectLogo.svg';
// const { address } = useAccount();
const { t } = useI18n();
const emit = defineEmits(['swapSuc']);
const {  address } = useAccount();
const { connectors } = useConnect();
const isAccountShow = ref(false);

const pr = ref();
getRechagePr().then((res)=>{
  if(res.code === 1){
    pr.value = res.data.pr;
  }
})
const sendAmount = ref();
// const sendCoinInfo = ref(computed(()=>{
//   const sendCoin = myAssets.value.find((item)=> item.account === 'usdt')
//   return sendCoin || {} as Assets;
// }))

interface Assets {
	account: string;
	balance: string;
	freeze_balance: string;
  usdt_price: string;
  src: string;
}

const receiveAddress = ref<string>();
const receiveCoinInfo = ref<Assets>({} as Assets);
const myAssets = ref<Assets[]>([]);
const getAssets = () => {
	getMyAssets().then((res) => {
		if(res.code === 1){
			myAssets.value = res.data;
      res.data.forEach((item) => {
        if(item.account === 'chr'){
          item.src = ChrLogo;
        } else if (item.account === 'usdt'){
          item.src = UsdLogo
          receiveCoinInfo.value = item;
        } else if (item.account === 'usde'){
          item.src = UsdeLogo

        } else if (item.account === 'ac'){
          item.src = AcLogo
        } else if (item.account === 'ect'){
          item.src = EctLogo
        }
      })
		}
	});
}
getAssets();


const changeSendCoin = (item: Assets) => {
  receiveCoinInfo.value = item;
  isAccountShow.value = false;
}
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
// 签名
const signMsg = ref();
const { signMessageAsync } = useSignMessage();
const sign = async () => {
  const signMessages = await signMessageAsync({
    message: 'CHR Transfer ' + sendAmount.value + receiveCoinInfo.value.account,
    account: address.value,
    connector: connectors[0],
  });
  return signMessages;
};
const toSwap = async() => {
	if(!sendAmount.value ) {
		showToast(t('chr86'));
		return
	} else if ( Number(sendAmount.value) > Number(receiveCoinInfo.value.balance)) {
		showToast(t('chr46'));
		return
	}
  signMsg.value = await sign();
	const params = {
		address: receiveAddress.value,
		account: receiveCoinInfo.value.account,
		amount: sendAmount.value,
    sign: signMsg.value
	}
	userTransfer(params).then((res) => {
		if(res.code === 1){
			getAssets();
			showToast(t('chr151'));
			emit('swapSuc');
		} else {
			showToast(res.message);
		}
	})

}
</script>

<style>
.van-field__control{
  font-weight: bold;
}
</style>

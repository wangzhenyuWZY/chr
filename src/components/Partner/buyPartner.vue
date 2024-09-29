<template>
  <div v-if="!isSuc">
    <h2 class="text-black text-base font-bold pb-[30px]">
      {{ $t('chr45', { name: curPartner.name }) }}
    </h2>
    <p
      class="text-center text-2xl text-textBlack font-bold pb-[30px] font-Montserrat"
    >
      {{ curPartner.price }} USDT
    </p>
    <div
      class="flex justify-center items-center w-full rounded-full bg-bgYellow text-center font-bold text-textBlack text-base leading-[50px] cursor-pointer"
      @click="toBuy"
    >
      <van-loading type="spinner" size="20" color="#09FA97" v-if="isLoading" />
      {{ $t('chr44') }}
    </div>
  </div>
  <div v-else>
    <div class="text-center py-[70px]">
      <img src="@/assets/images/icon_suc.png" class="w-[72px]" />
      <p class="pt-2.5 text-lg font-bold text-textBlack">{{ $t('chr83') }}</p>
    </div>
    <div
      class="flex justify-center items-center w-full rounded-full bg-bgYellow text-center font-bold text-textBlack text-base leading-[50px] cursor-pointer"
      @click="toCallback"
    >
      OK
    </div>
  </div>
</template>

<script setup lang="ts">
// import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useConnect, useSignMessage, useAccount } from '@wagmi/vue';
// import tokenAbi from '@/contracts/token.json';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import {  userNodeBuy, getMyAssets  } from '@/api';
// import { config } from '@/plugins/config';
// import { formatEther, parseEther } from 'viem';
// const { writeContract } = useWriteContract();
const props = defineProps(['curPartner']);
const { t } = useI18n();
const isLoading = ref(false);
const emit = defineEmits(['getInfo']);
// 签名
const { connectors } = useConnect();
const { signMessageAsync } = useSignMessage();
const { address } = useAccount();
const isSuc = ref(false);
const sign = async () => {
  const signMessages = await signMessageAsync({
    message: 'CHR Buy Partner ' + props.curPartner.price + ' USDT',
    account: address.value,
    connector: connectors[0],
  });
  return signMessages;
};

// 获取usdt地址
// const receiveSymbol = ref();
// getContractInfo().then((res: any) => {
// 	if (res.code === 1) {
// 		receiveSymbol.value = res.data[0];
// 		toGetToken();
// 	}
// })

// 获取用户usdt余额
const myUsdtBalance = ref();
// const toGetToken = async () => {
//   const usdtBalance: any = await readContract(config, {
//     abi: tokenAbi,
//     address: receiveSymbol.value.contract_address,
//     functionName: 'balanceOf',
//     args: [address.value],
//   });
//   myUsdtBalance.value = formatEther(usdtBalance);
// };


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
      let usdtAssets = res.data.find(item => item.account === "usdt")
      myUsdtBalance.value = usdtAssets.balance;
		}
	});
}
getAssets();

const toBuy = async () => {
	if(isLoading.value){
		return;
	}
	if(myUsdtBalance.value < props.curPartner.price) {
		showToast(t('chr46'));
		return
	}

	isLoading.value = true;
  try{
    await sign();
    const params = {
      id: props.curPartner.id
    }
    userNodeBuy(params).then((res) => {
      if(res.code === 1){
        showToast(t('chr83'));
        isLoading.value = false;
        isSuc.value = true;
      } else {
        isLoading.value = false;
        showToast(res.message);
      }
    })
    // let amount = parseEther(String(props.curPartner.price));
    // writeContract(
    //   {
    //     address: receiveSymbol.value.contract_address,
    //     abi: tokenAbi,
    //     functionName: 'transfer',
    //     args: [props.curPartner.receipt_address, amount],
    //   },
    //   {
    //     onSuccess(data) {
    //       toGetHash(data);
    //     },
    //     onError(error) {
    //       console.log(error);
    //       isLoading.value = false;
    //       showToast(t('chr81'));
    //     },
    //   }
    // );
  }catch(e){
    isLoading.value = false;
    showToast(t('chr81'));
  }

};


// 根据hash查询交易状态
// const toGetHash = async (hash) => {
//   const transactionReceipt = await waitForTransactionReceipt(config, {
//     hash: hash,
//   });
//   if (transactionReceipt.status) {
//     setTimeout(() => {
//       // 交易成功后回调
//       getPledgeStatus(hash);
//     }, 3000);
//   } else {
//     isLoading.value = false;
//     showToast(t('chr81'));
//   }
// };

// 查询后台状态
// const getPledgeStatus = (hash) => {
//   getChainNotify({hash: hash}).then((res: any) => {
//     if (res.code === 1) {
//       showToast(t('chr83'));
//       isLoading.value = false;
//       isSuc.value = true;
//     } else {
//       setTimeout(() => {
//         getPledgeStatus(hash);
//       },2000)
//     }
//   })
// }

const toCallback = () => {
  isSuc.value = false;
  emit("getInfo");
}
</script>

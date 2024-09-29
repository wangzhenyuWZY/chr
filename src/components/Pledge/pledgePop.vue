<template>
  <div>
    <h2 class="text-textBlack font-bold text-base pb-6">
      {{ type === 1 ? $t('chr132') : $t('chr133') }}
    </h2>
    <div class="relative" v-show="false">
      <div
        class="rounded border border-solid border-textGray2 w-full box-border text-right px-2 py-1 cursor-pointer"
      >
        <div class="flex justify-end items-center" @click="isShow = !isShow">
          <span
            class="text-sm pr-2 uppercase"
            >{{ curReceiveAccount?.account }}</span
          >
          <van-icon name="arrow-down" />
        </div>
      </div>
      <div
        class="absolute left-0 rounded border border-solid border-textGray2 bg-grayBg px-3 z-10 w-1/2 mt-1"
        v-show="isShow"
      >
        <p
          class="text-sm border-0 first:border-b border-solid uppercase"
          v-for="(item,index) in receiveAccount"
          :key="index"
          @click="changeCurReceive(item)"
        >
          {{ item.account }}
        </p>
      </div>
    </div>
    <div class="bg-bgGray p-3 mb-2">
      <div
        class="flex justify-start items-center text-sm text-black font-bold"
        v-if="type === 1"
      >
        <img src="@/assets/images/chrLogo.svg" class="w-[26px] mr-2.5" />
        CHR
      </div>
      <div
        class="flex justify-start items-center text-sm text-black font-bold"
        v-else
      >
        <img src="@/assets/images/usdtLogo.svg" class="w-[26px] mr-2.5" />
        USDT
      </div>
    </div>
    <div
      class="flex justify-between place-items-start relative"
      v-if="type === 1"
    >
      <p class="text-black text-xs leading-4 pb-2.5 font-medium">
        {{$t('chr134')}}CHR
      </p>
      <span
        class="text-xs font-bold uppercase font-Montserrat"
        >{{ myAssets[1]?.balance }}</span
      >
    </div>
    <div class="flex justify-between place-items-start relative" v-else>
      <p class="text-black text-xs leading-4 pb-2.5 font-medium">
        {{$t('chr134')}}USDT
      </p>
      <span
        class="text-xs font-bold uppercase font-Montserrat"
        >{{ myAssets[0]?.balance }}</span
      >
    </div>
    <div class="flex justify-between place-items-start relative">
      <p class="text-black text-xs leading-4 pb-2.5 font-medium">
        {{$t('chr134')}}USDE
      </p>
      <span
        class="text-xs font-bold uppercase font-Montserrat"
        >{{ myAssets[4]?.balance }}</span
      >
    </div>
    <div class="w-full box-border bg-bgGray rounded-xs">
      <van-field
        type="digit"
        v-model="pledgeAmount"
        :placeholder="$t('chr31',{num: curReceiveAccount?.min_amount})"
        class="w-full box-border py-2 px-4 text-sm text-black font-bold placeholder:font-medium placeholder:text-[#ADADAD] font-Montserrat"
        style="background: #F0F0F0;color:#000;font-weight: bold;"
      />
      <!-- <input
        class="w-full box-border py-2 px-4 text-sm font-bold placeholder:font-medium placeholder:text-[#ADADAD] font-Montserrat"
        v-model="pledgeAmount"
        :placeholder="$t('chr31',{num: curReceiveAccount?.min_amount})"
      /> -->
    </div>
    <p
      class="text-black text-xs leading-4 pt-1.5 flex justify-between items-center font-medium"
      v-if="type === 1"
    >
      {{$t('chr32')}}
      <span class="text-xs font-bold uppercase font-Montserrat">
        {{ estimatedPay?.chr }} CHR
      </span>
    </p>
    <p
      class="text-black text-xs leading-4 pt-1.5 flex justify-between items-center font-medium"
      v-else
    >
      {{$t('chr32')}}
      <span class="text-xs font-bold uppercase font-Montserrat">
        {{ estimatedPay?.usdt }} USDT
      </span>
    </p>
    <p
      class="text-black text-xs leading-4 pt-1.5 flex justify-between items-center font-medium"
    >
      {{$t('chr32')}}
      <span class="text-xs font-bold uppercase font-Montserrat">
        {{ estimatedPay?.usde }} USDE
      </span>
    </p>
    <div
      class="mt-6 flex justify-center items-center w-full rounded-full bg-bgYellow text-center h-11 text-base text-textBlack font-bold leading-[44px] cursor-pointer"
      @click="toPledge"
    >
      <van-loading type="spinner" size="20" color="#09FA97" v-if="isLoading" />
      <span class="ml-2 font-bold">{{ $t('chr13') }}</span>
    </div>
    <p class="text-center pt-4 text-sm text-[#ADADAD]">
      {{ $t('chr135',{min: curReceiveAccount?.min_amount, account: type === 1 ? 'CHR+USDE' : 'USDT+USDE'}) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { readContract } from '@wagmi/core';
import { useConnect, useSignMessage, useAccount } from '@wagmi/vue';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import { CHR } from '@/contracts'
import { getMineInfo, getContractInfo, getMyAssets, minePledge } from '@/api';
import { config } from '@/plugins/config';
import { formatEther } from 'viem';
// const { writeContract } = useWriteContract();
const emit = defineEmits(['getInfo']);
const props = defineProps(['type'])
const { t } = useI18n();
const pledgeAmount = ref('');
const isLoading = ref(false);
const receiveAccount = ref();
const curReceiveAccount = ref();
const receiveSymbol = ref();
const isShow = ref(false);
const estimatedPay = computed(()=> {
  if(pledgeAmount.value && props.type === 1){
    return {
      chr: Number(pledgeAmount.value) * 0.8,
      usde: Number(pledgeAmount.value) * 0.2,
    }
  } else if(pledgeAmount.value && props.type === 2){
    return {
      usdt: Number(pledgeAmount.value) * 0.8,
      usde: Number(pledgeAmount.value) * 0.2,
    }
  } else{
    return {
      chr: 0,
      usdt: 0,
      usde: 0,
    }
  }
})
const isMultipleOf100 = (num: number): boolean => {
  return num % Number(curReceiveAccount.value?.min_amount) === 0;
}
const getPledgeInfo = () => {
  getMineInfo().then((res: any) => {
    if (res.code === 1) {
      receiveAccount.value = res.data;
      curReceiveAccount.value = props.type === 1 ? res.data[1] : res.data[0];
      getContractInfo().then((res: any) => {
        if (res.code === 1) {
          receiveSymbol.value = res.data;
          toGetToken();
        }
      })
    }
  })

}

watch(() => props.type, () => {
  getPledgeInfo();
});
getPledgeInfo();


const changeCurReceive = (item: any) => {
  curReceiveAccount.value = item;
  isShow.value = false;
}
// 签名
const signMsg = ref();
const { connectors } = useConnect();
const { signMessageAsync } = useSignMessage();
const { address } = useAccount();
const sign = async () => {
  const signMessages = await signMessageAsync({
    message: 'CHR Pledge ' + pledgeAmount.value + curReceiveAccount.value?.account,
    account: address.value,
    connector: connectors[0],
  });
  return signMessages;
};

// 获取用户chr余额
const myUsdtBalance = ref();
const toGetToken = async () => {
  let contract_address: any = '';
  receiveSymbol.value.forEach((item: any) => {
    if (item.account === curReceiveAccount.value.account) {
      contract_address = item.contract_address
    }
  })
  const usdtBalance: any = await readContract(config, {
    abi: CHR.abi,
    address: contract_address,
    functionName: 'balanceOf',
    args: [address.value],
  });
  myUsdtBalance.value = formatEther(usdtBalance);
};

const toPledge = async () => {
  if (isLoading.value) {
    return;
  }
  if (pledgeAmount.value === '') {
		showToast(t('chr33'));
		return
	} else if(!isMultipleOf100(Number(pledgeAmount.value))){
    showToast(t('chr36',{num: curReceiveAccount.value?.min_amount}));
    return;
  }
  // let amount = parseEther(String(pledgeAmount.value));
  isLoading.value = true;
	signMsg.value = await sign();
  const res = await minePledge({id:curReceiveAccount.value.id,amount: pledgeAmount.value,sign: signMsg.value});
  if(res.code === 1){
    showToast(t('chr34'));
    isLoading.value = false;
    emit('getInfo');
  }else{
    isLoading.value = false;
    showToast(res.message);
  }
  // let contract_address: any = '';
  // receiveSymbol.value.forEach((item: any) => {
  //   if (item.account === curReceiveAccount.value.account) {
  //     contract_address = item.contract_address
  //   }
  // })
  // writeContract(
  //   {
  //     address: contract_address,
  //     abi: CHR.abi,
  //     functionName: 'transfer',
  //     args: [curReceiveAccount.value.receipt_address, amount],
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
//     showToast(t('chr35'));
//   }
// };

// 查询后台质押状态
// const getPledgeStatus = (hash) => {
//   getChainNotify({hash: hash}).then((res: any) => {
//     if (res.code === 1) {
//       showToast(t('chr34'));
//       isLoading.value = false;
//       emit('getInfo');
//     } else {
//       setTimeout(() => {
//         getPledgeStatus(hash);
//       },2000)
//     }
//   })
// }

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
		}
	});
}
getAssets();
</script>
<style>
.van-field__control{
  font-weight: bold;
}
</style>

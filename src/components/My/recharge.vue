<template>
  <div>
    <h2 class="text-black text-base font-bold pb-6">
      {{ $t('chr136') }}
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
        :placeholder='$t("chr146")'
        type="number"
        v-model.number="withdrawAmount"
      />
      <span
        class="text-textBlack text-sm font-bold pr-2.5"
        @click="withdrawAmount = Number(curWithdrawInfo.balance)"
        >MAX</span
      >
    </div>
    <div
      class="mt-9 w-full rounded-full bg-bgYellow text-center leading-[50px] text-base text-textBlack font-bold cursor-pointer flex justify-center items-center"
      @click="toRecharge"
    >
      <van-loading type="spinner" size="20" color="#09FA97" v-if="isLoading" />
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
      <span
        class="text-sm text-black font-medium uppercase"
        >{{ item.chain }}</span
      >
      <!-- <span class="text-sm text-black font-medium"
        >{{ $t('chr57')}}<a class="font-bold">{{ item.balance }}</a></span
      > -->
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { readContract, waitForTransactionReceipt } from '@wagmi/core';
import { useConnect, useSignMessage, useAccount, useWriteContract, useChainId } from '@wagmi/vue';
import { getRechageAccount,  getContractInfo } from '@/api';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import ChrLogo from '@/assets/images/coin_chr_logo.svg';
import AcLogo from '@/assets/images/coin_ac_logo.svg';
import UsdLogo from '@/assets/images/usdtLogo.svg';
import UsdeLogo from '@/assets/images/usdeLogo.svg';
import EctLogo from '@/assets/images/ectLogo.svg';
import { config } from '@/plugins/config';
import { CHR } from '@/contracts'
import { formatEther, parseEther } from 'viem';
// import {
//   useMutation,
// } from '@wagmi/vue/query'
const { address } = useAccount();
const { t } = useI18n();
const emit = defineEmits(['rechargeSuc']);
const isShow = ref(false);
const isLoading = ref(false);
const { writeContract } = useWriteContract();
const defaultChainId = useChainId();
// const {  switchChain } = useSwitchChain()
interface WithdrawInfo {
	account: string;
	min_recharge_amount:string;
	recharge_address:string;
  src: string;
  balance: string;
  contractAddress: string;
  chain: string;
  chain_id:number;
}
const withdrawInfo = ref<WithdrawInfo[]>([]);
const curWithdrawInfo = ref<WithdrawInfo>({} as WithdrawInfo);

interface ContractInfo {
  account: string;
  chain: string;
  contract_address: string;
  decimal: string;
}
const contractList = ref<ContractInfo[]>([]);
const queryContractInfo = () => {
  getContractInfo().then((res: any) => {
    if (res.code === 1) {
      contractList.value = res.data;
      queryWithdrawAccount();
    }
  })
}
queryContractInfo();

// 获取用户chr余额
const toGetToken = async (item) => {
  const balance: any = await readContract(config, {
    abi: CHR.abi,
    address: item.contractAddress,
    functionName: 'balanceOf',
    args: [address.value],
  });
  withdrawInfo.value.forEach((coin)=>{
    if(item.account === coin.account){
      const index = withdrawInfo.value.findIndex(assets => assets.account === coin.account && item.chain === assets.chain);
      withdrawInfo.value[index].balance = formatEther(balance);
    }
  })
};

const withdrawAmount = ref<number>();
// interface ChainInfo {
// 	chain: string;
// 	rpc_url: string;
// 	chain_id: number;
// 	browser_url: string;
// }
// const chainInfo = ref<ChainInfo>({} as ChainInfo);
// getChainInfo().then((res) => {
// 	if(res.code === 1){
// 		chainInfo.value = res.data;
// 	}
// })

// 签名
const { connectors } = useConnect();
const { signMessageAsync } = useSignMessage();
const sign = async () => {
  const signMessages = await signMessageAsync({
    message: 'Recharge',
    account: address.value,
    connector: connectors[0],
  });
  return signMessages;
};
const toRecharge = async() => {
  if(curWithdrawInfo.value.chain_id != defaultChainId.value){
    showToast(t('chr145',{ chain: curWithdrawInfo.value.chain }))
    return;
  }
	if(!withdrawAmount.value ) {
		showToast(t('chr86'));
		return
	} else if (Number(withdrawAmount.value) > Number(curWithdrawInfo.value.balance)) {
		showToast(t('chr46'));
		return
	}
  isLoading.value = true;
	await sign();
  const contractAddress: any = curWithdrawInfo.value.contractAddress;
  let amount = parseEther(String(withdrawAmount.value));
  writeContract(
    {
      address: contractAddress,
      abi: CHR.abi,
      functionName: 'transfer',
      args: [curWithdrawInfo.value.recharge_address, amount],
    },
    {
      onSuccess(data) {
        toGetHash(data);
      },
      onError(error) {
        console.log(error);
        isLoading.value = false;
        showToast(t('chr81'));
      },
    }
  );
}

// 根据hash查询交易状态
const toGetHash = async (hash) => {
  const transactionReceipt = await waitForTransactionReceipt(config, {
    hash: hash,
  });
  if (transactionReceipt.status) {
    isLoading.value = false;
    emit('rechargeSuc');
    showToast(t('chr139'));
  } else {
    isLoading.value = false;
    showToast(t('chr35'));
  }
};

const queryWithdrawAccount = () => {
  getRechageAccount().then((res) => {
    if(res.code === 1){
      res.data.forEach((item)=>{
        if(item.account === 'chr'){
          item.src = ChrLogo
          const result = contractList.value.find(assets => assets.account === "chr" && assets.chain === item.chain);
          item.contractAddress = result?.contract_address;
        } else if (item.account === 'usdt'){
          item.src = UsdLogo
          const result = contractList.value.find(assets => assets.account === "usdt" && assets.chain === item.chain);
          item.contractAddress = result?.contract_address;
        } else if (item.account === 'usde'){
          item.src = UsdeLogo
          const result = contractList.value.find(assets => assets.account === "usde" && assets.chain === item.chain);
          item.contractAddress = result?.contract_address;
        } else if (item.account === 'ac'){
          item.src = AcLogo
          const result = contractList.value.find(assets => assets.account === "ac" && assets.chain === item.chain);
          item.contractAddress = result?.contract_address;
        } else if (item.account === 'ect'){
          item.src = EctLogo
          const result = contractList.value.find(assets => assets.account === "ect" && assets.chain === item.chain);
          item.contractAddress = result?.contract_address;
        }
        withdrawInfo.value.push(item);
      })
      // contractList.value.forEach((item) => {
      //   toGetToken(item);
      // })
      const checkChina = withdrawInfo.value.find((item)=> item.chain_id === defaultChainId.value);
      if(checkChina){
        curWithdrawInfo.value = checkChina;
        toGetToken(checkChina);
      }
    }
  })
}


const changeCurCoin = async(item:WithdrawInfo) => {
  isShow.value = false;
  curWithdrawInfo.value = item;
  if(item.chain_id === defaultChainId.value){
    toGetToken(item);
    // mutation.mutate(item.chain_id);
    // await switchChain({ chainId: item.chain_id })
    // (data: SwitchChainData, variables: SwitchChainVariables, context: TContext) => void
    // setTimeout(()=>{
    //   toGetToken(item);
    // },1000)

  }else{
    showToast(t('chr145',{ chain: item.chain }))
  }
}

// const mutation = useMutation({
//   mutationFn: async (chainId: number) => {
//     // 检查 switchNetwork 方法是否存在并执行链切换
//     if (switchChain) {
//       return await switchChain({ chainId: chainId });
//     } else {
//       throw new Error('Switch Network not supported');
//     }
//   },
//   onSuccess: (data) => {
//     console.log('Successfully switched to chain', data);
//     toGetToken(curWithdrawInfo.value);
//   },
//   onError: (error) => {
//     console.error('Error switching chain', error);
//   },
// });
</script>

<template>
  <div>
    <h2 class="text-black text-base font-bold pb-6">
      {{ $t('chr153') }}
    </h2>
    <p
      class="text-sm text-black font-medium pb-2.5 flex justify-between items-center"
    >
      {{ $t('chr26') }}
      <span class="text-sm text-black font-medium">
        {{ $t('chr57')}}
        <a class="font-bold">{{ appendAccount?.balance }}</a>
      </span>
    </p>
    <div class="w-full rounded bg-bgGray flex justify-between items-center">
      <!-- <input
        class="px-2.5 py-4 text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold"
        :placeholder='$t("chr33")'
        type="number"
        v-model.number="appendAmount"
      /> -->
      <van-field
        type="digit"
        v-model="appendAmount"
        :placeholder='$t("chr33")'
        class="px-2.5 py-4 text-sm flex-grow box-border placeholder:text-[#ADADAD] placeholder:font-normal text-black font-bold"
        style="background: #F0F0F0;color:#000;font-weight: bold;"
      />
      <!-- <span
        class="text-textBlack text-sm font-bold pr-2.5"
        @click="appendAmount = Number(appendAccount.balance)"
        >MAX</span
      > -->
    </div>
    <p class="text-textGreen2 text-sm">
      {{ $t('chr154', {min: appendAccount.appound.min_amount, account: appendAccount.account}) }}
    </p>
    <div
      class="mt-9 w-full rounded-full bg-bgYellow text-center leading-[50px] text-base text-textBlack font-bold cursor-pointer"
      @click="doAppend"
    >
      {{ $t('chr13') }}
    </div>
  </div>
</template>

<script setup lang="ts">
// import { useAccount } from '@wagmi/vue';
import { userMineAppend } from '@/api';
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import { useConnect, useSignMessage, useAccount } from '@wagmi/vue';

const { t } = useI18n();
const emit = defineEmits(['appendSuc']);
const props = defineProps(['appendAccount'])
const appendAmount = ref();

// 签名
const signMsg = ref();
const { connectors } = useConnect();
const { signMessageAsync } = useSignMessage();
const { address } = useAccount();
const sign = async () => {
  const signMessages = await signMessageAsync({
    message: 'CHR Pledge ' + appendAmount.value + props.appendAccount.account,
    account: address.value,
    connector: connectors[0],
  });
  return signMessages;
};
const doAppend = async() => {
	if(!appendAmount.value ) {
		showToast(t('chr33'));
		return
	} else if (Number(appendAmount.value) > Number(props.appendAccount.balance)) {
		showToast(t('chr46'));
		return
	}else if (Number(props.appendAccount.appound.min_amount) > Number(props.appendAccount.balance)) {
		showToast(t('chr154', {min: props.appendAccount.appound.min_amount}));
		return
	}
	signMsg.value = await sign();
	userMineAppend({account: props.appendAccount.account, amount: appendAmount.value, sign: signMsg.value}).then((res) => {
		if(res.code === 1){
			showToast(t('chr155'));
			emit('appendSuc');
		}else{
			showToast(res.message);
		}
	});
}
</script>

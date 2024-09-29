<template>
  <div class="py-7">
    <div class="flex justify-between items-center px-5 mb-2.5">
      <span class="text-sm text-white font-bold">{{ $t('chr91') }}</span>
      <!-- <p class="text-sm text-white font-bold flex justify-end items-center">
        {{ $t('chr92') }}
        <span class="text-bgYellow font-bold flex-grow">
          {{ accountInfo.push_address?.invite_code }}
        </span>
      </p> -->
    </div>
    <div
      class="flex justify-between items-center border-2 border-solid border-bgYellow rounded-full overflow-hidden mb-2.5"
    >
      <span
        class="text-xs font-bold text-white pl-6  w-[80px]"
        >{{ $t('chr51') }}</span
      >
      <div class="flex-grow text-white text-xs font-bold">
        {{ inviteUrl }}
      </div>
      <div
        class="yellowBg w-[120px] h-[60px] text-center leading-[60px] text-sm text-textBlack font-bold"
        @click="copyUrl(inviteUrl)"
      >
        {{ $t('chr93') }}
      </div>
    </div>
    <div
      class="flex justify-between items-center border-2 border-solid border-bgYellow rounded-full overflow-hidden mb-2.5"
    >
      <span
        class="text-xs font-bold text-white pl-6 w-[80px]"
        >{{ $t('chr94') }}</span
      >
      <div class="flex-grow text-white text-xs font-bold">
        {{ accountInfo.invite_code }}
      </div>
      <div
        class="yellowBg w-[120px] h-[60px] text-center leading-[60px] text-sm text-textBlack font-bold"
        @click="copyUrl(accountInfo.invite_code)"
      >
        {{ $t('chr93') }}
      </div>
    </div>
  </div>
  <div class="pb-10">
    <div
      class="bg-panelBg py-5 rounded-full flex justify-between items-center pl-5 pr-6 mb-2.5"
    >
      <div class="flex justify-start items-center">
        <img src="@/assets/images/myInviteLogo.svg" class="w-5" />
        <span
          class="text-sm text-white font-bold pl-2.5"
          >{{ $t('chr92') }}</span
        >
      </div>
      <div class="flex justify-end items-center">
        <span
          class="text-bgYellow text-sm font-bold pr-2.5 font-Montserrat"
          >{{ accountInfo.push_address?.invite_code }}</span
        >
      </div>
    </div>
    <router-link
      to="/team"
      class="bg-panelBg py-5 rounded-full flex justify-between items-center pl-5 pr-6 mb-2.5"
    >
      <div class="flex justify-start items-center">
        <img src="@/assets/images/myTeam_logo.svg" class="w-5" />
        <span
          class="text-sm text-white font-bold pl-2.5"
          >{{ $t('chr48') }}</span
        >
      </div>
      <div class="flex justify-end items-center">
        <span class="text-white text-sm font-bold pr-2.5 font-Montserrat"
          >{{ myPerfomance.team_num }}{{ $t('chr95') }}</span
        >
        <van-icon name="arrow" color="#929598" />
      </div>
    </router-link>
    <div
      class="bg-panelBg py-5 rounded-full flex justify-between items-center pl-5 pr-6 mb-2.5"
    >
      <div class="flex justify-start items-center">
        <img src="@/assets/images/team_logo.svg" class="w-5" />
        <span
          class="text-sm text-white font-bold pl-2.5"
          >{{ $t('chr50') }}</span
        >
      </div>
      <div class="flex justify-end items-center">
        <span
          class="text-bgYellow text-sm font-bold pr-2.5 font-Montserrat"
          >{{ accountInfo.level_name ? accountInfo.level_name : $t('chr89') }}</span
        >
      </div>
    </div>
    <router-link
      to="/partner/myPartner"
      class="bg-panelBg py-5 rounded-full flex justify-between items-center pl-5 pr-6 mb-2.5"
    >
      <div class="flex justify-start items-center">
        <img src="@/assets/images/partner_logo.svg" class="w-5" />
        <span
          class="text-sm text-white font-bold pl-2.5"
          >{{ $t('chr49') }}</span
        >
      </div>
      <div class="flex justify-end items-center">
        <van-icon name="arrow" color="#929598" />
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { setToastDefaultOptions } from 'vant';
import { getAccountInfo, getMyTeamPerformance } from '@/api';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import useClipboard from 'vue-clipboard3';
import eventBus from '@/utils/eventBus';
const { toClipboard } = useClipboard();
setToastDefaultOptions({ className: 'yellowText' });
interface InviteInfo {
  invite_code: string;
  address: string;
}
interface AccountInfo {
	address: string;
	created_at: string;
	invite_code: string;
	level_name: string;
	node_name: string;
  push_address:InviteInfo;
}
const accountInfo = ref({} as AccountInfo);
const inviteUrl = ref('');
const queryAccountInfo = () => {
  getAccountInfo().then((res) => {
    if (res.code === 1) {
      accountInfo.value = res.data;
      inviteUrl.value = window.origin + '/#/?code=' + accountInfo.value.invite_code
    }
  });
}


const copyUrl = async (url) => {
  try {
    await toClipboard(url);
    showToast(t('chr52'));
  } catch (e) {
    console.error(e);
  }
};


interface Perfomance {
	personal_amount: number;
	push_num: number;
	small_amount: number;
	team_amount	: number;
	team_num: number;
	team_valid_num: number;
}
const myPerfomance = ref<Perfomance>({} as Perfomance);
const queryMyTeam = () => {
  getMyTeamPerformance().then((res) => {
    if (res.code === 1) {
      myPerfomance.value = res.data;
    }
  })
}


const init = () => {
  queryAccountInfo();
  queryMyTeam();
}
init();

eventBus.on('loginRequest', init);
</script>

<style scoped>
.yellowBg {
  background:url('@/assets/images/yellowBg.png') no-repeat;
  background-size: 100% 100%;
}
.yellowText  {
  color:'#FFF803' !important;
}
</style>

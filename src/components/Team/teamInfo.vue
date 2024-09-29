<template>
  <div class="py-4 text-center">
    <img src="@/assets/images/bigTeamLogo.png" class="w-[64px]" />
    <div class="">
      <p class="text-sm text-white font-bold pb-4 leading-6 w-1/2 mx-auto">
        <van-text-ellipsis
          rows="1"
          :content="teamInfo.address"
          position="middle"
          class="font-bold"
        />
      </p>
      <span
        class="text-sm font-bold text-bgYellow leading-6 border border-solid border-bgYellow px-5 py-1.5 rounded-full font-Montserrat"
      >
        {{ $t('chr64')}}:
        {{ teamInfo.level_name ? teamInfo.level_name : $t('chr89') }}
      </span>
    </div>
  </div>
  <div class="grid grid-cols-3 items-center my-2.5 gap-2.5">
    <div class="bg-panelBg rounded-lg text-center py-3">
      <p class="text-white text-xs leading-5">{{ $t('chr65') }}</p>
      <p class="text-white text-lg font-bold font-Montserrat">
        {{ myPerfomance.team_num }}
      </p>
    </div>
    <div class="bg-panelBg rounded-lg text-center py-3">
      <p class="text-white text-xs leading-5">{{ $t('chr66') }}</p>
      <p class="text-white text-lg font-bold font-Montserrat">
        {{ myPerfomance.push_num }}
      </p>
    </div>
    <div class="bg-panelBg rounded-lg text-center py-3">
      <p class="text-white text-xs leading-5">{{ $t('chr67') }}</p>
      <p class="text-white text-lg font-bold font-Montserrat">
        {{ myPerfomance.team_valid_num }}
      </p>
    </div>
    <div class="bg-panelBg rounded-lg text-center py-3">
      <p class="text-white text-xs leading-5">{{ $t('chr68') }}</p>
      <p class="text-white text-lg font-bold font-Montserrat">
        {{ myPerfomance.personal_amount }}
      </p>
    </div>
    <div class="bg-panelBg rounded-lg text-center py-3">
      <p class="text-white text-xs leading-5">{{ $t('chr69') }}</p>
      <p class="text-white text-lg font-bold font-Montserrat">
        {{ myPerfomance.team_amount }}
      </p>
    </div>
    <div class="bg-panelBg rounded-lg text-center py-3">
      <p class="text-white text-xs leading-5">{{ $t('chr70') }}</p>
      <p class="text-white text-lg font-bold font-Montserrat">
        {{ myPerfomance.small_amount }}
      </p>
    </div>
  </div>
  <TeamMember />
</template>

<script setup lang="ts">
import { getMyTeamPerformance, getAccountInfo } from '@/api';

interface Perfomance {
	personal_amount: number;
	push_num: number;
	small_amount: number;
	team_amount	: number;
	team_num: number;
	team_valid_num: number;
}
const myPerfomance = ref<Perfomance>({} as Perfomance);
getMyTeamPerformance().then((res) => {
	if (res.code === 1) {
		myPerfomance.value = res.data;
	}
})

interface TeamInfo {
	address: string;
	created_at: string;
	invite_code: string;
	level_name: string;
	node_name: string;
}
const teamInfo = ref({} as TeamInfo);

getAccountInfo().then((res) => {
	if (res.code === 1) {
		teamInfo.value = res.data;
	}
});
</script>

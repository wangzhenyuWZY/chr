<template>
  <div class="flex flex-col h-full">
    <h2 class="text-sm text-white font-bold">{{ $t('chr71') }}</h2>
    <div class="py-4 flex-grow">
      <div class="overflow-y-scroll max-h-[400px]">
        <div
          class="p-[18px] bg-panelBg rounded-lg mb-2.5"
          v-for="(item, index) in memberList"
          :key="index"
        >
          <div class="flex justify-between items-center pb-5">
            <div class="flex justify-start items-center">
              <img src="@/assets/images/bigTeamLogo.png" width="30px" />
              <p class="text-white text-sm font-bold pl-2 w-36">
                <van-text-ellipsis
                  rows="1"
                  :content="item.address"
                  position="middle"
                  class="font-bold"
                />
              </p>
            </div>
            <p class="text-white text-xs font-bold">
              {{ $t('chr50') }}:
              <span
                class="text-bgYellow font-Montserrat"
                >{{ item.level_name ? item.level_name : $t('chr89') }}</span
              >
            </p>
          </div>
          <div class="grid grid-cols-3 gap-2 bg-black py-4 rounded-lg">
            <div class="text-center">
              <p class="text-white text-xs">{{ $t('chr65') }}</p>
              <p class="text-lg text-white font-bold font-Montserrat">
                {{ item.team_num }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-white text-xs">{{ $t('chr69') }}</p>
              <p class="text-lg text-white font-bold font-Montserrat">
                {{ item.team_amount }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-white text-xs">{{ $t('chr70') }}</p>
              <p class="text-lg text-white font-bold font-Montserrat">
                {{ item.small_amount }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getMyTeam } from '@/api';
interface TeamMember {
  address: string;
  created_at: string;
  level_name: string;
  small_amount: string;
  team_num: number;
  team_amount: string;
}
const memberList = ref<TeamMember[]>([]);
getMyTeam().then((res) => {
  if (res.code === 1) {
    memberList.value = res.data.data;
  }
});
</script>

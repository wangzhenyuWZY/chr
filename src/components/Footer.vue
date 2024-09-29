<template>
  <van-tabbar
    route
    fixed
    v-model="active"
    active-color="#09FA97"
    inactive-color="rgba(255,255,255,0.4)"
  >
    <van-tabbar-item
      replace
      :to="item.path"
      v-for="(item, index) in tabList"
      :key="index"
    >
      <template #icon="props">
        <img :src="props.active ? item.activeSrc : item.src" />
      </template>
      <!-- <span class="text-xs leading-[22px]">{{ item.name }}</span> -->
    </van-tabbar-item>
  </van-tabbar>
  <!-- <div class="bg-panelBg py-1 grid grid-cols-4 items-center">
    <router-link
      :to="item.path"
      class="text-center"
      v-for="(item, index) in tabList"
      :key="index"
    >
      <div><img :src="item.src" class="w-6" /></div>
      <span class="text-xs leading-[22px] text-white/60">{{ item.name }}</span>
    </router-link>
  </div> -->
</template>

<script setup lang="ts">
import icon_tab1 from '@/assets/images/icon_tab_home.svg';
import icon_tab2 from '@/assets/images/icon_tab_pledge.svg';
import icon_tab3 from '@/assets/images/icon_tab_partner.svg';
import icon_tab4 from '@/assets/images/icon_tab_my.svg';
import icon_tab1_active from '@/assets/images/icon_tab_home_active.svg';
import icon_tab2_active from '@/assets/images/icon_tab_pledge_active.svg';
import icon_tab3_active from '@/assets/images/icon_tab_partner_active.svg';
import icon_tab4_active from '@/assets/images/icon_tab_my_active.svg';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const active = ref(0);
interface tab {
	name: string;
	src: string;
	activeSrc: string;
	path: string;
}
const tabList = ref<tab[]>([]);
tabList.value = [
	{
		name: t('chr6'),
		src: icon_tab1,
		activeSrc: icon_tab1_active,
		path: '/',
	},
	{
		name: t('chr7'),
		src: icon_tab2,
		activeSrc: icon_tab2_active,
		path: '/pledge',
	},
	{
		name: t('chr8'),
		src: icon_tab3,
		activeSrc: icon_tab3_active,
		path: '/partner',
	},
	{
		name: t('chr9'),
		src: icon_tab4,
		activeSrc: icon_tab4_active,
		path: '/my',
	},
];
</script>

<style scoped>
.van-tabbar-item__icon img{
	width: 42px;
	height: auto;
}
.van-hairline--top-bottom:after{
	border:none;
}
.van-tabbar{
	padding:5px 0;
	left: 12px;
	right: 12px;
	bottom: 24px;
	width: auto;
	border-radius: 40px;
	overflow: hidden;
}
.van-tabbar-item__icon{
	margin-bottom:0;
}
</style>

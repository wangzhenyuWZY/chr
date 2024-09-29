<template>
  <div class="py-4 grid grid-cols-4 items-center bg-panelBg">
    <router-link
      :to="item.path"
      class="text-center"
      v-for="(item, index) in tabList"
      :key="index"
    >
      <div><img :src="item.src" class="w-6" /></div>
      <span class="text-xs leading-[22px] text-white/60">{{ item.name }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import icon_tab1 from '@/assets/images/icon_announcement.png';
import icon_tab2 from '@/assets/images/icon_team.png';
import icon_tab3 from '@/assets/images/icon_partner.png';
import icon_tab4 from '@/assets/images/icon_assets.png';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
interface tab {
	name: string;
	path: string;
	src: string;
}
const tabList = ref<tab[]>([]);
tabList.value = [
	{
		name: t('chr2'),
		src: icon_tab1,
		path: '/article'
	},
	{
		name: t('chr3'),
		src: icon_tab2,
		path: '/team'
	},
	{
		name: t('chr4'),
		src: icon_tab3,
		path: '/partner'
	},
	{
		name: t('chr5'),
		src: icon_tab4,
		path: '/assets'
	},
];
</script>

<template>
  <ChildrenHeader :title="$t('chr73')" />
  <h2 class="text-xl text-white font-bold pt-6">
    {{ articleInfo.title }}
  </h2>
  <p class="pt-4 pb-5 text-xs text-[#848484] font-medium">
    {{ articleInfo.created_at }}
  </p>
  <div class="text-sm text-white" v-html="articleInfo.content"></div>
</template>

<script setup lang="ts">
import { getContentDetail } from '@/api';
import { useRoute } from 'vue-router';
const route = useRoute();
interface Article {
	content: string;
	created_at: string;
	id: number;
	title: string;
}
const articleInfo = ref<Article>({} as Article);
getContentDetail({id: route.query.id}).then((res) => {
	if(res.code === 1){
		articleInfo.value = res.data;
	}
})
</script>

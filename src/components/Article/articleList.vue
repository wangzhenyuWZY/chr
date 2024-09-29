<template>
  <div
    class="px-4 py-5 mt-6"
    v-for="(item,index) in articleList"
    :key="index"
    @click="$router.push('/article/detail?id=' + item.id)"
  >
    <div class="flex justify-between items-baseline">
      <div><img src="@/assets/images/icon_notify.svg" /></div>
      <div class="flex-grow pl-2.5">
        <div class="text-base text-white font-bold">
          <van-text-ellipsis :content="item.title" />
          <span
            class="text-[11px] text-[#848484] font-medium"
            >{{ item.created_at }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getContentList } from '@/api';

interface Article {
	content: string;
	created_at: string;
	id: number;
	title: string;
}
const articleList = ref<Article[]>([]);
getContentList().then((res) => {
	if( res.code === 1){
		articleList.value = res.data
	}
});
</script>

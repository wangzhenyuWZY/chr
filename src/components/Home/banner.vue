<template>
  <div class="pb-4 mt-2.5">
    <div class="pb-4 relative">
      <div class="absolute top-[48px] left-[22px] w-full">
        <!-- <div class="text-white text-[27px] leading-8 font-bold">
          <p class="font-bold">Stake and</p>
          <div class="flex ">
            <p class="text-black font-bold bg-bgYellow p-[2px] flex">
              Earn Big
            </p>
          </div>
        </div> -->
      </div>
      <img src="@/assets/images/banner.png" class="w-full" />
    </div>
    <van-notice-bar
      :left-icon="NativeIcon"
      :scrollable="false"
      color="#FFF"
      background="#070808"
      class="border border-solid border-borderBlack rounded-full"
      v-if="articleList.length"
    >
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :touchable="false"
        :show-indicators="false"
      >
        <van-swipe-item
          v-for="(item, index) in articleList"
          :key="index"
          class="w-full"
          @click="$router.push('/article/detail?id=' + item.id)"
        >
          <!-- <van-text-ellipsis
            rows="1"
            :content="item.title"
            position="middle"
            class="font-bold"
          /> -->
          {{  item.title }}
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </div>
</template>

<script setup lang="ts">
// import { getNewsList } from '@/api';
import NativeIcon from '@/assets/images/icon_notify.svg'
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

<style scoped>
.notice-swipe {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
}
.van-ellipsis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>

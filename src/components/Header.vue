<template>
  <div
    class="flex justify-between items-center px-5 py-4 border-1 border-solid border-[#272A2A] rounded-full bg-textBlack"
  >
    <img src="@/assets/images/logo.svg" height="26px" />
    <div class="flex justify-end items-center space-x-3 flex-grow">
      <div
        class="bg-bgYellow h-[26px] box-border rounded-full py-1 px-3 text-center text-[11px] text-textBlack font-inter cursor-pointer"
        @click="connectWallet"
      >
        <p v-if="!isConnected">{{ $t('chr1') }}</p>
        <div v-else class="w-[100px]">
          <van-text-ellipsis
            :content="address"
            rows="1"
            position="middle"
            class="font-Inter font-bold"
          />
        </div>
      </div>
      <img
        src="@/assets/images/icon_menu_drop.png"
        class="w-[15.5px] h-[16.2px]"
        @click="isMenuDrop = true"
      />
    </div>
  </div>
  <van-popup
    v-model:show="isMenuDrop"
    position="left"
    :overlay-style="{backgroundColor: 'rgba(0, 0, 0, 0.9)'}"
    :style="{ width: '100%', height: '100%', background: 'none' }"
  >
    <div class="py-10 px-7">
      <div class="flex justify-between items-center pb-[40px]">
        <img src="@/assets/images/logo.svg" />
        <van-icon name="cross" color="#fff" @click="isMenuDrop = false" />
      </div>
      <div
        v-for="(item,index) in tabList"
        :key="index"
        class="flex justify-between items-center py-5"
        @click="toPage(item.path)"
      >
        <span class="text-white text-xl font-bold">{{ item.name }}</span>
        <van-icon name="arrow" color="#929598" />
      </div>
      <div class="relative">
        <div
          class="flex justify-between items-center py-5 "
          @click="showCountries = !showCountries"
        >
          <span class="text-white text-xl font-bold">{{ $t('chr117') }}</span>
          <van-icon name="arrow" color="#929598" />
        </div>
        <div v-show="showCountries" class="absolute right-0 w-full z-10">
          <div
            class="w-full flex justify-start items-center py-1 px-2.5 bg-black rounded-full mt-1 cursor-pointer "
            v-for="(item, index) in countryList"
            :key="index"
            v-show="item.name !== currentCountry.name"
            @click="changeCountry(item)"
          >
            <span class="text-white text-sm pl-1 whitespace-nowrap">{{
            item.name
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
  <van-popup
    v-model:show="invitePop"
    round
    :close-on-click-overlay="false"
    :style="{ padding: '32px',width: '80%' }"
  >
    <BindInviteCode @toBindInviteCode="toBindInviteCode" />
  </van-popup>
</template>
<script setup lang="ts">
import { useConnect, useAccount, useChainId, useSignMessage, useDisconnect  } from '@wagmi/vue';
import { useSwitchChain } from '@wagmi/vue'
import { useCache } from '@/hooks/useCache';
import * as AuthUtils from '@/utils/auth';
import { useI18n } from 'vue-i18n';
import { signIn } from '@/api'
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import eventBus from '@/utils/eventBus';
import { config } from '@/plugins/config';
const $router = useRouter();

const {  switchChain } = useSwitchChain()
const { connectors, connect } = useConnect();
const { isConnected, address, chainId } = useAccount();
const defaultChainId = useChainId();
const { locale,t } = useI18n();
const showCountries = ref(false);
const invitePop = ref(false);
const inviteCode = ref('');
const isMenuDrop = ref(false);

interface tab {
	name: string;
	path: string;
}
const tabList = ref<tab[]>([]);
tabList.value = [
	{
		name: t('chr2'),
		path: '/article',
	},
  {
		name: t('chr114'),
		path: '/pledge',
	},
	{
		name: t('chr3'),
		path: '/team',
	},
	{
		name: t('chr4'),
		path: '/partner',
	},
	{
		name: t('chr5'),
		path: '/my',
	},
];

const toPage = (path) => {
  isMenuDrop.value = false;
  $router.push(path);
}

const getQueryString = (name) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.hash.split('?')[1]?.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

const code = ref();
code.value = getQueryString('code');
if (code.value) {
  inviteCode.value = code.value;
}
interface Country {
  name: string;
  value: string;
}
const countryList = ref<Country[]>([]);
const currentCountry = ref<Country>({} as Country);
countryList.value = [
  {
    name: '简体中文',
    value: 'zh-CN',
  },
  {
    name: '한국인',
    value: 'ko-KR',
  },
  {
    name: '日本語',
    value: 'ja-JP',
  },
  {
    name: 'English',
    value: 'en-SG',
  },
];
const lang = localStorage.getItem('locale') || 'zh-CN';
currentCountry.value = countryList.value.find(
  (country) => country.value === lang
) || { name: '简体中文', value: 'zh-CN' };

const changeCountry = (item: Country) => {
  locale.value = item.value;
  localStorage.setItem('locale', item.value);
  currentCountry.value = item;
  showCountries.value = false;
  location.reload();
};
// 签名
const signMsg = ref();
const { signMessageAsync } = useSignMessage();
const sign = async () => {
  const signMessages = await signMessageAsync({
    message: 'CHR Login',
    account: address.value,
    connector: connectors[0],
  });
  return signMessages;
};
const { disconnect } = useDisconnect()
const connectWallet = async() => {
  if(!isConnected.value){
    await connect({ connector: connectors[0]})
  }else{
    await disconnect();
    setTimeout(()=>{
      connect({ connector: connectors[0]})
    },1000)
  }
}

const switchWalletChain = async() => {
  const hasChain = config.chains.find((item)=> item.id === chainId.value)
  if(!hasChain){
    await switchChain({ chainId: defaultChainId.value })
  }
}


// 登录
const doLogin = async () => {

  AuthUtils.setAddress(String(address.value));
  const res = await signIn({
    address: address.value,
    invite: inviteCode.value || code.value || '',
    // sign: signMsg.value,
  });
  if(res.code === 1){
    invitePop.value = false;
    AuthUtils.setToken(res.data.token);
    eventBus.emit('loginRequest');
  } else if (res.code === 100) {
    showToast(res.message);
    invitePop.value = true;
  }  else {
    showToast(res.message);
  }
};

const toBindInviteCode = (code) => {
  inviteCode.value = code;
  if(!inviteCode.value){
    showToast(t('chr88'));
    return;
  }
  doLogin();
}


watch(
  () => address.value,
  async(newValue) => {
    const { wsCache } = useCache();
    if (newValue) {
      AuthUtils.setAddress(newValue);
      AuthUtils.removeToken();
      signMsg.value = '';
      console.log(newValue,'newValue----------')
      switchWalletChain();
      signMsg.value = await sign();
      console.log(signMsg.value,'signMsg.value===============')
      doLogin();

    } else {
      console.log('noneValue----------')
      wsCache.clear();
      AuthUtils.removeToken();
      await connectWallet();
      doLogin();
    }
  }
);

// const refrenshLogin = async() => {
//   signMsg.value = await sign();
//   AuthUtils.setAddress(String(address.value));
//   const res = await signIn({
//     address: address.value,
//     invite: inviteCode.value || code.value || '',
//   });
//   if(res.code === 1){
//     invitePop.value = false;
//     AuthUtils.setToken(res.data.token);
//     window.location.reload();
//   } else if (res.code === 100) {
//     showToast(res.message);
//     invitePop.value = true;
//   }  else {
//     showToast(res.message);
//   }
// }
eventBus.on('initRequest', doLogin);

const handleBeforeUnload = () => {
  // 页面刷新或关闭时执行的操作
  sessionStorage.removeItem('hasExecuted'); // 清除标志位
}

onMounted(() => {
  console.log(address.value,'+++++++++++')
  const hasExecuted = sessionStorage.getItem('hasExecuted');
  if (!hasExecuted || !isConnected.value) {
    // 页面刷新时执行
    connectWallet()
    console.log('first----------')
    // 标记已执行
    sessionStorage.setItem('hasExecuted', 'true');
  }
  const token = AuthUtils.getAccessToken();
  const addr = AuthUtils.getAccessAddress();
  console.log(addr,'---------')
  if(!isConnected.value || !token || addr != address.value){
    doLogin();
  }
  // 添加 beforeunload 事件监听器
  window.addEventListener('beforeunload', handleBeforeUnload);


  switchWalletChain()
});

onBeforeUnmount(() => {
  // 移除 beforeunload 事件监听器（为了在组件卸载时避免内存泄漏）
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

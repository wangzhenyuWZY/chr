import { http, createConfig } from '@wagmi/vue';
import { bsc } from '@wagmi/vue/chains';
import { injected, metaMask, safe, walletConnect } from '@wagmi/vue/connectors';
import { defineChain } from 'viem';
import { getChainInfo } from '@/api';

// interface ChainInfo {
// 	chain: string;
// 	rpc_url: string;
// 	chain_id: number;
// 	browser_url: string;
// }
const chainInfo = ref({});
getChainInfo().then((res) => {
  if (res.code === 1) {
    chainInfo.value = res.data;
    console.log(chainInfo.value);
  }
});

const projectId = 'd26155b2b4cbb5a750b2fe0119f14689';

export const gode = defineChain({
  id: 5500,
  name: 'Gode',
  nativeCurrency: { name: 'Gode', symbol: 'Gode', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.godechain.com'] },
  },
  blockExplorers: {
    default: { name: 'Godescan', url: 'https://explorer.godechain.com' },
  },
});

export const config = createConfig({
  chains: [bsc],
  connectors: [injected()],
  transports: {
    [bsc.id]: http(),
  },
});

import request from '@/config/axios';
import type { ResponseBody } from './typing';

// 登录
export const signIn = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/user/login', data });
};

// 我的质押
export const getMyPledge = (): Promise<ResponseBody> => {
  return request.get({ url: '/mine/order/statistics' });
};

// 获取质押
export const getMineInfo = (): Promise<ResponseBody> => {
  return request.get({ url: '/mine' });
};

// 后台质押
export const getChainNotify = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/chain/notify', data });
};

// 获取合约
export const getContractInfo = (): Promise<ResponseBody> => {
  return request.get({ url: '/chain/contract' });
};

// 我的团队
export const getMyTeam = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/team' });
};

// 我的团队业绩
export const getMyTeamPerformance = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/team/performance' });
};

// 合伙人列表
export const getPartnerList = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/node' });
};

// 获取币种价格
export const getCoinPrice = (): Promise<ResponseBody> => {
  return request.get({ url: '/chain/coin/price' });
};

// 获取公告列表
export const getContentList = (): Promise<ResponseBody> => {
  return request.get({ url: '/content/list' });
};

// 获取公告详情
export const getContentDetail = (params: any): Promise<ResponseBody> => {
  return request.get({ url: '/content/detail', params });
};

// 明细流水
export const getAssetsLog = (params: any): Promise<ResponseBody> => {
  return request.get({ url: '/user/log', params });
};

// 我的合伙人
export const getMyPartner = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/node/order' });
};

// 账户信息
export const getAccountInfo = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/info' });
};

// 我的资产
export const getMyAssets = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/assets' });
};

// 获取可提币的账户
export const getWithdrawAccount = (): Promise<ResponseBody> => {
  return request.get({ url: '/chain/withdraw/account' });
};

// 提币
export const doWithdraw = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/chain/withdraw', data });
};

// 获取链
export const getChainInfo = (): Promise<ResponseBody> => {
  return request.get({ url: '/chain' });
};

// 获取用户挖矿信息
export const getIncomeInfo = (params: any): Promise<ResponseBody> => {
  return request.get({ url: '/user/assets/income', params });
};

// 余额质押
export const minePledge = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/mine/pledge', data });
};

// 获取充值账户
export const getRechageAccount = (): Promise<ResponseBody> => {
  return request.get({ url: '/chain/recharge/account' });
};

// 获取兑换比例
export const getRechagePr = (): Promise<ResponseBody> => {
  return request.get({ url: '/user/exchange/pr' });
};

// 兑换
export const userExchange = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/user/exchange', data });
};

// 余额购买合伙人
export const userNodeBuy = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/user/node/buy', data });
};

// 转账
export const userTransfer = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/user/transfer', data });
};

// 获取可复投的账户
export const getAppendAccount = (): Promise<ResponseBody> => {
  return request.get({ url: '/mine/append/account' });
};

// 余额复投质押
export const userMineAppend = (data: any): Promise<ResponseBody> => {
  return request.postOriginal({ url: '/mine/append', data });
};

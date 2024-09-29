import { useCache } from '@/hooks/useCache';

const { wsCache } = useCache();
const AccessAddressKey = 'ACCESS_ADDRESS';
const AccessTokenKey = 'ACCESS_TOKEN';
const RefreshTokenKey = 'REFRESH_TOKEN';
const TenantIdKey = 'TENANT_ID';
export const getTenantId = () => {
  return wsCache.get(TenantIdKey);
};

export const setTenantId = (username: string) => {
  wsCache.set(TenantIdKey, username);
};

export const getAccessAddress = () => {
  return wsCache.get(AccessAddressKey)
    ? wsCache.get(AccessAddressKey)
    : wsCache.get('ACCESS_ADDRESS');
};
export const setAddress = (addr: String) => {
  wsCache.set(AccessAddressKey, addr);
};
// 获取token
export const getAccessToken = () => {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  return wsCache.get(AccessTokenKey)
    ? wsCache.get(AccessTokenKey)
    : wsCache.get('ACCESS_TOKEN');
};

// 刷新token
export const getRefreshToken = () => {
  return wsCache.get(RefreshTokenKey);
};

// 设置token
export const setToken = (token: String) => {
  wsCache.set(RefreshTokenKey, token);
  wsCache.set(AccessTokenKey, token);
};

export const getUserId = () => {
  return wsCache.get('userId');
};

// 删除token
export const removeToken = () => {
  wsCache.delete(AccessTokenKey);
  wsCache.delete(RefreshTokenKey);
  wsCache.delete(AccessAddressKey);
};

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token;
};

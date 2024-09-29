import axios, {
  type AxiosRequestHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { config } from '@/config/axios/config';
import * as AuthUtils from '@/utils/auth';
import { useCache } from '@/hooks/useCache';
import qs from 'qs';
import eventBus from '@/utils/eventBus';
const { result_code, base_url, request_timeout } = config;

// 是否显示重新登录
let requestList: any[] = [];
// 是否正在刷新中
let isRefreshToken = false;
// const whiteList: string[] = ['/login'];

let lang = localStorage.getItem('locale');
if (lang == 'en-SG') {
  lang = 'en';
} else if (lang == 'ja-JP') {
  lang = 'ja';
} else if (lang == 'ko-KR') {
  lang = 'ko';
} else {
  lang = 'cn';
}
// 创建 Axios 实例
const instance = axios.create({
  baseURL: config.base_url + import.meta.env.VITE_API_URL,
  timeout: request_timeout, // 设置请求超时时间（单位：毫秒）
  headers: {
    'Content-Type': 'multipart/form-data', // 设置请求头部
    'X-localization': lang,
    Authorization: AuthUtils.getAccessToken(),
    'app-key': '123456789',
    'User-Address': AuthUtils.getAccessAddress(),
  },
});

// 设置请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers['Authorization'] = AuthUtils.getAccessToken();
    config.headers['User-Address'] = AuthUtils.getAccessAddress();
    const params = config.params || {};
    const data = config.data || false;
    if (
      config.method?.toUpperCase() === 'POST' &&
      (config.headers as AxiosRequestHeaders)['Content-Type'] ===
        'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(data);
    }
    if (config.method?.toUpperCase() === 'GET' && params) {
      let url = config.url + '?';
      for (const propName of Object.keys(params)) {
        const value = params[propName];
        if (
          value !== void 0 &&
          value !== null &&
          typeof value !== 'undefined'
        ) {
          if (typeof value === 'object') {
            for (const val of Object.keys(value)) {
              const params = propName + '[' + val + ']';
              const subPart = encodeURIComponent(params) + '=';
              url += subPart + encodeURIComponent(value[val]) + '&';
            }
          } else {
            url += `${propName}=${encodeURIComponent(value)}&`;
          }
        }
      }
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据
      // const now = new Date().getTime()
      // params = params.substring(0, url.length - 1) + `?_t=${now}`
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 设置响应拦截器
instance.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    // 在接收到响应数据之前做一些处理
    const { data } = response;
    const config = response.config;

    if (!data) {
      // 返回“[HTTP]请求没有返回值”;
      throw new Error();
    }
    // 未设置状态码则默认成功状态
    const code = data.code || result_code;
    // 二进制数据则直接返回
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      return response.data;
    }
    if (code === -1) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      if (!isRefreshToken) {
        isRefreshToken = true;
        // 1. 如果获取不到刷新令牌，则只能执行登出操作
        if (!AuthUtils.getRefreshToken()) {
          return handleAuthorized();
        }
        // 2. 进行刷新访问令牌
        try {
          const refreshTokenRes = await refreshToken();
          AuthUtils.setToken((await refreshTokenRes).data.data.token);
          config.headers!['Authorization'] = AuthUtils.getAccessToken();
          requestList.forEach((cb: any) => {
            cb();
          });
          requestList = [];
          return instance(config);
        } catch (error) {
          // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
          // 2.2 刷新失败，只回放队列的请求
          requestList.forEach((cb: any) => {
            cb();
          });
          // 提示是否要登出。即不回放当前请求！不然会形成递归
          return handleAuthorized();
        } finally {
          requestList = [];
          isRefreshToken = false;
        }
      } else {
        // 添加到队列，等待刷新获取到新的令牌
        return new Promise((resolve) => {
          requestList.push(() => {
            config.headers!['Authorization'] = AuthUtils.getAccessToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
            resolve(instance(config));
          });
        });
      }
    }
    if (code === 403) {
      console.log('认证失败，删除token返回登录页面');
      return handleAuthorized();
    }
    if (code === 401) {
      const { wsCache } = useCache();
      wsCache.clear();
      AuthUtils.removeToken();
      eventBus.emit('initRequest');
    }
    return response.data;
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  return await axios.post(base_url + '/api.php/user/login/register', {
    'app-key': '123456789',
    'User-Address': AuthUtils.getAccessAddress(),
    Authorization: AuthUtils.getAccessToken(),
  });
};

const handleAuthorized = () => {
  const { wsCache } = useCache();
  wsCache.clear();
  AuthUtils.removeToken();
  // window.location.href = '/';
  // 英文的提示信息
  return Promise.reject(
    new Error(
      'Sorry, you do not have permission to access this page, please contact the administrator to apply for permission!'
    )
  );
};

export default instance;

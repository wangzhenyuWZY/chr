const config: {
  base_url: string;
  result_code: number | string;
  request_timeout: number;
  tenant_id: number;
} = {
  /**
   * api请求基础路径
   */
  base_url: window.origin + import.meta.env.VITE_BASE_URL,
  /**
   * 接口成功返回状态码
   */
  result_code: 200,

  /**
   * 接口请求超时时间
   */
  request_timeout: 30000,
  tenant_id: 0,
};

export { config };

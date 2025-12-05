/**
 * API 配置
 * 在 Docker 环境中，使用相对路径 /api（通过 nginx 代理）
 * 在开发环境中，使用环境变量或默认的 http://127.0.0.1:8000
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ENDPOINTS = {
  // 控制相关
  CONTROL_LATEST: `${API_BASE_URL}/control/latest`,
  CONTROL_SET_PARAMETERS: `${API_BASE_URL}/control/set-parameters`,
  CONTROL_MOTOR_STATUS: `${API_BASE_URL}/control/motor-status`,
  CONTROL_VIBRATION_METRICS: `${API_BASE_URL}/control/vibration-metrics`,
  
  // 健康检查
  HEALTH: `${API_BASE_URL}/health`,
} as const;

/**
 * 获取完整的 API URL
 */
export function getApiUrl(endpoint: string): string {
  // 如果 endpoint 已经是完整 URL，直接返回
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // 如果 API_BASE_URL 是相对路径，直接拼接
  if (API_BASE_URL.startsWith('/')) {
    return endpoint;
  }
  
  // 否则拼接完整 URL
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
}


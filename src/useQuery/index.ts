import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';
import { tryOnLoad } from '../tryOnLoad';

export interface UseQueryOptions {
  /**
   * 是否自动解析 JSON 字符串
   * @default true
   */
  parseJson?: boolean;
}

/**
 * 尝试解析 JSON 字符串
 * @param value 要解析的值
 * @returns 解析后的值或原始值
 */
export function tryParseJson(value: any): any {
  if (typeof value !== 'string') {
    return value;
  }

  // 去除首尾空白字符
  const trimmed = value.trim();

  if (!trimmed) {
    return value;
  }

  const isJsonLike = (s: string) =>
    (s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'));

  // 仅在看起来是对象/数组时才解析，避免把 '123'、'true' 等原始类型字符串强转
  if (isJsonLike(trimmed)) {
    try {
      return JSON.parse(trimmed);
    }
    catch {
      /* ignore */
    }
  }

  // 尝试 URL 解码（把 + 视为空格），再进行解析
  try {
    const decoded = decodeURIComponent(trimmed.replace(/\+/g, '%20')).trim();
    if (isJsonLike(decoded)) {
      return JSON.parse(decoded);
    }
  }
  catch {
    /* ignore */
  }

  // 都不匹配则返回原始值
  return value;
}

/**
 * 处理查询参数，包括 JSON 解析
 * @param params 原始参数对象
 * @param options 选项
 * @returns 处理后的参数对象
 */
function processParams(params: Record<string, any>, options: UseQueryOptions): Record<string, any> {
  const { parseJson = true } = options;

  if (!parseJson) {
    return params;
  }

  const processed: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    processed[key] = tryParseJson(value);
  }

  return processed;
}

/**
 * 获取页面参数
 *
 * @param key 可选的参数键名，如果提供则返回该键对应的值
 * @param options 选项配置
 * @returns 包含 query 对象和 value 的响应式数据
 */
export function useQuery(key?: MaybeRefOrGetter<string>, options: UseQueryOptions = {}) {
  const query = ref<Record<string, any>>({});

  tryOnLoad((q) => {
    const rawParams = q || {};
    query.value = processParams(rawParams, options);
  });

  const value = computed(() => (key != null ? query.value[toValue(key)] : null));

  return { query, value };
}

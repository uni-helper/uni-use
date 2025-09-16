import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';
import { tryOnLoad } from '../tryOnLoad';

export type AnyObject = Record<string, any>;

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

  try {
    // 首先尝试直接解析
    return JSON.parse(trimmed);
  }
  catch {
    try {
      // 如果直接解析失败，尝试先进行 URL 解码再解析
      const decoded = decodeURIComponent(trimmed);
      // 检查解码后是否看起来像 JSON
      if (
        (decoded.startsWith('{') && decoded.endsWith('}'))
        || (decoded.startsWith('[') && decoded.endsWith(']'))
      ) {
        return JSON.parse(decoded);
      }
      return value;
    }
    catch {
      // 如果都解析失败，返回原始字符串
      return value;
    }
  }
}

/**
 * 处理查询参数，包括 JSON 解析
 * @param params 原始参数对象
 * @param options 选项
 * @returns 处理后的参数对象
 */
function processParams(params: AnyObject, options: UseQueryOptions): AnyObject {
  const { parseJson = true } = options;

  if (!parseJson) {
    return params;
  }

  const processed: AnyObject = {};

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
  const query = ref<AnyObject>({});

  tryOnLoad((q) => {
    const rawParams = q || {};
    query.value = processParams(rawParams, options);
  });

  const value = computed(() => (key ? query.value[toValue(key)] : null));

  return { query, value };
}

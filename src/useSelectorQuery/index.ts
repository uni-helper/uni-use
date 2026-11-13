import type { Ref } from 'vue'
import { getCurrentInstance, onMounted, ref } from 'vue'

export type SelectAll = boolean
export type QueryResult<M extends SelectAll> = M extends true ? UniApp.NodeInfo[] : UniApp.NodeInfo

/** `useSelectorQuery` 的返回值 */
export interface UseSelectorQueryReturn {
  /** 节点查询对象 */
  query: Ref<UniApp.SelectorQuery | undefined>
  /** 拿到可用的查询对象，没有就初始化一个 */
  getQuery: () => UniApp.SelectorQuery
  /** 选中节点 */
  select: (selector: string | UniApp.NodesRef, all?: SelectAll) => UniApp.NodesRef
  /** 选中节点，同 select */
  getNode: (selector: string | UniApp.NodesRef, all?: SelectAll) => UniApp.NodesRef
  /** 获取节点布局信息 */
  getBoundingClientRect: <T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    all?: T,
  ) => Promise<R>
  /** 获取节点指定字段 */
  getFields: <T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    fields: UniApp.NodeField,
    all?: T,
  ) => Promise<R>
  /** 获取滚动位置 */
  getScrollOffset: <T extends SelectAll = false, R = QueryResult<T>>(
    selector?: string | UniApp.NodesRef,
  ) => Promise<R>
  /** 获取节点上下文 */
  getContext: <T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    all?: T,
  ) => Promise<R>
}

export function useSelectorQuery(): UseSelectorQueryReturn {
  const query = ref<UniApp.SelectorQuery>()

  // 尝试初始化一次，覆盖该方法在 onMounted 之后调用的情况
  initQuery()
  onMounted(initQuery)

  function initQuery(): void {
    if (query.value) {
      return
    }
    const instance = getCurrentInstance()
    if (instance == null) {
      return
    }
    query.value = uni.createSelectorQuery().in(instance)
  }

  function getQuery(): UniApp.SelectorQuery {
    initQuery()
    if (query.value == null) {
      throw new Error('SelectorQuery initialization failed')
    }
    return query.value
  }

  function select(selector: string | UniApp.NodesRef, all?: SelectAll): UniApp.NodesRef {
    return typeof selector === 'string'
      ? all
        ? getQuery().selectAll(selector)
        : getQuery().select(selector)
      : selector
  }

  function getBoundingClientRect<T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    all?: T,
  ): Promise<R> {
    return new Promise<R>((resolve) => {
      select(selector, all)
        .boundingClientRect(res => resolve(res as R))
        .exec()
    })
  }

  function getFields<T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    fields: UniApp.NodeField,
    all?: T,
  ): Promise<R> {
    return new Promise<R>((resolve) => {
      select(selector, all)
        .fields(fields, res => resolve(res as R))
        .exec()
    })
  }

  function getScrollOffset<T extends SelectAll = false, R = QueryResult<T>>(
    selector?: string | UniApp.NodesRef,
  ): Promise<R> {
    return new Promise<R>((resolve) => {
      const node = selector === undefined
        ? getQuery().selectViewport()
        : select(selector)
      node.scrollOffset(res => resolve(res as R)).exec()
    })
  }

  function getContext<T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    all?: T,
  ): Promise<R> {
    return new Promise<R>((resolve) => {
      select(selector, all)
        .context(res => resolve(res as R))
        .exec()
    })
  }

  return {
    query,
    getQuery,
    select,
    getNode: select,
    getBoundingClientRect,
    getFields,
    getScrollOffset,
    getContext,
  }
}

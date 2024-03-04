import { getCurrentInstance, onMounted, ref } from 'vue';

export type SelectAll = boolean;
export type QueryResult<M extends SelectAll> = M extends true ? UniApp.NodeInfo[] : UniApp.NodeInfo;

export function useSelectorQuery() {
  const query = ref<UniApp.SelectorQuery>();

  // 尝试初始化一次，覆盖该方法在 onMounted 之后调用的情况
  initQuery();
  onMounted(initQuery);

  function initQuery() {
    if (query.value) {
      return;
    }
    const instance = getCurrentInstance();
    if (instance == null) {
      return;
    }
    query.value = uni.createSelectorQuery().in(instance);
  }

  function getQuery(): UniApp.SelectorQuery {
    initQuery();
    if (query.value == null) {
      throw new Error('SelectorQuery initialization failed');
    }
    return query.value;
  }

  function select(selector: string | UniApp.NodesRef, all?: SelectAll) {
    return typeof selector === 'string'
      ? all
        ? getQuery().selectAll(selector)
        : getQuery().select(selector)
      : selector;
  }

  function getBoundingClientRect<T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    all?: T,
  ) {
    return new Promise<R>((resolve) => {
      select(selector, all)
        .boundingClientRect(res => resolve(res as R))
        .exec();
    });
  }

  function getFields<T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    fields: UniApp.NodeField,
    all?: T,
  ) {
    return new Promise<R>((resolve) => {
      select(selector, all)
        .fields(fields, res => resolve(res as R))
        .exec();
    });
  }

  function getScrollOffset<T extends SelectAll = false, R = QueryResult<T>>(
    selector?: string | UniApp.NodesRef,
  ) {
    return new Promise<R>((resolve) => {
      const node = selector === undefined ? getQuery().selectViewport() : select(selector);
      node.scrollOffset(res => resolve(res as R)).exec();
    });
  }

  function getContext<T extends SelectAll = false, R = QueryResult<T>>(
    selector: string | UniApp.NodesRef,
    all?: T,
  ) {
    return new Promise<R>((resolve) => {
      select(selector, all)
        .context(res => resolve(res as R))
        .exec();
    });
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
  };
}

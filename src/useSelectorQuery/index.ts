import { getCurrentInstance, ref, onMounted } from 'vue';

export function useSelectorQuery() {
  const query = ref<UniApp.SelectorQuery>();

  // init once, in case the HOOK run after onMounted;
  initQuery();

  // onMounted will not work if this HOOK run after compontent mounted.
  onMounted(initQuery);

  function initQuery() {
    if (query.value) {
      return;
    }

    const instance = getCurrentInstance();
    query.value = uni.createSelectorQuery().in(instance);
  }

  function getQuery(): Promise<UniApp.SelectorQuery> {
    initQuery();
    return query.value;
  }

  function select(selector: string | UniApp.NodesRef, all = false) {
    initQuery();
    return typeof selector === 'string'
      ? all
        ? query.value.selectAll(selector)
        : query.value.select(selector)
      : selector;
  }

  function getBoundingClientRect(selector: string | UniApp.NodesRef, all = false) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) =>
      select(selector, all)
        .boundingClientRect((res) => resolve(res))
        .exec(),
    );
  }

  function getFields(selector: string | UniApp.NodesRef, fields: UniApp.NodeField, all = false) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      select(selector, all)
        .fields(fields, (res) => resolve(res))
        .exec();
    });
  }

  function getScrollOffset(node?: UniApp.NodesRef) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      initQuery();

      node = node || query.value.selectViewport();
      node.scrollOffset((res) => resolve(res)).exec();
    });
  }

  function getContext(selector: string | UniApp.NodesRef, all = false) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      select(selector, all)
        .context((res) => resolve(res))
        .exec();
    });
  }

  return {
    query,
    getQuery,
    select,
    getBoundingClientRect,
    getFields,
    getScrollOffset,
    getContext,
  };
}

import { getCurrentInstance } from 'vue';

export function useSelectorQuery() {
  const instance = getCurrentInstance();
  const query = uni.createSelectorQuery().in(instance);

  function select(selector: string | UniApp.NodesRef, all = false) {
    return typeof selector === 'string'
      ? all
        ? query.selectAll(selector)
        : query.select(selector)
      : selector;
  }

  function getBoundingClientRect(selector: string | UniApp.NodesRef, all = false) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      select(selector, all)
        .boundingClientRect((rect) => resolve(rect))
        .exec();
    });
  }

  function getFields(selector: string | UniApp.NodesRef, fields: UniApp.NodeField, all = false) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      select(selector, all)
        .fields(fields, (data) => resolve(data))
        .exec();
    });
  }

  function getScrollOffset(node?: UniApp.NodesRef) {
    return new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      node = node || query.selectViewport();
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
    select,
    getBoundingClientRect,
    getFields,
    getScrollOffset,
    getContext,
  };
}

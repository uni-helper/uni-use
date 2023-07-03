import { getCurrentInstance, ref, onMounted } from 'vue';

export function useSelectorQuery() {
  const query = ref<UniApp.SelectorQuery>();

  // init once, in case the HOOK run after onMounted;
  initQuery();

  // onMounted will not work if this HOOK run after compontent mounted.
  onMounted(initQuery);

  async function initQuery() {
    if (query.value) {
      return;
    }

    const instance = getCurrentInstance();
    query.value = await Promise.resolve(uni.createSelectorQuery().in(instance));
  }

  async function getQuery(): Promise<UniApp.SelectorQuery> {
    await initQuery();
    return query.value;
  }

  async function select(selector: string | UniApp.NodesRef, all = false) {
    await initQuery();
    return typeof selector === 'string'
      ? all
        ? query.value.selectAll(selector)
        : query.value.select(selector)
      : selector;
  }

  async function getBoundingClientRect(selector: string | UniApp.NodesRef, all = false) {
    const node = await select(selector, all);

    const res = await new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) =>
      node.boundingClientRect((res) => resolve(res)).exec(),
    );

    return res;
  }

  async function getFields(
    selector: string | UniApp.NodesRef,
    fields: UniApp.NodeField,
    all = false,
  ) {
    const node = await select(selector, all);

    const res = new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      node.fields(fields, (res) => resolve(res)).exec();
    });

    return res;
  }

  async function getScrollOffset(node?: UniApp.NodesRef) {
    await initQuery();

    node = node || query.value.selectViewport();

    const res = await new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      initQuery().then(() => {
        node.scrollOffset((res) => resolve(res)).exec();
      });
    });

    return res;
  }

  async function getContext(selector: string | UniApp.NodesRef, all = false) {
    const node = await select(selector, all);

    const res = await new Promise<UniApp.NodeInfo | UniApp.NodeInfo[]>((resolve) => {
      node.context((res) => resolve(res)).exec();
    });

    return res;
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

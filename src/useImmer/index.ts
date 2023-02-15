import produce, { type Draft } from 'immer';
import { shallowRef } from 'vue';

/**
 * 和 immer 结合使用
 *
 * immer https://immerjs.github.io/immer/
 */
export function useImmer<Base, D = Draft<Base>>(baseState: Base) {
  const state = shallowRef(baseState);
  const update = (updater: (draft: D) => D) => (state.value = produce(state.value, updater));
  return { state, update, produce };
}

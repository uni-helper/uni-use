import produce, { Draft } from 'immer';
import { shallowRef } from 'vue';

export function useImmer<Base, D = Draft<Base>>(baseState: Base) {
  const state = shallowRef(baseState);
  const update = (updater: (draft: D) => D) => (state.value = produce(state.value, updater));
  return { state, update, produce };
}

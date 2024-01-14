import type { Ref } from 'vue';

export type AnyRecord = Record<string, any>;

export type MaybeRef<T> = T | Ref<T>;

export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T);

export type MaybeComputedRef<T> = MaybeRefOrGetter<T>;

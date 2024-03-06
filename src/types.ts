import type { Ref } from 'vue';

export type AnyRecord = Record<string, any>;

export type MaybeRef<T> = T | Ref<T>;

export type MaybeRefOrGetter<T> = MaybeRef<T> | (() => T);

export type MaybeComputedRef<T> = MaybeRefOrGetter<T>;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type RequiredProperty<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type RequiredOnly<T, K extends keyof T> = RequiredProperty<Partial<T>, K>;

export type MaybePromise<T> = T | Promise<T>;

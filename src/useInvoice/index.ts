import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniChooseInvoiceOptions extends UniApp.ChooseInvoiceOption {}
export type ChooseInvoiceOptions = MaybeComputedRef<UniChooseInvoiceOptions>;

export interface UniChooseInvoiceTitleOptions extends UniApp.ChooseInvoiceTitleOptions {}
export type ChooseInvoiceTitleOptions = MaybeComputedRef<UniChooseInvoiceTitleOptions>;

export function useInvoice() {
  const chooseInvoice = (options?: ChooseInvoiceOptions) =>
    uni.chooseInvoice(reactive({ ...resolveUnref(options) }));

  const chooseInvoiceTitle = (options?: ChooseInvoiceTitleOptions) =>
    uni.chooseInvoiceTitle(reactive({ ...resolveUnref(options) }));

  return {
    chooseInvoice,
    choose: chooseInvoice,
    chooseInvoiceTitle,
    chooseTitle: chooseInvoiceTitle,
  };
}

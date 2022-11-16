import { reactive } from 'vue';
import { MaybeComputedRef, resolveUnref } from '@vueuse/core';

export interface UniChooseImageOptions extends UniApp.ChooseImageOptions {}
export type ChooseImageOptions = MaybeComputedRef<UniChooseImageOptions>;

export interface UniChooseMediaOptions extends UniApp.ChooseMediaOption {}
export type ChooseMediaOptions = MaybeComputedRef<UniChooseMediaOptions>;

export interface UniPreviewImageOptions extends UniApp.PreviewImageOptions {}
export type PreviewImageOptions = MaybeComputedRef<UniPreviewImageOptions>;

export interface UniClosePreviewImageOptions extends UniApp.CallBackOptions {}
export type ClosePreviewImageOptions = MaybeComputedRef<UniClosePreviewImageOptions>;

export interface UniGetImageInfoOptions extends UniApp.GetImageInfoOptions {}
export type GetImageInfoOptions = MaybeComputedRef<UniGetImageInfoOptions>;

export interface UniSaveImageToPhotosAlbumOptions extends UniApp.SaveImageToPhotosAlbumOptions {}
export type SaveImageToPhotosAlbumOptions = MaybeComputedRef<UniSaveImageToPhotosAlbumOptions>;

export interface UniCompressImageOptions extends UniApp.CompressImageOptions {}
export type CompressImageOptions = MaybeComputedRef<UniCompressImageOptions>;

export function useImage() {
  const chooseImage = (options?: ChooseImageOptions) =>
    uni.chooseImage(reactive({ ...resolveUnref(options) }));

  const chooseMedia = (options?: ChooseMediaOptions) =>
    uni.chooseMedia(reactive({ ...resolveUnref(options) }));

  const previewImage = (options?: PreviewImageOptions) =>
    uni.previewImage(reactive({ urls: [], ...resolveUnref(options) }));

  const closePreviewImage = (options?: ClosePreviewImageOptions) =>
    uni.closePreviewImage(reactive({ ...resolveUnref(options) }));

  const getImageInfo = (options?: GetImageInfoOptions) =>
    uni.getImageInfo(reactive({ src: '', ...resolveUnref(options) }));

  const saveImageToPhotosAlbum = (options?: SaveImageToPhotosAlbumOptions) =>
    uni.saveImageToPhotosAlbum(reactive({ filePath: '', ...resolveUnref(options) }));

  const compressImage = (options?: CompressImageOptions) =>
    uni.compressImage(reactive({ src: '', ...resolveUnref(options) }));

  return {
    chooseImage,
    choose: chooseImage,
    chooseMedia,
    previewImage,
    preview: previewImage,
    closePreviewImage,
    closePreview: closePreviewImage,
    getImageInfo,
    getInfo: getImageInfo,
    saveImageToPhotosAlbum,
    saveToPhotosAlbum: saveImageToPhotosAlbum,
    compressImage,
    compress: compressImage,
  };
}

import { tryOnMounted, MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';
import { ChooseMediaOptions } from '../useImage';

export interface UniChooseVideoOptions extends UniApp.ChooseVideoOptions {}
export type ChooseVideoOptions = MaybeComputedRef<UniChooseVideoOptions>;

export interface UniSaveVideoToPhotosAlbum extends UniApp.SaveVideoToPhotosAlbumOptions {}
export type SaveVideoToPhotosAlbumOptions = MaybeComputedRef<UniSaveVideoToPhotosAlbum>;

export interface UniGetVideoInfoOptions extends UniApp.GetVideoInfoOptions {}
export type GetVideoInfoOptions = MaybeComputedRef<UniGetVideoInfoOptions>;

export interface UniCompressVideoOptions extends UniApp.CompressVideoOptions {}
export type CompressVideoOptions = MaybeComputedRef<UniCompressVideoOptions>;

export interface UniOpenVideoEditorOptions extends UniApp.OpenVideoEditorOptions {}
export type OpenVideoEditorOptions = MaybeComputedRef<UniOpenVideoEditorOptions>;

export function useVideo() {
  const createVideoContext = (...params: Parameters<UniApp.Uni['createVideoContext']>) => {
    let context: UniApp.VideoContext | undefined;
    tryOnMounted(() => {
      context = uni.createVideoContext(...params);
    });
    return context;
  };

  const chooseVideo = (options?: ChooseVideoOptions) =>
    uni.chooseVideo(reactive({ ...resolveUnref(options) }));

  const chooseMedia = (options?: ChooseMediaOptions) =>
    uni.chooseMedia(reactive({ ...resolveUnref(options) }));

  const saveVideoToPhotosAlbum = (options?: SaveVideoToPhotosAlbumOptions) =>
    uni.saveVideoToPhotosAlbum(reactive({ filePath: '', ...resolveUnref(options) }));

  const getVideoInfo = (options?: GetVideoInfoOptions) =>
    uni.getVideoInfo(reactive({ src: '', ...resolveUnref(options) }));

  const compressVideo = (options?: CompressVideoOptions) =>
    uni.compressVideo(reactive({ src: '', ...resolveUnref(options) }));

  const openVideoEditor = (options?: OpenVideoEditorOptions) =>
    uni.openVideoEditor(reactive({ filePath: '', ...resolveUnref(options) }));

  return {
    createVideoContext,
    createContext: createVideoContext,
    chooseVideo,
    choose: chooseVideo,
    chooseMedia,
    saveVideoToPhotosAlbum,
    saveToPhotosAlbum: saveVideoToPhotosAlbum,
    getVideoInfo,
    getInfo: getVideoInfo,
    compressVideo,
    compress: compressVideo,
    openVideoEditor,
    openEditor: openVideoEditor,
  };
}

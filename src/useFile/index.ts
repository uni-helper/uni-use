import { MaybeComputedRef, resolveUnref } from '@vueuse/core';
import { reactive } from 'vue';

export interface UniChooseFileOptions extends UniApp.ChooseFileOptions {}
export type ChooseFileOptions = MaybeComputedRef<UniChooseFileOptions>;

export interface UniChooseMessageFileOptions extends UniApp.ChooseMessageFileOption {}
export type ChooseMessageFileOptions = MaybeComputedRef<UniChooseMessageFileOptions>;

export interface UniSaveFileOptions extends UniApp.SaveFileOptions {}
export type SaveFileOptions = MaybeComputedRef<UniSaveFileOptions>;

export interface UniGetSavedFileListOptions extends UniApp.GetSavedFileListOptions {}
export type GetSavedFileListOptions = MaybeComputedRef<UniGetSavedFileListOptions>;

export interface UniGetSavedFileInfoOptions extends UniApp.GetSavedFileInfoOptions {}
export type GetSavedFileInfoOptions = MaybeComputedRef<UniGetSavedFileInfoOptions>;

export interface UniRemoveSavedFileOptions extends UniApp.RemoveSavedFileOptions {}
export type RemoveSavedFileOptions = MaybeComputedRef<UniRemoveSavedFileOptions>;

export interface UniGetFileInfoOptions extends UniApp.GetFileInfoOptions {}
export type GetFileInfoOptions = MaybeComputedRef<UniGetFileInfoOptions>;

export interface UniOpenDocumentOptions extends UniApp.OpenDocumentOptions {}
export type OpenDocumentOptions = MaybeComputedRef<UniOpenDocumentOptions>;

export function useFile() {
  const chooseFile = (options?: ChooseFileOptions) =>
    uni.chooseFile(reactive({ ...resolveUnref(options) }));

  const chooseMessageFile = (options?: ChooseMessageFileOptions) =>
    uni.chooseMessageFile(reactive({ count: 9, ...resolveUnref(options) }));

  const saveFile = (options?: SaveFileOptions) =>
    uni.saveFile(reactive({ tempFilePath: '', ...resolveUnref(options) }));

  const getSavedFileList = (options?: GetSavedFileListOptions) =>
    uni.getSavedFileList(reactive({ ...resolveUnref(options) }));

  const getSavedFileInfo = (options?: GetSavedFileInfoOptions) =>
    uni.getSavedFileInfo(reactive({ filePath: '', ...resolveUnref(options) }));

  const removeSavedFile = (options?: RemoveSavedFileOptions) =>
    uni.removeSavedFile(reactive({ filePath: '', ...resolveUnref(options) }));

  const getFileInfo = (options?: GetFileInfoOptions) =>
    uni.getFileInfo(reactive({ filePath: '', ...resolveUnref(options) }));

  const openDocument = (options?: OpenDocumentOptions) =>
    uni.openDocument(reactive({ filePath: '', ...resolveUnref(options) }));

  const fileSystemManager = uni.getFileSystemManager();

  const useFileSystemManager = () => fileSystemManager;

  return {
    chooseFile,
    choose: chooseFile,
    chooseMessageFile,
    chooseMessage: chooseMessageFile,
    saveFile,
    save: saveFile,
    getSavedFileList,
    getSavedList: getSavedFileList,
    getSavedFileInfo,
    getSavedInfo: getSavedFileInfo,
    removeSavedFile,
    removeSaved: removeSavedFile,
    getFileInfo,
    getInfo: getFileInfo,
    openDocument,
    open: openDocument,
    fileSystemManager,
    manager: fileSystemManager,
    useFileSystemManager,
    useManager: useFileSystemManager,
  };
}

import * as UniUse from './exports';
export * from './exports';

export const UniUseAutoImports: Record<string, Array<string | [string, string]>> = {
  '@uni-helper/uni-use': Object.keys(UniUse),
};

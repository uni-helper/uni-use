import { name } from '../package.json';
import * as UniUse from './exports';
export * from './exports';

/** @deprecated 建议使用 `uniuseAutoImports` 函数 */
export const UniUseAutoImports: Record<string, Array<string | [string, string]>> = {
  [name]: Object.keys(UniUse),
};

export type UniUseFunction = keyof typeof UniUse;

export interface UniUseAutoImportsOptions {
  only?: UniUseFunction[];
  except?: UniUseFunction[];
}

/** 自定义配置 unplugin-auto-import */
export function uniuseAutoImports(options: UniUseAutoImportsOptions = {}) {
  let exports = Object.keys(UniUse);

  if (options.only) {
    exports = exports.filter((fn) => (options.only as string[])!.includes(fn));
  }

  if (options.except) {
    exports = exports.filter((fn) => !(options.except as string[])!.includes(fn));
  }

  return {
    [name]: exports,
  };
}

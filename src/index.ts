import { name } from '../package.json';
import * as UniUse from './exports';
export * from './exports';

export const UniUseAutoImports: Record<string, Array<string | [string, string]>> = {
  [name]: Object.keys(UniUse),
};

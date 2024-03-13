import { uni } from '@dcloudio/uni-h5/dist/uni-h5.es';
import { beforeEach, vi } from 'vitest';

vi.stubEnv('NODE_ENV', 'test');
vi.stubEnv('UNI_PLATFORM', 'h5');

vi.stubGlobal('uni', uni);

beforeEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

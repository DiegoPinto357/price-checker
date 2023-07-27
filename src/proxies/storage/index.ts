import { Capacitor } from '@capacitor/core';

const platform = Capacitor.getPlatform();

export interface StorageProxy {
  writeFile: <T>(filename: string, data: T) => Promise<void>;
  readFile: <T>(filename: string) => Promise<T>;
}

export default platform === 'web'
  ? ((await import('./storageHttp')).default as unknown as StorageProxy)
  : ((await import('./storageIpc')).default as unknown as StorageProxy);

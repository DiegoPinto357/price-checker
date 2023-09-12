import { Capacitor } from '@capacitor/core';
import storageHttp from './storageHttp';
import storageIpc from './storageIpc';

const platform = Capacitor.getPlatform();

export default platform === 'web' ? storageHttp : storageIpc;

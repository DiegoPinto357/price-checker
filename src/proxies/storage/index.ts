import { Capacitor } from '@capacitor/core';
import storageHttp from './storageHttp';
import storageMobile from './storageMobile';

const platform = Capacitor.getPlatform();

export default platform === 'web' ? storageHttp : storageMobile;

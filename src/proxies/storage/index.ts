import { Capacitor } from '@capacitor/core';
import storageWeb from './storageWeb';
import storageMobile from './storageMobile';

const platform = Capacitor.getPlatform();

export default platform === 'web' ? storageWeb : storageMobile;

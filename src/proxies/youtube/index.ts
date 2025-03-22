import { Capacitor } from '@capacitor/core';
import youtubeHttp from './youtubeHttp';
import youtubeIpc from './youtubeIpc';

const platform = Capacitor.getPlatform();

export default platform === 'web' ? youtubeHttp : youtubeIpc;

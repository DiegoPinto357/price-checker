import { Capacitor } from '@capacitor/core';
import openAiHttp from './openAiHttp';
import openAiIpc from './openAiIpc';

const platform = Capacitor.getPlatform();

export default platform === 'web' ? openAiHttp : openAiIpc;

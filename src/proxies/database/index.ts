import { Capacitor } from '@capacitor/core';
import databaseHttp from './databaseHttp';
import databaseIpc from './databaseIpc';

const platform = Capacitor.getPlatform();

export default platform === 'web' ? databaseHttp : databaseIpc;

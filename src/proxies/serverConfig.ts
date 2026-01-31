import axios from 'axios';
import { getServerHost } from '../config';

type ServerConfig = {
  sandboxMode: boolean;
};

let cachedConfig: ServerConfig | null = null;

export const getServerConfig = async (): Promise<ServerConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const serverHost = await getServerHost();
    const response = await axios.get<ServerConfig>(`${serverHost}/config`);
    cachedConfig = response.data;
    console.log('[serverConfig] Fetched config from server:', cachedConfig);
    return cachedConfig;
  } catch (error) {
    console.error('[serverConfig] Failed to fetch config from server:', error);
    cachedConfig = { sandboxMode: false };
    return cachedConfig;
  }
};

export const resetConfigCache = (): void => {
  cachedConfig = null;
};

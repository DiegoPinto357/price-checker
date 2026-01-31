import axios from 'axios';
import { getServerHost } from '../config';
import logger from '../libs/logger';

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
    console.log({ cachedConfig });
    logger.log('[serverConfig] Fetched config from server:', cachedConfig);
    return cachedConfig;
  } catch (error) {
    logger.error('[serverConfig] Failed to fetch config from server:', error);
    cachedConfig = { sandboxMode: false };
    return cachedConfig;
  }
};

export const resetConfigCache = (): void => {
  cachedConfig = null;
};

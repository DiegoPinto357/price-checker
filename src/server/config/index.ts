type Config = {
  sandboxMode: boolean;
};

let config: Config | null = null;

export const loadConfig = (): void => {
  config = {
    sandboxMode: process.env.SANDBOX_MODE === 'true',
  };
};

export const getConfig = (): Config => {
  if (!config) {
    loadConfig();
  }
  return config!;
};

export default {
  loadConfig,
  getConfig,
};

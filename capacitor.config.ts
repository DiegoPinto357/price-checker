import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pricechecker.app',
  appName: 'price-checker',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    CapacitorNodeJS: {
      nodeDir: 'nodejs',
    },
  },
};

export default config;

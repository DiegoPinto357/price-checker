import { config } from 'dotenv';
import { resolve } from 'path';

export const loadEnv = (): void => {
  const envPath = resolve(process.cwd(), '.env');
  config({ path: envPath });
};

export default loadEnv;

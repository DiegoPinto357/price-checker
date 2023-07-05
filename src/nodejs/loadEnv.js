/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const env = require('./env.json');
Object.keys(env).forEach(key => (process.env[key] = env[key]));

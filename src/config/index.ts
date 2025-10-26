// Configuration for the app
// REMOTE_SERVER_HOST: Server on local network (set to your computer's IP)
// Example: 'http://192.168.1.100:3002' or 'http://10.0.0.5:3002'
// Set to null to always use localhost
export const REMOTE_SERVER_HOST: string | null = null;

// LOCALHOST_SERVER_HOST: Fallback server (default localhost)
export const LOCALHOST_SERVER_HOST = 'http://127.0.0.1:3002';

// SERVER_HOST: Will try REMOTE_SERVER_HOST first, then fall back to localhost
// This is the main export used by the app
export const SERVER_HOST = REMOTE_SERVER_HOST || LOCALHOST_SERVER_HOST;

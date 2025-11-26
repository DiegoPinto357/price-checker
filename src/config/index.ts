import axios from 'axios';

// Configuration for the app
// REMOTE_SERVER_HOST: Server on local network (set to your computer's IP)
// Example: 'http://192.168.1.100:3002' or 'http://10.0.0.5:3002'
// Set to null to always use localhost
export const REMOTE_SERVER_HOST: string | null = null;

// LOCALHOST_SERVER_HOST: Fallback server (default localhost)
export const LOCALHOST_SERVER_HOST = 'http://127.0.0.1:3002';

// Cached server host (determined at runtime)
let cachedServerHost: string | null = null;

// Check if a server is reachable with a quick timeout
const isServerReachable = async (host: string): Promise<boolean> => {
  try {
    await axios.get(`${host}/`, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
};

/**
 * Runtime server host detection with fallback.
 * Tries REMOTE_SERVER_HOST first, falls back to LOCALHOST_SERVER_HOST if unreachable.
 * Results are cached after first check to avoid repeated health checks.
 */
export const getServerHost = async (): Promise<string> => {
  // Return cached result if available
  if (cachedServerHost) {
    return cachedServerHost;
  }

  // If remote is configured, try it first
  if (REMOTE_SERVER_HOST) {
    const remoteReachable = await isServerReachable(REMOTE_SERVER_HOST);
    if (remoteReachable) {
      cachedServerHost = REMOTE_SERVER_HOST;
      console.log(`[config] Using remote server: ${REMOTE_SERVER_HOST}`);
      return cachedServerHost;
    }
    console.log(
      `[config] Remote server unreachable, falling back to localhost`
    );
  }

  // Fall back to localhost
  cachedServerHost = LOCALHOST_SERVER_HOST;
  console.log(`[config] Using localhost server: ${LOCALHOST_SERVER_HOST}`);
  return cachedServerHost;
};

// Reset cached server (useful for testing or forcing re-check)
export const resetServerHostCache = (): void => {
  cachedServerHost = null;
};

// Static fallback for backward compatibility
export const SERVER_HOST = REMOTE_SERVER_HOST || LOCALHOST_SERVER_HOST;

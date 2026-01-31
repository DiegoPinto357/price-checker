import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// Configuration for the app
// REMOTE_SERVER_HOST: Server on local network (set to your computer's IP)
// Example: 'http://192.168.1.100:3002' or 'http://10.0.0.5:3002'
// Set to null to always use localhost
export const REMOTE_SERVER_HOST: string | null = null;

// Android emulator host for accessing computer's localhost
export const ANDROID_EMULATOR_HOST = 'http://10.0.2.2:3002';

// LOCALHOST_SERVER_HOST: Fallback server (default localhost)
export const LOCALHOST_SERVER_HOST = 'http://127.0.0.1:3002';

// Cached server host (determined at runtime)
let cachedServerHost: string | null = null;

// Check if a server is reachable with a quick timeout
const isServerReachable = async (host: string): Promise<boolean> => {
  try {
    await axios.get(`${host}/health`, { timeout: 2000 });
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
  console.log('[config] Detecting server host...');
  // Return cached result if available
  if (cachedServerHost) {
    console.log(`[config] Using cached server host: ${cachedServerHost}`);
    return cachedServerHost;
  }

  // Detect platform using Capacitor
  const platform = Capacitor.getPlatform();
  console.log(`[config] Detected platform: ${platform}`);
  if (platform === 'android') {
    // Use Android emulator host for localhost
    const androidReachable = await isServerReachable(ANDROID_EMULATOR_HOST);
    if (androidReachable) {
      cachedServerHost = ANDROID_EMULATOR_HOST;
      console.log(
        `[config] Using Android emulator host: ${ANDROID_EMULATOR_HOST}`
      );
      return cachedServerHost;
    }
    console.log(
      `[config] Android emulator host unreachable, falling back to other hosts`
    );
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

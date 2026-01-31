const shouldLog = process.env.NODE_ENV !== 'test';

export const logger = {
  log: (...args: unknown[]) => {
    if (shouldLog) {
      console.log(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (shouldLog) {
      console.error(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog) {
      console.warn(...args);
    }
  },
};

export default logger;

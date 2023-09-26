import { vi } from 'vitest';

type Callbak = <T>(event: { args: unknown[] }) => Promise<T>;

const events = new Map<string, Callbak>();

export const NodeJS = {
  addListener: vi.fn((channelName: string, callback: Callbak) => {
    events.set(channelName, callback);
    return channelName;
  }),

  removeListener: vi.fn((channelName: string) => {
    events.delete(channelName);
  }),

  send: vi.fn(),

  triggerReply: (channelName: string, data: unknown) => {
    const callback = events.get(channelName);
    if (callback) {
      callback({ args: [data] });
    }
  },
};

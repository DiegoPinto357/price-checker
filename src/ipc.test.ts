import { NodeJS } from 'capacitor-nodejs';
import ipc from './ipc';

type MockNodeJS = typeof NodeJS & {
  triggerReply: (channelName: string, data: unknown) => void;
};

vi.mock('capacitor-nodejs');
vi.mock('uuid', () => ({
  v4: () => 'f09a082b-fcaa-4896-8a03-aebf3c3b79f9',
}));

describe('ipc', () => {
  // TODO add test to assert listener management
  it('sends an event and get a reply', async () => {
    const channelName = 'get:potatos';
    const replyChannelName =
      'get:potatos-reply-f09a082b-fcaa-4896-8a03-aebf3c3b79f9';
    const sendPromise = ipc.send(channelName);
    (NodeJS as MockNodeJS).triggerReply(replyChannelName, 'potatos');

    const result = await sendPromise;

    expect(result).toEqual('potatos');
  });
});

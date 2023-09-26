import { NodeJS } from 'capacitor-nodejs';
import { v4 as uuid } from 'uuid';

const buildReplyChannelName = (channelName: string, id: string) =>
  `${channelName}-reply-${id}`;

const send = <T>(channelName: string, params?: unknown): Promise<T> =>
  new Promise(resolve => {
    const id = uuid();

    const replyListener = NodeJS.addListener(
      buildReplyChannelName(channelName, id),
      event => {
        NodeJS.removeListener(replyListener);
        console.log(`${channelName} reply received`);
        const data: T = event.args[0];
        resolve(data);
      }
    );

    NodeJS.send({
      eventName: channelName,
      args: [id, params],
    });
  });

export default {
  send,
};

/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { channel } = require('bridge');

const buildReplyChannelName = (channelName, id) => `${channelName}-reply-${id}`;

const on = (channelName, callback) => {
  channel.addListener(channelName, async (id, params) => {
    const replyChannelName = buildReplyChannelName(channelName, id);
    console.log({ channelName, id, replyChannelName });
    const reply = res => channel.send(replyChannelName, res);
    await callback(params, reply);
  });
};

module.exports = {
  on,
};

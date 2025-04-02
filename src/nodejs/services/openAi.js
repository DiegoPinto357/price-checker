/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const createResponse = ({ input, instructions = '', model = 'gpt-4o-mini' }) =>
  client.responses.create({
    model,
    instructions,
    input,
  });

module.exports = {
  createResponse,
};

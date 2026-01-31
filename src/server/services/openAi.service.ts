import OpenAI from 'openai';

let client: OpenAI | null = null;

const getClient = (): OpenAI => {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
};

type CreateResponseParams = {
  input: string;
  instructions?: string;
  model?: string;
};

export const createResponse = async ({
  input,
  instructions = '',
  model = 'gpt-4o-mini',
}: CreateResponseParams) => {
  const openai = getClient();
  return openai.chat.completions.create({
    model,
    messages: [
      ...(instructions
        ? [{ role: 'system' as const, content: instructions }]
        : []),
      { role: 'user' as const, content: input },
    ],
  });
};

export default {
  createResponse,
};

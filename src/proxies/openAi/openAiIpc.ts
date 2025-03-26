import type { CreateResponseParams, OpenAiResponse } from './types';

const createResponse = async (params: CreateResponseParams) => {
  return params as unknown as OpenAiResponse;
};

export default {
  createResponse,
};

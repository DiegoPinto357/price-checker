import axios from 'axios';

import type { CreateResponseParams, OpenAiResponse } from './types';

const serverHost = 'http://127.0.0.1:3002';

const createResponse = async (params: CreateResponseParams) => {
  try {
    const { data } = await axios.post<OpenAiResponse>(
      `${serverHost}/openai/create-response`,
      params
    );
    return data;
  } catch (error) {
    return;
  }
};

export default {
  createResponse,
};

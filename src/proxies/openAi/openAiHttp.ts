import axios from 'axios';
import { SERVER_HOST } from '../../config';

import type { CreateResponseParams, OpenAiResponse } from './types';

const createResponse = async (params: CreateResponseParams) => {
  try {
    const { data } = await axios.post<OpenAiResponse>(
      `${SERVER_HOST}/openai/create-response`,
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

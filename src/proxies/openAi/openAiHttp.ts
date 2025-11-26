import axios from 'axios';
import { getServerHost } from '../../config';

import type { CreateResponseParams, OpenAiResponse } from './types';

const createResponse = async (params: CreateResponseParams) => {
  try {
    const serverHost = await getServerHost();
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

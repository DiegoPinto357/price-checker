import { FastifyInstance } from 'fastify';
import openAi from './services/openAi.service';

export default async (app: FastifyInstance) => {
  type CreateResponseBody = {
    input: string;
    instructions?: string;
    model?: string;
  };

  app.post<{ Body: CreateResponseBody }>(
    '/openai/create-response',
    async (request, reply) => {
      try {
        const data = await openAi.createResponse(request.body);
        return reply.send(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          reply.status(500).send(error);
        } else {
          reply.status(500).send('Unknown error');
        }
      }
    }
  );
};

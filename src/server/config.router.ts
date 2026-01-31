import { FastifyInstance } from 'fastify';
import { getConfig } from './config';

export default async (app: FastifyInstance) => {
  app.get('/config', async (_request, reply) => {
    const config = getConfig();
    reply.send(config);
  });
};

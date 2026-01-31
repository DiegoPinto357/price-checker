import { FastifyInstance } from 'fastify';
import { parseNf } from './services/nfParser.service';

export default async (app: FastifyInstance) => {
  type NfDataQuerystring = {
    key: string;
  };

  app.get<{ Querystring: NfDataQuerystring }>(
    '/nf-data',
    async (request, reply) => {
      const { key } = request.query;
      try {
        const data = await parseNf(key);
        reply.send(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          reply.status(500).send({ error: error.message });
        } else {
          reply.status(500).send({ error: 'Unknown error' });
        }
      }
    }
  );
};

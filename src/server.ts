import fastify from 'fastify';
import cors from '@fastify/cors';
import nfParser from './nodejs/nfParser.js';

const app = fastify({
  logger: true,
});

app.register(cors);

app.setErrorHandler((error, _request, reply) => {
  console.error(error);
  reply.status(500).send();
});

app.get('/ping', (_request, reply) => {
  reply.send({ test: true });
});

interface IItemsQuerystring {
  key: string;
}

app.get<{ Querystring: IItemsQuerystring }>(
  '/items',
  async (request, reply) => {
    const { key } = request.query;
    const items = await nfParser(key);
    reply.send(items);
  }
);

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

import fastify from 'fastify';
import cors from '@fastify/cors';
import storageRouter from './storage.router.js';
import databaseRouter from './database.router.js';
import nfParser from '../nodejs/nfParser.js';

const app = fastify({
  logger: true,
});

app.register(cors);
app.register(storageRouter);
app.register(databaseRouter);

app.setErrorHandler((error, _request, reply) => {
  console.error(error);
  reply.status(500).send();
});

interface ItemsQuerystring {
  key: string;
}

app.get<{ Querystring: ItemsQuerystring }>(
  '/nf-data',
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

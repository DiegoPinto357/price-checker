import fastify from 'fastify';
import cors from '@fastify/cors';
import databaseRouter from './database.router.js';
import youtubeRouter from './youtube.router.js';
import openAiRouter from './openAi.router.js';
import nfParser from '../nodejs/nfParser.js';

const app = fastify({
  logger: true,
  connectionTimeout: 60000,
});

app.register(cors);
app.register(databaseRouter);
app.register(youtubeRouter);
app.register(openAiRouter);

app.get('/health', async (_request, reply) => {
  reply.send({ status: 'ok' });
});

app.setErrorHandler((error, _request, reply) => {
  console.error(error);
  reply.status(500).send(error);
});

interface ItemsQuerystring {
  key: string;
}

// TODO move to router file
app.get<{ Querystring: ItemsQuerystring }>(
  '/nf-data',
  async (request, reply) => {
    const { key } = request.query;
    const items = await nfParser(key);
    reply.send(items);
  }
);

const host = process.env.ANDROID ? '0.0.0.0' : '127.0.0.1';

app.listen({ port: 3002, host }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

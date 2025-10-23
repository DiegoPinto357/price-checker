import fastify from 'fastify';
import cors from '@fastify/cors';
import databaseRouter from './database.router.js';
import youtubeRouter from './youtube.router.js';
import openAiRouter from './openAi.router.js';
import nfParser from '../nodejs/nfParser.js';

const app = fastify({
  logger: true,
});

app.register(cors);
app.register(databaseRouter);
app.register(youtubeRouter);
app.register(openAiRouter);

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

app.listen({ port: 3002 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

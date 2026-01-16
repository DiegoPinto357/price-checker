import fastify from 'fastify';
import cors from '@fastify/cors';
import { loadEnv } from './utils/loadEnv';
import { loadConfig } from './config';
import databaseRouter from './database.router';
import youtubeRouter from './youtube.router';
import openAiRouter from './openAi.router';
import nfRouter from './nf.router';
import storageRouter from './storage.router';

loadEnv();
loadConfig();

const app = fastify({
  logger: true,
  connectionTimeout: 60000,
});

app.register(cors);
app.register(databaseRouter);
app.register(youtubeRouter);
app.register(openAiRouter);
app.register(nfRouter);
app.register(storageRouter);

app.get('/health', async (_request, reply) => {
  reply.send({ status: 'ok' });
});

app.setErrorHandler((error, _request, reply) => {
  console.error(error);
  reply.status(500).send(error);
});

const host = process.env.ANDROID ? '0.0.0.0' : '127.0.0.1';
const port = process.env.PORT ? parseInt(process.env.PORT) : 3002;

app.listen({ port, host }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

import fastify from 'fastify';
import cors from '@fastify/cors';
import nfParser from './nodejs/nfParser.js';
import storage from './nodejs/services/storage.js';

const app = fastify({
  logger: true,
});

app.register(cors);

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

interface WriteFileBody {
  filename: string;
  data: unknown;
}

app.post<{ Body: WriteFileBody }>(
  '/storage/write-file',
  async (request, reply) => {
    const { filename, data } = request.body;
    await storage.writeFile(filename, data);
    reply.send();
  }
);

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

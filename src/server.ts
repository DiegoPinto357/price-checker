import fastify from 'fastify';
import cors from '@fastify/cors';
import { promises as fs } from 'fs';
import path from 'path';
import nfParser from './nodejs/nfParser.js';

const userDataFolder = './userData';

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
    const fullPath = path.join(userDataFolder, filename);
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    reply.send();
  }
);

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

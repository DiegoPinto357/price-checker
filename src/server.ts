import fastify from 'fastify';
import cors from '@fastify/cors';
import nfParser from './nodejs/nfParser.js';
import storage from './nodejs/services/storage.js';
import database from './nodejs/services/database.js';

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

interface ReadFileParams {
  filename: string;
}

interface FsError {
  code: string;
}

app.get<{ Params: ReadFileParams }>(
  '/storage/read-file/:filename',
  async (request, reply) => {
    const { filename } = request.params;
    try {
      const data = await storage.readFile(decodeURIComponent(filename));
      reply.send(data);
    } catch (error) {
      if (error instanceof Error) {
        const errorCode = ((<unknown>error) as FsError).code;
        console.log(errorCode);
        if (errorCode === 'ENOENT') {
          return reply.status(404).send();
        }
      }
    }
    reply.status(500).send();
  }
);

interface DatabaseFindBody {
  databaseName: string;
  collectionName: string;
}

app.post<{ Body: DatabaseFindBody }>(
  '/database/find',
  async (request, reply) => {
    const { databaseName, collectionName } = request.body;
    const data = await database.find(databaseName, collectionName);
    reply.send(data);
  }
);

app.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});

import { FastifyInstance } from 'fastify';
import database from '../nodejs/services/database.js';

export default async (app: FastifyInstance) => {
  interface DefaultBody {
    databaseName: string;
    collectionName: string;
  }
  interface FindBody extends DefaultBody {
    filter: object;
  }

  app.post<{ Body: FindBody }>('/database/find', async (request, reply) => {
    const { databaseName, collectionName, filter } = request.body;
    const data = await database.find(databaseName, collectionName, filter);
    reply.send(data);
  });

  app.post<{ Body: FindBody }>('/database/findOne', async (request, reply) => {
    const { databaseName, collectionName, filter } = request.body;
    const data = await database.findOne(databaseName, collectionName, filter);
    reply.send(data);
  });

  interface InserOneBody extends DefaultBody {
    document: object;
  }

  app.post<{ Body: InserOneBody }>(
    '/database/insertOne',
    async (request, reply) => {
      const { databaseName, collectionName, document } = request.body;
      const { data } = await database.insertOne(
        databaseName,
        collectionName,
        document
      );
      reply.send(data);
    }
  );

  interface UpdateOneBody extends DefaultBody {
    filter: object;
    update: object;
  }

  app.post<{ Body: UpdateOneBody }>(
    '/database/updateOne',
    async (request, reply) => {
      const { databaseName, collectionName, filter, update } = request.body;
      const { data } = await database.updateOne(
        databaseName,
        collectionName,
        filter,
        update
      );
      reply.send(data);
    }
  );
};

import { FastifyInstance } from 'fastify';
import database from './services/database.service';

export default async (app: FastifyInstance) => {
  interface DefaultBody {
    databaseName: string;
    collectionName: string;
  }
  interface FindBody extends DefaultBody {
    filter: object;
    options: object;
  }

  app.post<{ Body: FindBody }>('/database/find', async (request, reply) => {
    const { databaseName, collectionName, filter, options } = request.body;
    const data = await database.find(
      databaseName,
      collectionName,
      filter,
      options
    );
    reply.send(data);
  });

  app.post<{ Body: FindBody }>('/database/findOne', async (request, reply) => {
    const { databaseName, collectionName, filter, options } = request.body;
    const data = await database.findOne(
      databaseName,
      collectionName,
      filter,
      options
    );
    reply.send(data);
  });

  interface InserBody extends DefaultBody {
    documents: object[];
  }

  app.post<{ Body: InserBody }>('/database/insert', async (request, reply) => {
    const { databaseName, collectionName, documents } = request.body;
    const { data } = await database.insert(
      databaseName,
      collectionName,
      documents
    );
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
    options?: object;
  }

  app.post<{ Body: UpdateOneBody }>(
    '/database/updateOne',
    async (request, reply) => {
      const { databaseName, collectionName, filter, update, options } =
        request.body;
      const { data } = await database.updateOne(
        databaseName,
        collectionName,
        filter,
        update,
        options
      );
      reply.send(data);
    }
  );
};

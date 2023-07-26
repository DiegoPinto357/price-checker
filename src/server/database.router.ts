import { FastifyInstance } from 'fastify';
import database from '../nodejs/services/database.js';

export default async (app: FastifyInstance) => {
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
};

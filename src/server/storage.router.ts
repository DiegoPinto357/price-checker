import { FastifyInstance } from 'fastify';
import storage from './services/storage.service';

export default async (app: FastifyInstance) => {
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
        return reply.send(data);
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
};

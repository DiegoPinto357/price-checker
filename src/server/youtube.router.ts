import { FastifyInstance } from 'fastify';
import youtube from '../nodejs/services/youtube.js';

export default async (app: FastifyInstance) => {
  type VideoDataQuery = {
    videoURL: string;
  };

  app.get<{ Querystring: VideoDataQuery }>(
    '/youtube/video-data',
    async (request, reply) => {
      const { videoURL } = request.query;
      try {
        const data = await youtube.getVideoData(videoURL.trim());
        return reply.send(data);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          reply.status(500).send(error);
        } else {
          reply.status(500).send('Unknown error');
        }
      }
    }
  );
};

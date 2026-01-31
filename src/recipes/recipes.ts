import youtube from '../proxies/youtube';
import openAi from '../proxies/openAi';
import extractRecipeFromVideo from './prompts/extractRecipeFromVideo';
import logger from '../libs/logger';

import type { Recipe } from './types';

const preprocessOutput = (data: string) => {
  return data.replace(/```json|```/g, '').trim();
};

const createNewFromYoutubeVideo = async (videoURL: string) => {
  const videoData = await youtube.getVideoData(videoURL);

  if (videoData) {
    const response = await openAi.createResponse({
      input: extractRecipeFromVideo(videoData),
    });

    if (response?.output_text) {
      logger.log(response.output_text);
      return JSON.parse(preprocessOutput(response.output_text)) as Recipe;
    }
  }
};

export default {
  createNewFromYoutubeVideo,
};

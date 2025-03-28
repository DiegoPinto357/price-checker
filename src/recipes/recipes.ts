import youtube from '../proxies/youtube';
import openAi from '../proxies/openAi';
import extractRecipeFromVideo from './prompts/extractRecipeFromVideo';

const createNewFromYoutubeVideo = async (videoURL: string) => {
  const videoData = await youtube.getVideoData(videoURL);

  if (videoData) {
    const response = await openAi.createResponse({
      input: extractRecipeFromVideo(
        videoData.description,
        videoData.transcript
      ),
    });
    console.log(response);
  }
};

export default {
  createNewFromYoutubeVideo,
};

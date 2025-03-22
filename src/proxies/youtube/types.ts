export type VideoData = {
  title: string;
  description: string;
  video_url: string;
  videoId: string;
  publishDate: string;
  author: {
    name: string;
    user: string;
    channel_url: string;
  };
  transcript: string;
};

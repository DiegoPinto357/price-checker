import { YoutubeTranscript } from 'youtube-transcript';
// @ts-expect-error - ytdl-core has incorrect type definitions
import ytdl from 'ytdl-core';

const extractVideoId = (url: string): string | null => {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:shorts\/|(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;

  const match = url.match(regex);
  return match ? match[1] : null;
};

type TranscriptItem = {
  text: string;
};

const parseTranscript = (transcript: TranscriptItem[]): string =>
  transcript.map(({ text }) => text).join(' ');

export const getVideoData = async (url: string) => {
  const videoId = extractVideoId(url);

  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const info = await ytdl.getInfo(videoId);
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  return {
    info: info.videoDetails,
    transcript: parseTranscript(transcript),
  };
};

export default {
  getVideoData,
};

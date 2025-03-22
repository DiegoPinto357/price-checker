/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const ytdl = require('ytdl-core');
const { YoutubeTranscript } = require('youtube-transcript');

const extractVideoId = url => {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const parseTranscript = transcript =>
  transcript.map(({ text }) => text).join(' ');

const getVideoData = async url => {
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

module.exports = {
  getVideoData,
};

import { Dropbox } from 'dropbox';

const dropbox = new Dropbox({
  clientId: import.meta.env.VITE_DROPBOX_APP_KEY,
  clientSecret: import.meta.env.VITE_DROPBOX_APP_SECRET,
  refreshToken: import.meta.env.VITE_DROPBOX_REFRESH_TOKEN,
});

const readDir = async (path: string) => {
  const response = await dropbox.filesListFolder({ path });
  return response.result;
};

const readFile = async (path: string) => {
  const { result } = await dropbox.filesGetTemporaryLink({ path });
  const response = await fetch(result.link);
  const reader = response.body?.getReader();
  const data = await reader?.read();
  const decoder = new TextDecoder();
  return decoder.decode(data?.value);
};

export default {
  readDir,
  readFile,
};

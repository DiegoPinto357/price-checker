import { useQuery } from 'react-query';
import dropbox from '../../proxies/dropbox';

export const useGetRecipe = (path: string) =>
  useQuery(['recipe', path], async () => {
    return await dropbox.readFile(path);
  });

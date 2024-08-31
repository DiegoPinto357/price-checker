import { useQuery } from 'react-query';
import dropbox from '../../proxies/dropbox';

const RECIPES_DIR = '/Obsidian/Pessoal/Receitas';

export const useGetRecipesList = () =>
  useQuery(['recipes'], async () => {
    const { entries } = await dropbox.readDir(RECIPES_DIR);
    return entries.filter(entry => entry['.tag'] === 'file');
  });

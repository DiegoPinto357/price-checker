import { ScrollShadow } from '@nextui-org/react';
import Loader from '../lib/Loader';
import { useGetRecipesList } from './useGetRecipesList';
import RecipeCard from './RecipeCard';

import type { Recipe } from './types';

type Props = {
  onClick: (recipe: Recipe) => void;
};

const RecipesList = ({ onClick }: Props) => {
  const { data, isLoading } = useGetRecipesList();

  if (isLoading || !data) {
    return <Loader fullScreen={false} opaque />;
  }

  const recipes = data.map(file => ({
    id: file.id,
    name: file.name.split('.')[0],
    path: file.path_lower || '',
  }));

  const handleRecipeClick = (id: string) => {
    const recipe = recipes.find(recipe => recipe.id === id);
    if (recipe) {
      onClick(recipe);
    }
  };

  // TODO add filter button o toolbar
  return (
    <ScrollShadow
      data-testid="recipes"
      className="overflow-y-scroll h-full p-4"
    >
      {recipes.map(({ id, name }) => (
        <RecipeCard key={id} id={id} name={name} onClick={handleRecipeClick} />
      ))}
    </ScrollShadow>
  );
};

export default RecipesList;

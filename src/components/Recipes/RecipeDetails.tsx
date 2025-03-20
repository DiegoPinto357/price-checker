import { Button } from '@heroui/react';
import Loader from '../lib/Loader';
import { useGetRecipe } from './useGetRecipe';
import Typography from '../lib/Typography';

import type { Recipe } from './types';

type Props = {
  recipe: Recipe;
  onClose: () => void;
};

const RecipeDetails = ({ recipe, onClose }: Props) => {
  const { data, isLoading } = useGetRecipe(recipe.path);

  if (isLoading || !data) {
    return <Loader fullScreen={false} opaque />;
  }

  return (
    <div>
      <Button onPress={onClose}>Close</Button>
      <Typography variant="h1">{recipe.name}</Typography>
      {data}
    </div>
  );
};

export default RecipeDetails;

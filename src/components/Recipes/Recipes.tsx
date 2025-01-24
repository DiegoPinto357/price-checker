import { useState } from 'react';
import RecipesList from './RecipesList';
import RecipeDetails from './RecipeDetails';

import type { Recipe } from './types';

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    );
  }

  return <RecipesList onClick={setSelectedRecipe} />;
};

export default Recipes;

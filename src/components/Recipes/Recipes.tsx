import { useState } from 'react';
import ToolbarContainer from '../ToolbarContainer';
import ContentContainer from '../ContentContainer';
import RecipesList from './RecipesList';
import RecipeDetails from './RecipeDetails';

import type { Recipe } from './types';

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  return (
    <>
      <ToolbarContainer title="Receitas"></ToolbarContainer>

      <ContentContainer>
        {selectedRecipe ? (
          <RecipeDetails
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        ) : (
          <RecipesList onClick={setSelectedRecipe} />
        )}
      </ContentContainer>
    </>
  );
};

export default Recipes;

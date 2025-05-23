import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { Button } from '@nextui-org/react';
import Loader from '../lib/Loader';
import ToolbarContainer from '../ToolbarContainer';
import ContentContainer from '../ContentContainer';
import RecipesList from './RecipesList';
import RecipeDetails from './RecipeDetails';
import TextInputModal from '../lib/TextInputModal';
import recipes from '../../recipes';

import type { Recipe } from './types';

const Recipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isTextInputOpen, setIsTextInputOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddButtonPress = () => {
    setIsTextInputOpen(true);
  };

  const handleTextInputClose = async (value?: string) => {
    setIsTextInputOpen(false);
    if (value) {
      setIsLoading(true);
      const recipe = await recipes.createNewFromYoutubeVideo(value);
      console.log(recipe);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen={false} opaque />;
  }

  return (
    <>
      <ToolbarContainer title="Receitas">
        <Button
          variant="light"
          color="primary"
          size="sm"
          aria-label="add new recipe"
          isIconOnly
          onPress={handleAddButtonPress}
        >
          <LuPlus className="w-7 h-7" />
        </Button>
      </ToolbarContainer>

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

      {isTextInputOpen && (
        <TextInputModal
          isOpen={isTextInputOpen}
          title="Adicionar nova receita"
          inputLabel="URL do vídeo do YoutTube"
          onClose={handleTextInputClose}
        />
      )}
    </>
  );
};

export default Recipes;

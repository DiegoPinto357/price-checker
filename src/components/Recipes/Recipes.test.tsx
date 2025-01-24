import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Recipes from './Recipes';
import recipeListData from '../../../mockData/recipes/recipesList';

vi.mock('./useGetRecipesList', () => ({
  useGetRecipesList: () => ({
    data: recipeListData,
  }),
}));

vi.mock('./useGetRecipe', () => ({
  useGetRecipe: () => ({
    data: 'recipe content',
  }),
}));

describe('Recipes', () => {
  it('renders recipes list', () => {
    render(<Recipes />);
    recipeListData.forEach(recipe => {
      const recipeCardButton = screen.getByRole('button', {
        name: recipe.name.split('.')[0],
      });
      expect(recipeCardButton).toBeVisible();
    });
  });

  it('open recipe details when the card button is clicked', async () => {
    render(<Recipes />);

    const recipeName = recipeListData[0].name.split('.')[0];
    const recipeCardButton = screen.getByRole('button', {
      name: recipeName,
    });
    await userEvent.click(recipeCardButton);

    const detailsHeading = screen.getByRole('heading', {
      level: 1,
      name: recipeName,
    });
    const detailsContent = screen.getByText('recipe content');
    expect(detailsHeading).toBeVisible();
    expect(detailsContent).toBeVisible();
  });
});

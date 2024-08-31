import { useGetRecipesList } from './useGetRecipesList';

const Recipes = () => {
  const { data } = useGetRecipesList();

  if (!data) {
    return null;
  }

  const recipes = data.map(file => file.name.split('.')[0]);

  return (
    <div data-testid="recipes">
      <ul>
        {recipes.map(recipe => (
          <li key={recipe}>{recipe}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;

import Loader from '../lib/Loader';
import { useGetRecipesList } from './useGetRecipesList';
import RecipeCard from './RecipeCard';

const Recipes = () => {
  const { data } = useGetRecipesList();

  if (!data) {
    return <Loader fullScreen={false} opaque />;
  }

  const recipes = data.map(file => ({
    id: file.id,
    name: file.name.split('.')[0],
  }));

  // TODO add filter button o toolbar
  return (
    <div data-testid="recipes" className="overflow-y-scroll h-full p-4">
      {recipes.map(({ id, name }) => (
        <RecipeCard key={id} id={id} name={name} onClick={console.log} />
      ))}
    </div>
  );
};

export default Recipes;

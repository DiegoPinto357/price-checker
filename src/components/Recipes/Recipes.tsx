import { useEffect, useState } from 'react';
import dropbox from '../../proxies/dropbox';

const Recipes = () => {
  const [recipes, setRecipes] = useState<string[]>([]);

  // TODO create custom hook/ use react query
  useEffect(() => {
    const fetchRecipes = async () => {
      const { entries } = await dropbox.readDir('/Obsidian/Pessoal/Receitas');
      setRecipes(
        entries.filter(entry => entry['.tag'] === 'file').map(file => file.name)
      );
    };

    fetchRecipes();
  }, []);

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

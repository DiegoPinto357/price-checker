import { storage } from './proxies';

import type { MealsRecord } from './components/Context/MealsPlannerContext';

export const loadMeals = async (dates: { month: number; year: number }[]) => {
  const filenames = dates.map(
    ({ month, year }) =>
      `/meals/${year}-${month.toString().padStart(2, '0')}.json`
  );

  return await Promise.all(
    filenames.map(filename => {
      try {
        return storage.readFile<MealsRecord>(filename);
      } catch (e) {
        /* empty */
      }
    })
  );
};

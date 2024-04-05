import { storage } from './proxies';
import { splitDate } from './libs/date';

import type { MealsRecord } from './components/Context/MealsPlannerContext';

const formatFilename = (year: number, month: number) =>
  `/meals/${year}-${month.toString().padStart(2, '0')}.json`;

export const loadMeals = async (dates: { month: number; year: number }[]) => {
  const filenames = dates.map(({ month, year }) => formatFilename(year, month));

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

export const saveMeals = async (meals: MealsRecord) => {
  const dateKey = Object.keys(meals)[0];
  const { year, month } = splitDate(dateKey);
  const filename = formatFilename(year, month);
  return await storage.writeFile(filename, meals);
};

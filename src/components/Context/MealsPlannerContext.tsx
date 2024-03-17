import { createContext, useState, useCallback } from 'react';

import type { PropsWithChildren } from 'react';
import type { ItemEdit } from '../lib/EditModal';
import type { MealItemData } from '../MealsPlanner/types';

type MealsRecord = Record<string, MealItemData[]>;

type MealsPlannerContextType = {
  meals: MealsRecord;
  addMeal: (date: string, newMeal: MealItemData) => void;
  updateMeal: (date: string, mealEdit: ItemEdit) => void;
};

export const MealsPlannerContext = createContext<MealsPlannerContextType>(
  {} as MealsPlannerContextType
);

export const MealsPlannerContextProvider = ({
  children,
}: PropsWithChildren) => {
  const [items, setItems] = useState<MealsRecord>({});

  const addMeal = useCallback(async (date: string, newMeal: MealItemData) => {
    setItems(currentMeals => {
      const newDay = currentMeals[date]
        ? [...currentMeals[date], newMeal]
        : [newMeal];
      return { ...currentMeals, [date]: newDay };
    });
  }, []);

  const updateMeal = useCallback(
    (date: string, mealEdit: ItemEdit) => {
      const { name, newName, deleted } = mealEdit;

      const dateMeals = items[date];
      const meal = dateMeals.find(item => item.label === name);
      if (meal) {
        if (newName !== undefined) meal.label = newName;
        if (deleted !== undefined) {
          setItems({
            [date]: dateMeals.filter(item => item.label !== name),
          });
          return;
        }
      }
      setItems(items);
    },
    [items, setItems]
  );

  return (
    <MealsPlannerContext.Provider value={{ meals: items, addMeal, updateMeal }}>
      {children}
    </MealsPlannerContext.Provider>
  );
};

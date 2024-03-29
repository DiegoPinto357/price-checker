import { createContext, useState, useCallback } from 'react';
import { loadMeals as loadMealsFromFile } from '../../mealsPlanner';

import type { PropsWithChildren } from 'react';
import type { ItemEdit } from '../lib/EditModal';
import type { MealItemData } from '../MealsPlanner/types';

export type MealsRecord = Record<string, MealItemData[]>;

type MealsPlannerContextType = {
  meals: MealsRecord;
  loadMeals: (dates: { month: number; year: number }[]) => void;
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

  const addMealsToDate = (
    date: string,
    meals: MealItemData[],
    clear?: boolean
  ) => {
    setItems(currentMeals => {
      const updatedDay =
        currentMeals[date] && !clear
          ? [...currentMeals[date], ...meals]
          : meals;
      return { ...currentMeals, [date]: updatedDay };
    });
  };

  const loadMeals = useCallback(
    async (dates: { month: number; year: number }[]) => {
      const date = await loadMealsFromFile(dates);
      date.forEach(dateItem => {
        if (!dateItem) return;
        const mealEntries = Object.entries(dateItem);
        mealEntries.forEach(([date, meals]) => {
          addMealsToDate(date, meals, true);
        });
      });
    },
    []
  );

  const addMeal = async (date: string, newMeal: MealItemData) => {
    setItems(currentMeals => {
      const updatedDay = currentMeals[date]
        ? [...currentMeals[date], newMeal]
        : [newMeal];
      return { ...currentMeals, [date]: updatedDay };
    });
  };

  const updateMeal = (date: string, mealEdit: ItemEdit) => {
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
  };

  return (
    <MealsPlannerContext.Provider
      value={{ meals: items, loadMeals, addMeal, updateMeal }}
    >
      {children}
    </MealsPlannerContext.Provider>
  );
};

import { createContext, useState, useCallback } from 'react';
import {
  loadMeals as loadMealsFromFile,
  saveMeals as saveMealsToFile,
} from '../../mealsPlanner';
import { splitDate } from '../../libs/date';

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

const filterMealsByMonth = (meals: MealsRecord, month: number) =>
  Object.keys(meals).reduce((result, key) => {
    if (parseInt(key.split('-')[1]) === month) {
      result[key] = meals[key];
    }
    return result;
  }, {} as MealsRecord);

const saveMonthFile = async (items: MealsRecord, month: number) => {
  const monthItems = filterMealsByMonth(items, month);
  return await saveMealsToFile(monthItems);
};

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
      const newItems = { ...currentMeals, [date]: updatedDay };

      const { month } = splitDate(date);
      saveMonthFile(newItems, month);

      return newItems;
    });
  };

  const updateMeal = (date: string, mealEdit: ItemEdit) => {
    const { name, newName, deleted } = mealEdit;

    const { month } = splitDate(date);

    const dateMeals = items[date];
    const meal = dateMeals.find(item => item.label === name);
    if (meal) {
      if (newName !== undefined) meal.label = newName;
      if (deleted !== undefined) {
        const newItems = {
          ...items,
          [date]: dateMeals.filter(item => item.label !== name),
        };
        saveMonthFile(newItems, month);
        setItems(newItems);
        return;
      }
    }

    saveMonthFile(items, month);
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

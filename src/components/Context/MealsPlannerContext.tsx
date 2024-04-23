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
  moveMeal: (
    name: string,
    originDate: string,
    destinyDate: string,
    index?: number
  ) => void;
  sortMeal: (date: string, name: string, newIndex: number) => void;
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
    setItems(currentMeals => {
      const { name, newName, deleted } = mealEdit;

      const { month } = splitDate(date);

      const dateMeals = currentMeals[date];
      const meal = dateMeals.find(item => item.label === name);
      if (meal) {
        if (newName !== undefined) meal.label = newName;
        if (deleted !== undefined) {
          const newItems = {
            ...currentMeals,
            [date]: dateMeals.filter(item => item.label !== name),
          };

          saveMonthFile(newItems, month);
          return newItems;
        }
      }

      saveMonthFile(currentMeals, month);
      return items; //FIXME create new object to update the state
    });
  };

  const moveMeal = (
    name: string,
    originDate: string,
    destinyDate: string,
    index?: number
  ) => {
    setItems(currentMeals => {
      const originDay = currentMeals[originDate];
      const meal = originDay.find(item => item.label === name);

      if (!meal) return currentMeals;

      const destinyDay = currentMeals[destinyDate]
        ? [...currentMeals[destinyDate], meal]
        : [meal];

      if (typeof index === 'number') {
        const mealIndex = destinyDay.length - 1;
        destinyDay.splice(mealIndex, 1);
        destinyDay.splice(index, 0, meal);
      }

      const newItems = {
        ...currentMeals,
        [originDate]: originDay.filter(item => item.label !== name),
        [destinyDate]: destinyDay,
      };

      const { month: originMonth } = splitDate(originDate);
      const { month: destinyMonth } = splitDate(destinyDate);

      if (originMonth === destinyMonth) {
        saveMonthFile(newItems, originMonth);
      } else {
        saveMonthFile(newItems, originMonth);
        saveMonthFile(newItems, destinyMonth);
      }

      return newItems;
    });
  };

  const sortMeal = (date: string, name: string, newIndex: number) => {
    setItems(currentMeals => {
      const dateMeals = currentMeals[date];
      const meal = dateMeals.find(item => item.label === name);

      if (meal) {
        const mealIndex = dateMeals.indexOf(meal);
        dateMeals.splice(mealIndex, 1);
        dateMeals.splice(newIndex, 0, meal);
      }

      const { month } = splitDate(date);
      const newItems = {
        ...currentMeals,
        [date]: dateMeals,
      };

      saveMonthFile(newItems, month);

      return newItems;
    });
  };

  return (
    <MealsPlannerContext.Provider
      value={{
        meals: items,
        loadMeals,
        addMeal,
        updateMeal,
        moveMeal,
        sortMeal,
      }}
    >
      {children}
    </MealsPlannerContext.Provider>
  );
};

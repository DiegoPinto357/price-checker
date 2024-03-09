import { useState, useCallback } from 'react';
import EditModal from '../lib/EditModal';
import AddMealModal from './AddMealModal';
import DayContainer from './DayContainer';

import type { ItemEdit } from '../lib/EditModal';
import type { MealItemData } from './MealItem';

export type DayContainerData = { date: string; label: string };

type Props = {
  days: DayContainerData[];
};

const PlannerDayList = ({ days }: Props) => {
  const [meals, setMeals] = useState<Record<string, MealItemData[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [addMealModalOpen, setAddMealModalOpen] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [editMealDialogOpen, setEditMealDialogOpen] = useState<boolean>(false);

  const handleAddButtonClick = useCallback((date: string) => {
    setSelectedDate(date);
    setAddMealModalOpen(true);
  }, []);

  const handleMealClick = useCallback((date: string, mealName: string) => {
    setSelectedDate(date);
    setSelectedMeal(mealName);
    setEditMealDialogOpen(true);
  }, []);

  const addMeal = useCallback((date: string, name: string) => {
    setMeals(currentMeals => {
      const newMeal = { label: name };
      const newDay = currentMeals[date]
        ? [...currentMeals[date], newMeal]
        : [newMeal];
      return { ...currentMeals, [date]: newDay };
    });
  }, []);

  const handleAddMealModalCLose = useCallback(
    (mealName?: string) => {
      if (mealName) {
        addMeal(selectedDate, mealName);
      }
      setAddMealModalOpen(false);
    },
    [addMeal, selectedDate]
  );

  const handleEditMealDialogClose = useCallback(
    (mealEdit?: ItemEdit) => {
      setEditMealDialogOpen(false);
      if (!mealEdit) return;

      const { name, newName } = mealEdit;

      const meal = meals[selectedDate].find(item => item.label === name);
      if (meal) {
        if (newName !== undefined) meal.label = newName;
        // if (deleted !== undefined) {
        //   setItems(items.filter(item => item.name !== name));
        //   return;
        // }
      }
      setMeals(meals);
    },

    [selectedDate, meals, setMeals]
  );

  return (
    <>
      {days.map(({ date, label }) => (
        <DayContainer
          key={date}
          date={date}
          label={label}
          items={meals[date]}
          onAddButtonClick={() => handleAddButtonClick(date)}
          onMealClick={mealName => handleMealClick(date, mealName)}
        />
      ))}

      {addMealModalOpen && (
        <AddMealModal
          isOpen={addMealModalOpen}
          onClose={handleAddMealModalCLose}
        />
      )}

      {editMealDialogOpen && (
        <EditModal
          isOpen={editMealDialogOpen}
          itemName={selectedMeal}
          onClose={handleEditMealDialogClose}
        />
      )}
    </>
  );
};

export default PlannerDayList;

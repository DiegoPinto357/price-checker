import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import { formatDateToYYYYMMDD, isToday } from '../../libs/date';
import EditModal from '../lib/EditModal';
import AddMealModal from './AddMealModal';
import DayContainer from './DayContainer';
import { MealsPlannerContext } from '../Context';

import type { ItemEdit } from '../lib/EditModal';

export type DayContainerData = { date: string; label: string };

type Props = {
  days: DayContainerData[];
};

const PlannerDayList = ({ days }: Props) => {
  const { meals, addMeal, updateMeal } = useContext(MealsPlannerContext);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [addMealModalOpen, setAddMealModalOpen] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [editMealDialogOpen, setEditMealDialogOpen] = useState<boolean>(false);

  const todayElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (todayElement.current && todayElement.current.scrollIntoView) {
      todayElement.current.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
    }
  }, []);

  const handleAddButtonClick = useCallback((date: string) => {
    setSelectedDate(date);
    setAddMealModalOpen(true);
  }, []);

  const handleMealClick = useCallback((date: string, mealName: string) => {
    setSelectedDate(date);
    setSelectedMeal(mealName);
    setEditMealDialogOpen(true);
  }, []);

  const handleAddMealModalClose = useCallback(
    (mealName?: string) => {
      if (mealName) {
        addMeal(selectedDate, { label: mealName });
      }
      setAddMealModalOpen(false);
    },
    [addMeal, selectedDate]
  );

  const handleEditMealDialogClose = useCallback(
    (mealEdit?: ItemEdit) => {
      setEditMealDialogOpen(false);
      if (!mealEdit) return;
      updateMeal(selectedDate, mealEdit);
    },

    [selectedDate, updateMeal]
  );

  const today = formatDateToYYYYMMDD(new Date());

  return (
    <>
      {days.map(({ date, label }) => (
        <DayContainer
          ref={isToday(date) ? todayElement : null}
          key={date}
          date={date}
          label={label}
          items={meals[date]}
          today={today}
          onAddButtonClick={() => handleAddButtonClick(date)}
          onMealClick={mealName => handleMealClick(date, mealName)}
        />
      ))}

      {addMealModalOpen && (
        <AddMealModal
          isOpen={addMealModalOpen}
          onClose={handleAddMealModalClose}
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

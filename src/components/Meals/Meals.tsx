import { useState, useRef, useCallback } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import Observer from '../lib/Observer';
import Typography from '../lib/Typography';
import DayContainer from './DayContainer';
import AddMealModal from './AddMealModal';

import type { MealItemData } from './MealItem';

const ITEMS_TO_ADD = 10;
const MAX_NUM_OF_ITEMS = 30;

// TODO move to some util lib
const toCapitalCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const generateDays = (startDate: Date, numOfDays: number) => {
  return new Array(numOfDays).fill(null).map((_item, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    // TODO add year if not current year
    return {
      date: date.toDateString(),
      label: toCapitalCase(
        date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      ),
    };
  });
};

const Meals = () => {
  const [days, setDays] = useState<{ date: string; label: string }[]>(
    generateDays(new Date(), 10)
  );
  const [meals, setMeals] = useState<Record<string, MealItemData[]>>({});
  const [addMealModalOpen, setAddMealModalOpen] = useState<boolean>(false);
  const [dateToAdd, setDateToAdd] = useState<string>('');

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addDaysOnTop = useCallback(() => {
    setDays(currentDays => {
      const firstDate = new Date(currentDays[0].date);
      console.log({ firstDate });
      firstDate.setDate(firstDate.getDate() - ITEMS_TO_ADD);

      if (currentDays.length + ITEMS_TO_ADD > MAX_NUM_OF_ITEMS) {
        currentDays.splice(-ITEMS_TO_ADD, ITEMS_TO_ADD);
      }

      return [...generateDays(firstDate, ITEMS_TO_ADD), ...currentDays];
    });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 1;
    }
  }, []);

  const addDaysOnBottom = useCallback(() => {
    setDays(currentDays => {
      const lastDate = new Date(currentDays[currentDays.length - 1].date);
      lastDate.setDate(lastDate.getDate() + 1);

      if (currentDays.length + ITEMS_TO_ADD > MAX_NUM_OF_ITEMS) {
        currentDays.splice(0, ITEMS_TO_ADD);
      }

      return [...currentDays, ...generateDays(lastDate, ITEMS_TO_ADD)];
    });
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

  const handleAddButtonClick = useCallback((date: string) => {
    setDateToAdd(date);
    setAddMealModalOpen(true);
  }, []);

  const handleAddMealModalCLose = useCallback(
    (mealName?: string) => {
      if (mealName) {
        addMeal(dateToAdd, mealName);
      }
      setAddMealModalOpen(false);
    },
    [addMeal, dateToAdd]
  );

  return (
    <div data-testid="meals" className="flex flex-col justify-between h-full">
      <Typography className="mx-4" variant="h1">
        Refeições
      </Typography>
      <ScrollShadow
        className="overflow-y-scroll overflow-x-visible"
        ref={scrollRef}
      >
        <Observer
          onIntersection={() => {
            addDaysOnTop();
          }}
        />
        {days.map(({ date, label }) => (
          <DayContainer
            key={date}
            date={date}
            label={label}
            items={meals[date]}
            onAddButtonClick={() => handleAddButtonClick(date)}
          />
        ))}
        <Observer
          onIntersection={() => {
            addDaysOnBottom();
          }}
        />
      </ScrollShadow>

      {addMealModalOpen && (
        <AddMealModal
          isOpen={addMealModalOpen}
          onClose={handleAddMealModalCLose}
        />
      )}
    </div>
  );
};

export default Meals;

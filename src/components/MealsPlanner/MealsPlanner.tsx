import { useState, useRef, useCallback } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import Observer from '../lib/Observer';
import Typography from '../lib/Typography';

import type { DayContainerData } from './PlannerDayList';
import PlannerDayList from './PlannerDayList';

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

const MealsPlanner = () => {
  const [days, setDays] = useState<DayContainerData[]>(
    generateDays(new Date(), 10)
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addDaysOnTop = useCallback(() => {
    setDays(currentDays => {
      const firstDate = new Date(currentDays[0].date);
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

  return (
    <div
      data-testid="meals-planner"
      className="flex flex-col justify-between h-full"
    >
      <Typography className="mx-4" variant="h1">
        Planejamento
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
        <PlannerDayList days={days} />
        <Observer
          onIntersection={() => {
            addDaysOnBottom();
          }}
        />
      </ScrollShadow>
    </div>
  );
};

export default MealsPlanner;

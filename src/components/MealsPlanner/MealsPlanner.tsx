import { useState, useRef, useCallback } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import Observer from '../lib/Observer';
import Typography from '../lib/Typography';

import type { DayContainerData } from './PlannerDayList';
import PlannerDayList from './PlannerDayList';

const MAX_NUM_OF_MONTHS = 3;

// TODO move to some util lib
const toCapitalCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const generateDaysOfMonth = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const startDate = new Date(year, month - 1, 1);
  const numOfDays = new Date(year, month, 0).getDate();

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
          year:
            new Date().getFullYear() === date.getFullYear()
              ? undefined
              : 'numeric',
        })
      ),
    };
  });
};

// TODO move to some date utils file
const getYearAndMonth = (relativeMonthIndex = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() + relativeMonthIndex);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return { month, year };
};

const MealsPlanner = () => {
  const [days, setDays] = useState<DayContainerData[]>([
    ...generateDaysOfMonth(getYearAndMonth(-1)),
    ...generateDaysOfMonth(getYearAndMonth(0)),
    ...generateDaysOfMonth(getYearAndMonth(1)),
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addDaysOnTop = useCallback(() => {
    setDays(currentDays => {
      const firstDate = new Date(currentDays[0].date);
      firstDate.setMonth(firstDate.getMonth() - 1);
      const month = firstDate.getMonth() + 1;
      const year = firstDate.getFullYear();
      const monthToRemove = (month + MAX_NUM_OF_MONTHS) % 12;
      return [
        ...generateDaysOfMonth({ month, year }),
        ...currentDays.filter(day => {
          const date = new Date(day.date);
          const month = date.getMonth() + 1;
          return month < monthToRemove;
        }),
      ];
    });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 1;
    }
  }, []);

  const addDaysOnBottom = useCallback(() => {
    setDays(currentDays => {
      const lastDate = new Date(currentDays[currentDays.length - 1].date);
      lastDate.setDate(lastDate.getDate() - 5); // prevent resulting the worng month below
      lastDate.setMonth(lastDate.getMonth() + 1);
      const month = lastDate.getMonth() + 1;
      const year = lastDate.getFullYear();
      const monthToRemoveMod = (month - MAX_NUM_OF_MONTHS) % 12;
      const monthToRemove =
        monthToRemoveMod <= 0 ? monthToRemoveMod + 12 : monthToRemoveMod;
      return [
        ...currentDays.filter(day => {
          const date = new Date(day.date);
          const month = date.getMonth() + 1;
          return month > monthToRemove;
        }),
        ...generateDaysOfMonth({ month, year }),
      ];
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

import { useState, useRef, useCallback } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import {
  formatDateToLocaleString,
  getRelativeMonthAndYear,
  addMonths,
} from '../../libs/date';
import { toCapitalCase } from '../../libs/string';
import Observer from '../lib/Observer';
import Typography from '../lib/Typography';

import type { DayContainerData } from './PlannerDayList';
import PlannerDayList from './PlannerDayList';

const MAX_NUM_OF_MONTHS = 3;

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
    return {
      date: date.toDateString(),
      label: toCapitalCase(formatDateToLocaleString(date)),
    };
  });
};

const filterDaysByMonth = (days: DayContainerData[], monthToRemove: number) =>
  days.filter(day => {
    const date = new Date(day.date);
    const month = date.getMonth() + 1;
    return month !== monthToRemove;
  });

const MealsPlanner = () => {
  const [days, setDays] = useState<DayContainerData[]>([
    ...generateDaysOfMonth(getRelativeMonthAndYear({ relativeMonthIndex: -1 })),
    ...generateDaysOfMonth(getRelativeMonthAndYear()),
    ...generateDaysOfMonth(getRelativeMonthAndYear({ relativeMonthIndex: 1 })),
  ]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addDaysOnTop = useCallback(() => {
    setDays(currentDays => {
      const firstDate = new Date(currentDays[0].date);
      const { month, year } = getRelativeMonthAndYear({
        date: firstDate,
        relativeMonthIndex: -1,
      });
      const monthToRemove = addMonths(month, MAX_NUM_OF_MONTHS);
      return [
        ...generateDaysOfMonth({ month, year }),
        ...filterDaysByMonth(currentDays, monthToRemove),
      ];
    });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 100;
    }
  }, []);

  const addDaysOnBottom = useCallback(() => {
    setDays(currentDays => {
      const lastDate = new Date(currentDays[currentDays.length - 1].date);
      const { month, year } = getRelativeMonthAndYear({
        date: lastDate,
        relativeMonthIndex: 1,
      });
      const monthToRemove = addMonths(month, -MAX_NUM_OF_MONTHS);
      return [
        ...filterDaysByMonth(currentDays, monthToRemove),
        ...generateDaysOfMonth({ month, year }),
      ];
    });
  }, []);

  return (
    <div className="flex flex-col justify-between h-full">
      <Typography className="mx-4" variant="h1">
        Planejamento
      </Typography>
      <ScrollShadow
        data-testid="scroll-container"
        className="overflow-y-scroll overflow-x-visible"
        ref={scrollRef}
      >
        <Observer
          data-testid="observer-top"
          onIntersection={() => {
            addDaysOnTop();
          }}
        />
        <PlannerDayList days={days} />
        <Observer
          data-testid="observer-bottom"
          onIntersection={() => {
            addDaysOnBottom();
          }}
        />
      </ScrollShadow>
    </div>
  );
};

export default MealsPlanner;

import {
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { ScrollShadow } from '@nextui-org/react';
import {
  formatDateToYYYYMMDD,
  formatDateToLocaleString,
  getRelativeMonthAndYear,
  addMonths,
} from '../../libs/date';
import { toCapitalCase } from '../../libs/string';
import Observer from '../lib/Observer';
import { MealsPlannerContext } from '../Context';
import PlannerDayList from './PlannerDayList';

import type { DayContainerData } from './PlannerDayList';

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
      date: formatDateToYYYYMMDD(date),
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
  const initialDateRange = useMemo(
    () => [
      getRelativeMonthAndYear({ relativeMonthIndex: -1 }),
      getRelativeMonthAndYear(),
      getRelativeMonthAndYear({ relativeMonthIndex: 1 }),
    ],
    []
  );

  const [days, setDays] = useState<DayContainerData[]>([
    ...generateDaysOfMonth(initialDateRange[0]),
    ...generateDaysOfMonth(initialDateRange[1]),
    ...generateDaysOfMonth(initialDateRange[2]),
  ]);

  const { loadMeals } = useContext(MealsPlannerContext);

  useEffect(() => {
    loadMeals(initialDateRange);
  }, [initialDateRange, loadMeals]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addDaysOnTop = useCallback(() => {
    setDays(currentDays => {
      const firstDate = new Date(currentDays[0].date);
      const { month, year } = getRelativeMonthAndYear({
        date: firstDate,
        relativeMonthIndex: -1,
      });
      const monthToRemove = addMonths(month, MAX_NUM_OF_MONTHS);
      // TODO remove month from context
      loadMeals([{ month, year }]);
      return [
        ...generateDaysOfMonth({ month, year }),
        ...filterDaysByMonth(currentDays, monthToRemove),
      ];
    });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 100;
    }
  }, [loadMeals]);

  const addDaysOnBottom = useCallback(() => {
    setDays(currentDays => {
      const lastDate = new Date(currentDays[currentDays.length - 1].date);
      const { month, year } = getRelativeMonthAndYear({
        date: lastDate,
        relativeMonthIndex: 1,
      });
      const monthToRemove = addMonths(month, -MAX_NUM_OF_MONTHS);
      // TODO remove month from context
      loadMeals([{ month, year }]);
      return [
        ...filterDaysByMonth(currentDays, monthToRemove),
        ...generateDaysOfMonth({ month, year }),
      ];
    });
  }, [loadMeals]);

  return (
    <ScrollShadow
      data-testid="meals-planner"
      id="meals-planner"
      className="overflow-y-scroll overflow-x-visible"
      ref={scrollRef}
    >
      <Observer data-testid="observer-top" onIntersection={addDaysOnTop} />
      <PlannerDayList days={days} />
      <Observer
        data-testid="observer-bottom"
        onIntersection={addDaysOnBottom}
      />
    </ScrollShadow>
  );
};

export default MealsPlanner;

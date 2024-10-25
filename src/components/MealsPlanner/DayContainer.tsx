import { forwardRef, useContext } from 'react';
import { Card, CardHeader, CardBody, Chip, Button } from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';
import { v4 as uuid } from 'uuid';
import useMergedRef from '@react-hook/merged-ref';
import { useDrop } from '../lib/dragAndDrop';
import Typography from '../lib/Typography';
import MealItem from './MealItem';
import { MealsPlannerContext } from '../Context';

import type { MealItemData } from './types';

type DragData = MealItemData & { date: string };

type Props = {
  date: string;
  label: string;
  items: MealItemData[];
  today: string;
  onAddButtonClick: () => void;
  onMealClick: (name: string) => void;
};

const DayContainer = forwardRef<HTMLDivElement, Props>(
  ({ date, label, items, today, onAddButtonClick, onMealClick }, ref) => {
    const { moveMeal, sortMeal } = useContext(MealsPlannerContext);

    const headerId = `day-container-title-${date}`;

    const { dropRef } = useDrop({
      id: date,
      onDrop: ({
        dragData,
        sortData,
      }: {
        dragData: DragData;
        sortData: { index: number };
      }) => {
        if (date === dragData.date) {
          if (sortData) {
            sortMeal(date, dragData.label, sortData.index);
            return true;
          }
          return false;
        }

        moveMeal(dragData.label, dragData.date, date, sortData?.index);
        return true;
      },
    });

    const mergedRef = useMergedRef(ref, dropRef);

    return (
      <Card
        data-testid={date}
        ref={mergedRef}
        className="border-1 rounded-none overflow-visible"
        shadow="none"
        role="group"
        aria-labelledby={headerId}
      >
        <CardHeader className="rounded-none bg-gray-100 px-4 py-2">
          <div className="flex justify-between items-center w-full">
            <Typography id={headerId} variant="h4" className="font-medium m-0">
              {label}
              {date === today ? (
                <Chip color="primary" size="sm" variant="flat" className="ml-2">
                  Hoje
                </Chip>
              ) : null}
            </Typography>
            <Button
              aria-label="add"
              variant="light"
              size="sm"
              isIconOnly
              onClick={onAddButtonClick}
            >
              <LuPlus className="w-6 h-6 text-gray-600" />
            </Button>
          </div>
        </CardHeader>
        {items && items.length ? (
          <CardBody className="flex flex-col gap-3 overflow-visible px-4">
            {items.map(item => (
              <MealItem
                key={uuid()}
                date={date}
                {...item}
                onClick={() => onMealClick(item.label)}
              />
            ))}
          </CardBody>
        ) : null}
      </Card>
    );
  }
);

export default DayContainer;

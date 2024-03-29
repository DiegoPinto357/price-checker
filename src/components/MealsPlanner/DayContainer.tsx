import { forwardRef } from 'react';
import { Card, CardHeader, CardBody, Button } from '@nextui-org/react';
import { LuPlus } from 'react-icons/lu';
import { v4 as uuid } from 'uuid';
import Typography from '../lib/Typography';
import MealItem from './MealItem';

import type { MealItemData } from './types';

type Props = {
  date: string;
  label: string;
  items: MealItemData[];
  onAddButtonClick: () => void;
  onMealClick: (name: string) => void;
};

const DayContainer = forwardRef<HTMLDivElement, Props>(
  ({ date, label, items, onAddButtonClick, onMealClick }, ref) => {
    const headerId = `day-container-title-${date}`;

    return (
      <Card
        data-testid={date}
        ref={ref}
        className="border-1 rounded-none"
        shadow="none"
        role="group"
        aria-labelledby={headerId}
      >
        <CardHeader className="rounded-none bg-gray-100 py-2">
          <div className="flex justify-between items-center w-full">
            <Typography id={headerId} variant="h4" className="font-medium m-0">
              {label}
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
        {items ? (
          <CardBody className="flex gap-3">
            {items.map(item => (
              <MealItem
                key={uuid()}
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

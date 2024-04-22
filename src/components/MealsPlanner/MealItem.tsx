import { Card, CardHeader } from '@nextui-org/react';
import { RiDraggable } from 'react-icons/ri';
import { useDrag } from '../lib/dragAndDrop';

import type { MealItemData } from './types';

type Props = MealItemData & {
  date: string;
  onClick: () => void;
};

const MealItem = ({ label, date, onClick }: Props) => {
  const { dragRef, dragHandleRef, isDragging } = useDrag({
    direction: 'y',
    scrollContainerId: 'scroll-container',
    data: { date, label },
  });

  return (
    <Card
      ref={dragRef}
      className="bg-gray-50 text-start"
      isPressable
      onPress={() => {
        if (!isDragging) onClick();
      }}
    >
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 ml-1 rounded-full bg-secondary" />
            {label}
          </div>
          <div ref={dragHandleRef}>
            <RiDraggable className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </CardHeader>
      {/* <CardBody></CardBody> */}
    </Card>
  );
};

export default MealItem;

import { Card, CardHeader } from '@nextui-org/react';
import { useDrag } from '../lib/dragAndDrop';

import type { MealItemData } from './types';

type Props = MealItemData & {
  date: string;
  onClick: () => void;
};

const MealItem = ({ label, date, onClick }: Props) => {
  const { dragRef, isDragging } = useDrag({
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
      <CardHeader>{label}</CardHeader>
      {/* <CardBody></CardBody> */}
    </Card>
  );
};

export default MealItem;

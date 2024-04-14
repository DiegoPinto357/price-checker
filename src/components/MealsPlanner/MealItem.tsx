import { Card, CardHeader } from '@nextui-org/react';
import useDragAndDrop from './useDragAndDrop';

import type { MealItemData } from './types';

type Props = MealItemData & {
  onClick: () => void;
};

const MealItem = ({ label, onClick }: Props) => {
  const { dragRef, isDragging } = useDragAndDrop({
    scrollContainerId: 'scroll-container',
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

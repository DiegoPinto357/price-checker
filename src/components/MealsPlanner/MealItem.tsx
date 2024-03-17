import { Card, CardHeader } from '@nextui-org/react';

import type { MealItemData } from './types';

type Props = MealItemData & {
  onClick: () => void;
};

const MealItem = ({ label, onClick }: Props) => {
  return (
    <Card className="bg-gray-50" isPressable onPress={onClick}>
      <CardHeader>{label}</CardHeader>
      {/* <CardBody></CardBody> */}
    </Card>
  );
};

export default MealItem;

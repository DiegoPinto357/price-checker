import { Card, CardHeader } from '@nextui-org/react';

export type MealItemData = {
  label: string;
};

type Props = MealItemData & {
  onClick: () => void;
};

const MealItem = ({ label, onClick }: Props) => {
  return (
    <Card isPressable onPress={onClick}>
      <CardHeader>{label}</CardHeader>
      {/* <CardBody></CardBody> */}
    </Card>
  );
};

export default MealItem;

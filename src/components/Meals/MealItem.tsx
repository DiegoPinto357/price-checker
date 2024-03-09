import { Card, CardHeader } from '@nextui-org/react';

export type MealItemData = {
  label: string;
};

type Props = MealItemData;

const MealItem = ({ label }: Props) => {
  return (
    <Card>
      <CardHeader>{label}</CardHeader>
      {/* <CardBody></CardBody> */}
    </Card>
  );
};

export default MealItem;

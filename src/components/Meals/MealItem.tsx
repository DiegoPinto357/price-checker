import { Card, CardHeader } from '@nextui-org/react';

// TODO move to types file
export type MealItemData = {
  label: string;
};

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

import { Card, CardHeader, CardBody, Chip } from '@heroui/react';

type Props = {
  id: string;
  name: string;
  onClick: (id: string) => void;
};

const RecipeCard = ({ id, name, onClick }: Props) => {
  // need to read file to get tags
  // create hook with local cache?
  const tags = ['sem-gluten', 'molho'];
  // const tags: string[] = [];

  const hasTags = false; // tags.length > 0;

  return (
    // use same style as day container?
    <Card
      className="w-full mb-2 bg-gray-50"
      isPressable
      onPress={() => onClick(id)}
    >
      <CardHeader className={hasTags ? 'pb-0' : ''}>{name}</CardHeader>
      {hasTags ? (
        <CardBody className="flex flex-row gap-1 pt-2">
          {tags.map(tag => (
            // use generator function to pick colors
            <Chip key={tag} size="sm" color="secondary" variant="flat">
              {tag}
            </Chip>
          ))}
        </CardBody>
      ) : null}
    </Card>
  );
};

export default RecipeCard;

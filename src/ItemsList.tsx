interface Item {
  description: string;
  value: number;
}

export interface ItemsListProps {
  items: Item[];
}

const ItemsList = ({ items }: ItemsListProps) => {
  return (
    <ul>
      {items.map(item => (
        <li>{`${item.description} - ${item.value}`}</li>
      ))}
    </ul>
  );
};

export default ItemsList;

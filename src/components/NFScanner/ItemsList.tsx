import { Product } from '../../types';

export interface ItemsListProps {
  products: Product[];
}

const ItemsList = ({ products }: ItemsListProps) => {
  return (
    <ul>
      {products.map(product => (
        <li
          key={product.code}
        >{`${product.description} - ${product.value}`}</li>
      ))}
    </ul>
  );
};

export default ItemsList;

import { Button } from '@heroui/react';
import ItemsList from './ItemsList';
import { Product } from '../../types';
export interface QrResultsProps {
  products: Product[];
  onSaveClick: (products: Product[]) => void;
  onCancelClick: () => void;
}

const QrResults = ({
  products,
  onSaveClick,
  onCancelClick,
}: QrResultsProps) => {
  const buttonStyle = 'grow w-full md:w-1/5';

  return (
    <div className="py-2 px-4">
      <ItemsList products={products} />
      <div className="flex flex-col md:flex-row py-4 gap-4">
        <Button
          className={buttonStyle}
          color="primary"
          onPress={() => onSaveClick(products)}
        >
          Salvar
        </Button>

        <Button className={buttonStyle} color="danger" onPress={onCancelClick}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default QrResults;

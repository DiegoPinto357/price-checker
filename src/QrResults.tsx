import { Grid, Button } from '@nextui-org/react';
import ItemsList from './ItemsList';
import { Product } from './types';

const fullWidthCss = { width: '100%' };

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
  return (
    <div>
      <ItemsList products={products} />
      <Grid.Container gap={1} justify="center">
        <Grid xs>
          <Button css={fullWidthCss} onPress={() => onSaveClick(products)}>
            Salvar
          </Button>
        </Grid>
        <Grid xs>
          <Button css={fullWidthCss} onPress={onCancelClick}>
            Cancelar
          </Button>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default QrResults;

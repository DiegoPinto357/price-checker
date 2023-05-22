import { Grid, Button } from '@nextui-org/react';
import ItemsList, { ItemsListProps } from './ItemsList';

const fullWidthCss = { width: '100%' };

export interface QrResultsProps {
  items: ItemsListProps['items'];
  onSaveClick: () => void;
  onCancelClick: () => void;
}

const QrResults = ({ items, onSaveClick, onCancelClick }: QrResultsProps) => {
  return (
    <div>
      <ItemsList items={items} />
      <Grid.Container gap={1} justify="center">
        <Grid xs>
          <Button css={fullWidthCss} onPress={onSaveClick}>
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

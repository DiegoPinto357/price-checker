import { useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import QrCodeReader from './QrCodeReader';
import ItemsList, { ItemsListProps } from './ItemsList';
import NodejsLoader from './NodejsLoader';
import core from './core';

const App = () => {
  const [renderQrCode, setRenderQrCode] = useState<boolean>(false);
  const [items, setItems] = useState<ItemsListProps['items']>([]);

  const onButtonClick = useCallback(async () => {
    setRenderQrCode(true);
  }, []);

  const onQrCodeReaderClose = useCallback(async (data?: string) => {
    setRenderQrCode(false);

    if (data) {
      const key = data.match(/\?p=([^&]*)/)![1];
      const nfData = await core.getNfData(key);
      setItems(nfData.items);
    }
  }, []);

  return (
    <NextUIProvider>
      {renderQrCode ? (
        <QrCodeReader onClose={onQrCodeReaderClose} />
      ) : (
        <Container sm>
          <NodejsLoader />
          <br />
          <Button onPress={onButtonClick}>Parse NF</Button>
          <br />
          <ItemsList items={items} />
        </Container>
      )}
    </NextUIProvider>
  );
};

export default App;

import { useEffect, useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import { NodeJS } from 'capacitor-nodejs';
import QrCodeReader from './QrCodeReader';
import core from './core';
import ItemsList, { ItemsListProps } from './ItemsList';

const App = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [renderQrCode, setRenderQrCode] = useState<boolean>(false);
  const [items, setItems] = useState<ItemsListProps['items']>([]);

  useEffect(() => {
    NodeJS.whenReady().then(() => {
      setIsNodeReady(true);
    });

    return () => {
      NodeJS.removeAllListeners();
    };
  }, []);

  const onButtonClick = useCallback(async () => {
    setRenderQrCode(true);
  }, []);

  const onQrCoreReaderClose = useCallback(async (data?: string) => {
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
        <QrCodeReader onClose={onQrCoreReaderClose} />
      ) : (
        <Container sm>
          {!isNodeReady ? 'Awaiting nodejs' : 'Node ready'}
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

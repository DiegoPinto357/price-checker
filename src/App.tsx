import { useEffect, useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import { NodeJS } from 'capacitor-nodejs';
import QrCodeReader from './QrCodeReader';
import core from './core';

const App = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [items, setItems] = useState<string>();
  const [renderQrCode, setRenderQrCode] = useState<boolean>(false);

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
      setItems(JSON.stringify(nfData, null, 2));
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
          <code>{JSON.stringify(items, null, 2)}</code>
        </Container>
      )}
    </NextUIProvider>
  );
};

export default App;

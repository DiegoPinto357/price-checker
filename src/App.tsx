import { useEffect, useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import { NodeJS } from 'capacitor-nodejs';
import QrCodeReader from './QrCodeReader';

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

  const onQrCoreReaderClose = useCallback((data: object) => {
    setRenderQrCode(false);
    setItems(JSON.stringify(data, null, 2));
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

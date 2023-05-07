import { useEffect, useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import { NodeJS } from 'capacitor-nodejs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import QrCodeOverlay from './QrCodeOverlay';
import core from './core';

const App = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [items, setItems] = useState<string>();
  const [renderQrCode, setRenderQrCode] = useState<boolean>(false);

  useEffect(() => {
    NodeJS.whenReady().then(() => {
      setIsNodeReady(true);
    });

    // return () => NodeJS.removeAllListeners();
  }, []);

  const startQrReader = useCallback(async () => {
    await BarcodeScanner.checkPermission({ force: true });
    document.body.style.position = 'unset';
    document.body.style.backgroundColor = 'transparent';
    BarcodeScanner.hideBackground();
    setRenderQrCode(true);
    return await BarcodeScanner.startScan({
      cameraDirection: 'back',
      targetedFormats: ['QR_CODE'],
    });
  }, []);

  const stopQrReader = useCallback(() => {
    document.body.style.position = 'relative';
    document.body.style.backgroundColor = 'var(--nextui-colors-background)';
    BarcodeScanner.showBackground();
    setRenderQrCode(false);
    BarcodeScanner.stopScan();
  }, []);

  const onButtonClick = useCallback(async () => {
    const result = await startQrReader();
    stopQrReader();

    if (result.hasContent) {
      const qrCodeData = result.content.replace('"', '');
      console.log(qrCodeData);

      const key = qrCodeData.match(/\?p=([^&]*)/)![1];

      const data = await core.getNfData(key);
      setItems(JSON.stringify(data, null, 2));
    }
  }, [startQrReader, stopQrReader]);

  return (
    <NextUIProvider>
      {renderQrCode ? (
        <QrCodeOverlay onCloseButtonClick={stopQrReader} />
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

import { useEffect, useCallback, useState } from 'react';
// import { NextUIProvider, Container, Button } from '@nextui-org/react';
import { NodeJS } from 'capacitor-nodejs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import core from './core';

const App = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [items, setItems] = useState<string>();
  // const [displayUI, setDisplayUI] = useState<boolean>(true);

  useEffect(() => {
    NodeJS.whenReady().then(() => {
      setIsNodeReady(true);
    });

    // return () => NodeJS.removeAllListeners();
  }, []);

  const onButtonClick = useCallback(async () => {
    await BarcodeScanner.checkPermission({ force: true });

    BarcodeScanner.hideBackground();
    // setDisplayUI(false);

    const result = await BarcodeScanner.startScan({
      cameraDirection: 'back',
      targetedFormats: ['QR_CODE'],
    });

    BarcodeScanner.showBackground();
    // setDisplayUI(true);

    if (result.hasContent) {
      const qrCodeData = result.content.replace('"', '');
      console.log(qrCodeData);

      const key = qrCodeData.match(/\?p=([^&]*)/)![1];

      const data = await core.getNfData(key);
      setItems(JSON.stringify(data, null, 2));
    }
  }, []);

  // const display = displayUI ? 'block' : 'none';

  return (
    <>
      {/* <NextUIProvider>
        <Container sm style={{ display }}> */}
      {!isNodeReady ? 'Awaiting nodejs' : 'Node ready'}
      <br />
      {/* <Button onPress={onButtonClick}>Parse NF</Button> */}
      <button onClick={onButtonClick}>Parse NF</button>
      <br />
      <code>{JSON.stringify(items, null, 2)}</code>
      {/* </Container>
      </NextUIProvider> */}
    </>
  );
};

export default App;

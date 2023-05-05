import { useEffect, useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import { NodeJS } from 'capacitor-nodejs';
import core from './core';

const App = () => {
  const [isNodeReady, setIsNodeReady] = useState<boolean>(false);
  const [items, setItems] = useState();

  useEffect(() => {
    NodeJS.whenReady().then(() => {
      setIsNodeReady(true);
    });

    // return () => NodeJS.removeAllListeners();
  }, []);

  const onButtonClick = useCallback(async () => {
    const data = await core.getNfData(
      '43230401438784002060650050002209661478083301|2|1|1|5a7b0201011ca0acc439ef3ea9358b64131234e4'
    );
    console.log(data);
    setItems(data);
  }, []);

  return (
    <NextUIProvider>
      <Container sm>
        {!isNodeReady ? 'Awaiting nodejs' : 'Node ready'}
        <br />
        <Button onClick={onButtonClick}>Parse NF</Button>
        <br />
        <code>{JSON.stringify(items, null, 2)}</code>
      </Container>
    </NextUIProvider>
  );
};

export default App;

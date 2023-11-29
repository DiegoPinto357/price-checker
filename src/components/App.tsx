// import { useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import NodejsLoader from './NodejsLoader';
import NFScanner from './NFScanner';

const App = () => {
  return (
    <div className="container mx-auto h-full p-4">
      <NodejsLoader />

      <Tabs
        className="fixed bottom-0 left-0"
        // variant="underlined"
        color="primary"
        fullWidth
        size="lg"
        radius="none"
        // disableAnimation
      >
        <Tab key="shopping-list" title="Lista de Compras">
          <div data-testid="shopping-list">lista</div>
        </Tab>
        <Tab key="nf-scanner" title="Escanear NF">
          <NFScanner />
        </Tab>
        <Tab key="settings" title="Configurações">
          <div data-testid="settings">configs</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;

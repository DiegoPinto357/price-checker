// import { useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import NodejsLoader from './NodejsLoader';
import ShoppingList from './ShoppingList';
import NFScanner from './NFScanner';

const App = () => {
  const tabClass = 'grow p-4';

  return (
    <div className="container flex flex-col-reverse mx-auto h-full">
      <NodejsLoader />

      <Tabs
        // variant="underlined"
        color="primary"
        fullWidth
        size="lg"
        radius="none"
        // disableAnimation
      >
        <Tab key="shopping-list" title="Lista de Compras" className={tabClass}>
          <ShoppingList />
        </Tab>
        <Tab key="nf-scanner" title="Escanear NF" className={tabClass}>
          <NFScanner />
        </Tab>
        <Tab key="settings" title="Configurações" className={tabClass}>
          <div data-testid="settings">configs</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;

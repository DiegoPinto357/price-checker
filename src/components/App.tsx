// import { useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import NodejsLoader from './NodejsLoader';
import ShoppingList from './ShoppingList';
import NFScanner from './NFScanner';

const App = () => {
  return (
    <div className="container flex flex-col-reverse h-full">
      <NodejsLoader />

      <Tabs
        classNames={{
          tab: 'overflow-hidden',
          tabContent: 'overflow-hidden',
          panel: 'overflow-y-scroll grow p-4',
        }}
        color="primary"
        fullWidth
        size="lg"
        radius="none"
        disableAnimation
      >
        <Tab key="shopping-list" title="Lista de Compras">
          <ShoppingList />
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

import { useState } from 'react';
import { Tabs, Tab } from '@nextui-org/react';
import NodejsLoader from './NodejsLoader';
// TODO rename to NFScanner
import NFScan from './NFScan';

const App = () => {
  const [selectedTab, setSelectedTab] = useState<string | number>(
    'shopping-list'
  );

  return (
    <div className="container mx-auto h-full p-4">
      <NodejsLoader />

      <Tabs
        className="fixed bottom-0 left-0 p-4 "
        variant="bordered"
        color="primary"
        fullWidth
        size="lg"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
      >
        <Tab key="shopping-list" title="Lista de Compras">
          lista
        </Tab>
        <Tab key="nf-scanner" title="Escanear NF">
          <NFScan />
        </Tab>
        <Tab key="settings" title="Configurações">
          config
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;

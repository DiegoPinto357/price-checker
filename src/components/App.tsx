import { Tabs, Tab } from '@nextui-org/react';
import { IoPizzaOutline } from 'react-icons/io5';
import { PiShoppingCart } from 'react-icons/pi';
import { BsQrCodeScan } from 'react-icons/bs';
import { GoGear } from 'react-icons/go';
import ContextProvider from './Context';
import Meals from './Meals';
import NodejsLoader from './NodejsLoader';
import ShoppingList from './ShoppingList';
import NFScanner from './NFScanner';
import Settings from './Settings';

const App = () => {
  const iconClass = 'w-8 h-8';

  return (
    <ContextProvider>
      <div className="container flex flex-col-reverse h-full">
        <NodejsLoader />

        <Tabs
          className="z-40"
          classNames={{
            tab: 'overflow-hidden h-16',
            tabContent: 'overflow-hidden h-16 m-auto pt-3',
            panel: 'relative overflow-y-scroll grow p-4',
          }}
          color="primary"
          fullWidth
          disableAnimation
        >
          <Tab
            key="meals"
            aria-label="meals"
            title={<IoPizzaOutline className={iconClass} />}
          >
            <Meals />
          </Tab>

          <Tab
            key="shopping-list"
            aria-label="shopping list"
            title={<PiShoppingCart className={iconClass} />}
          >
            <ShoppingList />
          </Tab>

          <Tab
            key="nf-scanner"
            aria-label="nf scanner"
            title={<BsQrCodeScan className={iconClass} />}
          >
            <NFScanner />
          </Tab>

          <Tab
            key="settings"
            aria-label="settings"
            title={<GoGear className={iconClass} />}
          >
            <Settings />
          </Tab>
        </Tabs>
      </div>
    </ContextProvider>
  );
};

export default App;

import { Tabs, Tab } from '@nextui-org/react';
import { IoPizzaOutline } from 'react-icons/io5';
import { FiShoppingCart } from 'react-icons/fi';
import { BsQrCodeScan } from 'react-icons/bs';
import { GoGear } from 'react-icons/go';
import NodejsLoader from './NodejsLoader';
import ShoppingList from './ShoppingList';
import NFScanner from './NFScanner';

const App = () => {
  const iconClass = 'w-8 h-8';

  return (
    <div className="container flex flex-col-reverse h-full">
      <NodejsLoader />

      <Tabs
        classNames={{
          tab: 'overflow-hidden h-16',
          tabContent: 'overflow-hidden h-16 m-auto pt-3',
          panel: 'overflow-y-scroll grow p-4',
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
          <div data-testid="meals">meals</div>
        </Tab>

        <Tab
          key="shopping-list"
          aria-label="shopping list"
          title={<FiShoppingCart className={iconClass} />}
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
          <div data-testid="settings">configs</div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default App;

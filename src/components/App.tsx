import { Tabs, Tab } from '@nextui-org/react';
import { IoCalendarOutline } from 'react-icons/io5';
import { PiShoppingCart } from 'react-icons/pi';
import { IoPizzaOutline } from 'react-icons/io5';
import { BsQrCodeScan } from 'react-icons/bs';
import ContextProvider from './Context';
import MainContent from './MainContent';
import MealsPlanner from './MealsPlanner';
import NodejsLoader from './NodejsLoader';
import ShoppingList from './ShoppingList';
import Recipes from './Recipes';
import NFScanner from './NFScanner';
import Products from './Products';

const debugProducts = false;

const App = () => {
  const iconClass = 'w-8 h-8';

  return (
    <ContextProvider>
      <NodejsLoader />

      {debugProducts ? (
        <Products />
      ) : (
        <div className="container flex flex-col-reverse h-full">
          <Tabs
            className="z-40"
            classNames={{
              tabList: 'rounded-none',
              tab: 'overflow-hidden h-16',
              tabContent: 'overflow-hidden h-16 m-auto pt-3',
              panel: 'relative overflow-y-scroll grow py-4 px-0',
            }}
            color="primary"
            fullWidth
            disableAnimation
          >
            <Tab
              key="meals-planner"
              aria-label="meals planner"
              title={<IoCalendarOutline className={iconClass} />}
            >
              <MainContent title="Planejamento">
                <MealsPlanner />
              </MainContent>
            </Tab>

            <Tab
              key="shopping-list"
              aria-label="shopping list"
              title={<PiShoppingCart className={iconClass} />}
            >
              <MainContent title="Lista de Compras">
                <ShoppingList />
              </MainContent>
            </Tab>

            <Tab
              key="recipes"
              aria-label="recipes"
              title={<IoPizzaOutline className={iconClass} />}
            >
              <MainContent title="Receitas">
                <Recipes />
              </MainContent>
            </Tab>

            <Tab
              key="nf-scanner"
              aria-label="nf scanner"
              title={<BsQrCodeScan className={iconClass} />}
            >
              <MainContent title="Nota Fiscal">
                <NFScanner />
              </MainContent>
            </Tab>
          </Tabs>
        </div>
      )}
    </ContextProvider>
  );
};

export default App;

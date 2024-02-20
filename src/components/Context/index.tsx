import { ShoppingListContextProvider } from './ShoppingListContext';

import type { ReactNode } from 'react';

export { ShoppingListContext } from './ShoppingListContext';

// TODO use PropsWithChildren
const ContextProvider = ({ children }: { children: ReactNode }) => {
  return <ShoppingListContextProvider>{children}</ShoppingListContextProvider>;
};

export default ContextProvider;

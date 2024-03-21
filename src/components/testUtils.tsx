import { render } from '@testing-library/react';
import { ContextProvider } from './Context';

import type { ReactElement, PropsWithChildren } from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import type { ContextProviderProps } from './Context';

type CreateRenderOptions = ContextProviderProps['options'];

export const createRender = (options?: CreateRenderOptions) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <ContextProvider options={options}>{children}</ContextProvider>
  );
  return (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'queries'>
  ): RenderResult => render(ui, { wrapper, ...options });
};

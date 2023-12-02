import { render } from '@testing-library/react';
import ContextProvider from './Context';

import { ReactElement } from 'react';
import type { RenderOptions, RenderResult } from '@testing-library/react';

export const renderWithContext = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: ContextProvider, ...options });

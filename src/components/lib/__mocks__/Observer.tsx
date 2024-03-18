/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { act } from '@testing-library/react';

import type { ObserverProps } from '../Observer';

export const triggerIntersectionOnInstance: Record<string, () => void> = {};

const Observer = (props: ObserverProps) => {
  const { onIntersection, 'data-testid': dataTestId } = props;
  useEffect(() => {
    if (dataTestId) {
      triggerIntersectionOnInstance[dataTestId] = vi.fn(() => {
        act(() => {
          onIntersection();
        });
      });
    }
  }, [dataTestId, onIntersection]);

  return <div />;
};

export default Observer;

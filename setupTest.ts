import { vi, expect, beforeEach, afterEach } from 'vitest';
import 'vitest-dom/extend-expect';
import { cleanup } from '@testing-library/react';
import * as matchers from 'vitest-dom/matchers';
import {
  setupIntersectionMocking,
  resetIntersectionMocking,
} from 'react-intersection-observer/test-utils';

expect.extend(matchers);

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  cleanup();
  resetIntersectionMocking();
});

import { useRef, useEffect } from 'react';
import { useDrop as actualUseDrop } from '../useDrop';

type DropOptions<T> = Parameters<typeof actualUseDrop<T>>[0];
type OnDropArgs<T> = Parameters<DropOptions<T>['onDrop']>[0];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let onDrop: DropOptions<any>['onDrop'];

export const triggerOnDrop = <T>(args: OnDropArgs<T>) => {
  if (onDrop) {
    onDrop(args);
  }
};

export const useDrop = <T>(props: DropOptions<T>) => {
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dropRef) {
      onDrop = props.onDrop;
    }
  }, [dropRef, props.onDrop]);

  return {
    dropRef,
  };
};

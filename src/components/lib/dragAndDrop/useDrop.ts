import { useEffect, useRef } from 'react';
import { EVENTS } from './contants';

type DropOptions<T> = {
  id: string;
  onDrop: ({ dragData }: { dragData: T }) => boolean;
};

export const useDrop = <T>({ id, onDrop }: DropOptions<T>) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleOnDrop = useRef((ev: CustomEventInit) => {
    if (ev.detail.dropId === id) {
      if (!onDrop({ dragData: ev.detail.dragData })) {
        const event = new CustomEvent(EVENTS.ON_DROP_REFUSED);
        document.dispatchEvent(event);
      }
    }
  });

  useEffect(() => {
    if (dropRef) {
      dropRef.current?.setAttribute('data-droppable', 'true');
      dropRef.current?.setAttribute('data-drop-id', id);
    }
  }, [dropRef, id]);

  useEffect(() => {
    document.addEventListener(EVENTS.ON_DROP, handleOnDrop.current);
  }, [id, onDrop, handleOnDrop]);

  return {
    dropRef,
  };
};

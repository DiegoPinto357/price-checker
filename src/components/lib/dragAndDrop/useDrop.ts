import { useEffect, useRef } from 'react';
import { throttle } from 'lodash';

type DropOptions = {
  id: string;
  onDrop: ({ dragData }: { dragData: unknown }) => void;
};

export const useDrop = ({ id, onDrop }: DropOptions) => {
  const dropRef = useRef<HTMLDivElement>(null);

  const handleOnDrop = useRef(
    throttle((ev: CustomEventInit) => {
      if (ev.detail.dropId === id) {
        onDrop(ev.detail.dragData);
      }
    }, 100)
  );

  useEffect(() => {
    if (dropRef) {
      dropRef.current?.setAttribute('data-droppable', 'true');
      dropRef.current?.setAttribute('data-drop-id', id);
    }
  }, [dropRef, id]);

  useEffect(() => {
    const eventName = 'on-drop';
    document.addEventListener(eventName, handleOnDrop.current);
  }, [id, onDrop, handleOnDrop]);

  return {
    dropRef,
  };
};

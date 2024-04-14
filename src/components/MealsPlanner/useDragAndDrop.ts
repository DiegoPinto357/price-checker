import { useEffect, useState, useRef, useCallback } from 'react';
import { createGesture } from '@ionic/react';

import type { GestureDetail } from '@ionic/react';

const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;

type Options = {
  scrollContainerId?: string;
};

const useDragAndDrop = (options?: Options) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef(
    document.getElementById(options?.scrollContainerId || '')
  );

  const [isDragging, setIsDragging] = useState<boolean>(false);

  let initialScrollPosition = 0;

  const autoscroll = useCallback((posY: number, initialY: number) => {
    if (!scrollContainerRef.current) {
      return 0;
    }

    const scrollBox = scrollContainerRef.current.getBoundingClientRect();

    let amount = 0;
    if (posY < scrollBox.top + AUTO_SCROLL_MARGIN) {
      amount = -SCROLL_JUMP;
    } else if (posY > scrollBox.bottom - AUTO_SCROLL_MARGIN) {
      amount = SCROLL_JUMP;
    }
    if (amount !== 0) {
      scrollContainerRef.current.scrollBy(0, amount);
    }
    return scrollContainerRef.current.scrollTop - initialY;
  }, []);

  const canStart = useCallback(() => {
    if (!dragRef.current) {
      return false;
    }
    return true;
  }, []);

  const onStart = useCallback((ev: GestureDetail) => {
    ev.event.preventDefault();

    if (scrollContainerRef.current) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      initialScrollPosition = scrollContainerRef.current.scrollTop;
    }

    if (dragRef.current) {
      dragRef.current.removeAttribute('onmouseup');
      dragRef.current.style.position = 'static';
      dragRef.current.style.zIndex = '100';
    }
  }, []);

  const onMove = useCallback(
    (ev: GestureDetail) => {
      setIsDragging(true);
      const scroll = autoscroll(ev.currentY, initialScrollPosition);
      const currentY = ev.currentY;
      const deltaY = scroll + currentY - ev.startY;

      if (dragRef.current) {
        dragRef.current.style.transform = `translateY(${deltaY}px)`;
      }
    },
    [autoscroll, initialScrollPosition]
  );

  const onEnd = useCallback(() => {
    if (dragRef.current) {
      // TODO reset original styles?
      dragRef.current.style.position = 'unset';
      dragRef.current.style.zIndex = 'unset';
      dragRef.current.style.transform = 'unset';
    }

    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (dragRef.current) {
      const gesture = createGesture({
        gestureName: 'drag-and-drop',
        el: dragRef.current,
        threshold: 0,
        direction: 'y',
        passive: false,
        canStart,
        onStart,
        onMove,
        onEnd,
      });

      gesture.enable();
    }
  }, [dragRef, canStart, onStart, onMove, onEnd]);

  return {
    dragRef,
    isDragging,
  };
};

export default useDragAndDrop;

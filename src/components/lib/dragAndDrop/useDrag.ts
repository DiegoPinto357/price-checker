import { useEffect, useState, useRef, useCallback } from 'react';
import { createGesture } from '@ionic/react';

import type { GestureDetail } from '@ionic/react';

const AUTO_SCROLL_MARGIN = 60;
const SCROLL_JUMP = 10;

type StyleEntry = { property: string; value: string | undefined };

const dragStyle: StyleEntry[] = [
  { property: 'position', value: 'static' },
  { property: 'z-index', value: '100' },
  { property: 'transition-duration', value: '0ms' },
];

const originalStyle: StyleEntry[] = [];

type DragOptions = {
  direction?: 'x' | 'y';
  scrollContainerId?: string;
  data?: unknown;
};

export const useDrag = (options?: DragOptions) => {
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
      const computedStyle = window.getComputedStyle(dragRef.current);
      dragStyle.forEach(({ property, value }) => {
        const currentValue = computedStyle.getPropertyValue(property);
        originalStyle.push({
          property,
          value: currentValue,
        });
        dragRef.current?.style.setProperty(property, value || '');
      });
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

  const onEnd = useCallback(
    (ev: GestureDetail) => {
      const { deltaX, deltaY } = ev;
      const moved = deltaX !== 0 || deltaY !== 0;
      if (!moved) return;

      const dropElements = document.elementsFromPoint(ev.currentX, ev.currentY);
      const dropElement = dropElements.filter(
        element => element.attributes.getNamedItem('data-droppable')?.value
      )[0];
      const dropId =
        dropElement?.attributes.getNamedItem('data-drop-id')?.value;
      if (dropId) {
        const event = new CustomEvent('on-drop', {
          detail: { dropId, dragData: options?.data },
        });
        document.dispatchEvent(event);
      }

      if (dragRef.current) {
        originalStyle.forEach(({ property, value }) => {
          dragRef.current?.style.setProperty(property, value || '');
        });
        originalStyle.length = 0;
      }

      setIsDragging(false);
    },
    [options?.data]
  );

  useEffect(() => {
    if (dragRef.current) {
      const gesture = createGesture({
        gestureName: 'drag-and-drop',
        el: dragRef.current,
        threshold: 0,
        direction: options?.direction,
        passive: false,
        canStart,
        onStart,
        onMove,
        onEnd,
      });

      gesture.enable();
    }
  }, [options?.direction, dragRef, canStart, onStart, onMove, onEnd]);

  useEffect(() => {
    document.addEventListener('on-drop-refused', () => {
      if (dragRef.current) {
        dragRef.current?.style.setProperty('transform', 'unset');
      }
    });
  }, []);

  return {
    dragRef,
    isDragging,
  };
};

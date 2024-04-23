import { useEffect, useState, useRef, useCallback } from 'react';
import { createGesture } from '@ionic/react';
import { EVENTS } from './contants';

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

const findHandleElement = (
  dragged: HTMLElement | null,
  handle: HTMLElement
): HTMLElement | undefined => {
  let parent: HTMLElement | null;
  while (dragged) {
    parent = dragged.parentElement;
    if (parent === handle) {
      return parent;
    }
    dragged = parent;
  }
  return undefined;
};

const getDropElementByPosition = (x: number, y: number) => {
  const dropElements = document.elementsFromPoint(x, y);
  return dropElements.filter(
    element => element.attributes.getNamedItem('data-droppable')?.value
  )[0];
};

const getDropIndex = (rects: DOMRect[], y: number) => {
  let index = 0;
  rects.some(rect => {
    const itemThresholdPosition = rect.top + rect.height / 2;
    if (y < itemThresholdPosition) return true;
    index++;
    return false;
  });
  return index;
};

type DragOptions = {
  direction?: 'x' | 'y';
  scrollContainerId?: string;
  sortable?: boolean;
  data?: unknown;
};

export const useDrag = ({
  direction,
  scrollContainerId,
  sortable,
  data,
}: DragOptions) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef(
    document.getElementById(scrollContainerId || '')
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

  const canStart = useCallback((ev: GestureDetail) => {
    if (!dragRef.current) {
      return false;
    }

    const draggedElement = ev.event.target;

    if (dragHandleRef.current) {
      const handleElement = findHandleElement(
        // @ts-ignore
        draggedElement,
        dragHandleRef.current
      );
      if (handleElement !== dragHandleRef.current) {
        return false;
      }
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

      const deltaX = direction !== 'y' ? ev.currentX - ev.startX : 0;

      let deltaY = 0;
      if (direction !== 'x') {
        const scroll = autoscroll(ev.currentY, initialScrollPosition);
        deltaY = scroll + ev.currentY - ev.startY;
      }

      if (dragRef.current) {
        dragRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      }
    },
    [autoscroll, initialScrollPosition, direction]
  );

  const onEnd = useCallback(
    (ev: GestureDetail) => {
      const { deltaX, deltaY } = ev;
      const moved = deltaX !== 0 || deltaY !== 0;
      if (!moved) return;

      const dropElement = getDropElementByPosition(ev.currentX, ev.currentY);

      let sortData: { index: number } | undefined = undefined;

      if (sortable && dragRef.current) {
        const sortableItemsOnDropArea = Array.from(
          dropElement.querySelectorAll('[data-sortable="true"]')
        ).filter(item => item !== dragRef.current);
        const itemsBoudingRect = sortableItemsOnDropArea.map(item =>
          item.getBoundingClientRect()
        );
        // TODO implement sorting on x axis
        const dropIndex = getDropIndex(itemsBoudingRect, ev.currentY);
        sortData = { index: dropIndex };
      }

      const dropId =
        dropElement?.attributes.getNamedItem('data-drop-id')?.value;
      if (dropId) {
        const event = new CustomEvent(EVENTS.ON_DROP, {
          detail: { dropId, dragData: data, sortData },
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
    [data, sortable]
  );

  useEffect(() => {
    if (dragRef.current) {
      const gesture = createGesture({
        gestureName: 'drag-and-drop',
        el: dragRef.current,
        threshold: 0,
        direction,
        passive: false,
        canStart,
        onStart,
        onMove,
        onEnd,
      });

      gesture.enable();
    }
  }, [direction, dragRef, canStart, onStart, onMove, onEnd]);

  useEffect(() => {
    if (dragRef) {
      if (sortable) {
        dragRef.current?.setAttribute('data-sortable', 'true');
      }
    }

    document.addEventListener(EVENTS.ON_DROP_REFUSED, () => {
      if (dragRef.current) {
        dragRef.current?.style.setProperty('transform', 'unset');
      }
    });
  }, [sortable]);

  return {
    dragRef,
    dragHandleRef,
    isDragging,
  };
};

import { useRef } from 'react';

let isDragging = false;

export const setIsDragging = (value: boolean) => {
  isDragging = value;
};

export const useDrag = () => {
  const dragRef = useRef<HTMLDivElement>(null);
  return {
    dragRef,
    isDragging,

    setIsDragging,
  };
};

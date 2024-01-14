import { useState, useRef, useCallback } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import { v4 as uuid } from 'uuid';
import Observer from '../lib/Observer';
import Typography from '../lib/Typography';

const Meals = () => {
  const [items, setItems] = useState<string[]>(
    new Array(20).fill('').map(() => uuid())
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addItemOnTop = useCallback(() => {
    console.log('addItemOnTop');
    setItems(currentItems => {
      const newItem = uuid();
      return [newItem, ...currentItems];
    });
  }, []);

  const addItemOnBottom = useCallback(() => {
    console.log('addItemOnBottom');
    setItems(currentItems => {
      const newItem = uuid();
      return [...currentItems, newItem];
    });
  }, []);

  return (
    <div data-testid="meals" className="flex flex-col justify-between h-full">
      <Typography variant="h1">Refeições</Typography>
      <ScrollShadow className="flex flex-col" ref={scrollRef}>
        <Observer
          onIntersection={() => {
            new Array(10).fill(null).forEach(() => addItemOnTop());
            if (scrollRef.current) {
              scrollRef.current.scrollTop = 1; // 2 * (64 + 2 * 8);
            }
          }}
        />
        {items.map(item => (
          <div key={item} className={`bg-blue-400 min-h-unit-16 m-2`}>
            {item}
          </div>
        ))}
        <Observer
          onIntersection={() => {
            new Array(10).fill(null).forEach(() => addItemOnBottom());
          }}
        />
      </ScrollShadow>
    </div>
  );
};

export default Meals;

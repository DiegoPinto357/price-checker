import { useState, useRef, useCallback } from 'react';
import {
  ScrollShadow,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from '@nextui-org/react';
import Observer from '../lib/Observer';
import Typography from '../lib/Typography';

// TODO move to some util lib
const toCapitalCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const generateDays = (startDate: Date, numOfDays: number) => {
  return new Array(numOfDays).fill(null).map((_item, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    // TODO add year if not current year
    return {
      date: date.toDateString(), // TODO format date to 2024-01-14
      label: toCapitalCase(
        date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })
      ),
    };
  });
};

const Meals = () => {
  const [items, setItems] = useState<{ date: string; label: string }[]>(
    generateDays(new Date(), 10)
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const addItemsOnTop = useCallback(() => {
    setItems(currentItems => {
      const firstDate = new Date(currentItems[0].date);
      const itemsToAdd = 10;
      firstDate.setDate(firstDate.getDate() - itemsToAdd);
      return [...generateDays(firstDate, itemsToAdd), ...currentItems];
    });
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 1;
    }
  }, []);

  const addItemsOnBottom = useCallback(() => {
    setItems(currentItems => {
      const lastDate = new Date(currentItems[currentItems.length - 1].date);
      lastDate.setDate(lastDate.getDate() + 1);
      const itemsToAdd = 10;
      return [...currentItems, ...generateDays(lastDate, itemsToAdd)];
    });
  }, []);

  console.log(items);

  return (
    <div data-testid="meals" className="flex flex-col justify-between h-full">
      <Typography className="mx-4" variant="h1">
        Refeições
      </Typography>
      <ScrollShadow
        className="overflow-y-scroll overflow-x-visible"
        ref={scrollRef}
      >
        <Observer
          onIntersection={() => {
            addItemsOnTop();
          }}
        />
        {items.map(item => (
          <Card key={item.date} className="mx-4 my-2" shadow="sm">
            <CardHeader>{item.label}</CardHeader>
            <Divider />
            <CardBody>
              <ul>
                <li>Almoço:</li>
                <li>Janta:</li>
              </ul>
            </CardBody>
          </Card>
        ))}
        <Observer
          onIntersection={() => {
            addItemsOnBottom();
          }}
        />
      </ScrollShadow>
    </div>
  );
};

export default Meals;

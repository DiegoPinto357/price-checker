import { useContext } from 'react';
import { screen } from '@testing-library/react';
import MockDate from 'mockdate';
import { createRender } from '../testUtils';
import { triggerOnDrop } from '../lib/dragAndDrop/__mocks__/useDrop';
import DayContainer from './DayContainer';

vi.mock('react', async () => ({
  ...((await vi.importActual('react')) as object),
  useContext: vi.fn(),
}));

vi.mock('../lib/dragAndDrop/useDrop');

const today = '2024-03-08';
MockDate.set(today);

const render = createRender({ mealsPlannerProviderEnabled: true });

const date = '2024-3-5';

const meals = [
  { label: 'Batata' },
  { label: 'Acepipe' },
  { label: 'Leitão a pururuca' },
];

describe('DayContainer', () => {
  beforeEach(() => {
    vi.mocked(useContext).mockImplementation(() => ({}));
  });

  it('renders provided meals', () => {
    render(
      <DayContainer
        date={date}
        label=""
        items={meals}
        today={today}
        onAddButtonClick={vi.fn()}
        onMealClick={vi.fn()}
      />
    );

    meals.forEach(meal =>
      expect(screen.getByText(meal.label)).toBeInTheDocument()
    );
  });

  it('renders the "Hoje" chip on today list item', () => {
    const label = 'Quinta-feira, 7 de mar.';

    render(
      <DayContainer
        date={today}
        label={label}
        items={meals}
        today={today}
        onAddButtonClick={vi.fn()}
        onMealClick={vi.fn()}
      />
    );

    const todayContainer = screen.getByRole('group', {
      name: `${label} Hoje`, // Mock is UTC 0:00
    });
    expect(todayContainer).toBeInTheDocument();
  });

  it('adds meal dropped from another day', () => {
    const moveMeal = vi.fn();
    vi.mocked(useContext).mockImplementation(() => ({ moveMeal }));

    render(
      <DayContainer
        date={date}
        label=""
        items={meals}
        today={today}
        onAddButtonClick={vi.fn()}
        onMealClick={vi.fn()}
      />
    );

    const mealLabel = 'Acepipe';
    const dragDate = '2024-3-10';
    const dropIndex = 0;
    triggerOnDrop({
      dragData: { date: dragDate, label: mealLabel },
      sortData: { index: dropIndex },
    });

    expect(moveMeal).toBeCalledTimes(1);
    expect(moveMeal).toBeCalledWith(mealLabel, dragDate, date, dropIndex);
  });

  it('reorder dropped meal inside it', () => {
    const sortMeal = vi.fn();
    vi.mocked(useContext).mockImplementation(() => ({ sortMeal }));

    render(
      <DayContainer
        date={date}
        label=""
        items={meals}
        today={today}
        onAddButtonClick={vi.fn()}
        onMealClick={vi.fn()}
      />
    );

    const mealLabel = 'Acepipe';
    const dropIndex = 1;
    triggerOnDrop({
      dragData: { date, label: mealLabel },
      sortData: { index: dropIndex },
    });

    expect(sortMeal).toBeCalledTimes(1);
    expect(sortMeal).toBeCalledWith(date, mealLabel, dropIndex);
  });
});

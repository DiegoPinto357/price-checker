import { useContext } from 'react';
import { screen } from '@testing-library/react';
import { createRender } from '../testUtils';
import { triggerOnDrop } from '../lib/dragAndDrop/__mocks__/useDrop';
import DayContainer from './DayContainer';

vi.mock('react', async () => ({
  ...((await vi.importActual('react')) as object),
  useContext: vi.fn(),
}));

vi.mock('../lib/dragAndDrop/useDrop');

const render = createRender({ mealsPlannerProviderEnabled: true });

const date = '2024-3-5';

const meals = [
  { label: 'Batata' },
  { label: 'Acepipe' },
  { label: 'Leitão a pururuca' },
];

describe('DayContainer', () => {
  it('renders provided meals', () => {
    vi.mocked(useContext).mockImplementation(() => ({}));
    render(
      <DayContainer
        date={date}
        label=""
        items={meals}
        onAddButtonClick={vi.fn()}
        onMealClick={vi.fn()}
      />
    );

    meals.forEach(meal =>
      expect(screen.getByText(meal.label)).toBeInTheDocument()
    );
  });

  it('adds meal dropped from another day', () => {
    const moveMeal = vi.fn();
    vi.mocked(useContext).mockImplementation(() => ({ moveMeal }));

    render(
      <DayContainer
        date={date}
        label=""
        items={meals}
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

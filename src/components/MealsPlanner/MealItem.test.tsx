import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRender } from '../testUtils';
import { setIsDragging } from '../lib/dragAndDrop/__mocks__/useDrag';
import MealItem from './MealItem';

vi.mock('../lib/dragAndDrop/useDrag');

const render = createRender({ mealsPlannerProviderEnabled: true });

describe('MealItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onClick when cicked', async () => {
    const handleClick = vi.fn();
    render(<MealItem date="2024-4-23" label="Batata" onClick={handleClick} />);

    const mealItem = screen.getByRole('button', { name: 'Batata' });
    await userEvent.click(mealItem);
    expect(handleClick).toBeCalledTimes(1);
  });

  it('prevents click when dragging', async () => {
    const handleClick = vi.fn();
    setIsDragging(true);
    render(<MealItem date="2024-4-23" label="Batata" onClick={handleClick} />);

    const mealItem = screen.getByRole('button', { name: 'Batata' });
    await userEvent.click(mealItem);
    expect(handleClick).not.toBeCalled();
  });
});

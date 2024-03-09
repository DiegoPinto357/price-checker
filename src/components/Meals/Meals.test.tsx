import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Meals from '.';

const addMeal = async (dayContainer: HTMLElement, mealName: string) => {
  const addButton = within(dayContainer).getByRole('button', { name: 'add' });
  await userEvent.click(addButton);

  const dialog = screen.getByRole('dialog', { name: 'Adicionar item' });
  const nameInput = within(dialog).getByTestId('item-name-input');
  expect(nameInput).toHaveFocus();
  await userEvent.type(nameInput, mealName);
  const dialogOkButton = within(dialog).getByRole('button', {
    name: 'Adicionar',
  });
  await userEvent.click(dialogOkButton);
};

describe('Meals', () => {
  it('add meals to day container', async () => {
    render(<Meals />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, 'Peixe exuberante');
    await addMeal(dayContainer, 'Massa absurda');

    expect(
      within(dayContainer).getByText('Peixe exuberante')
    ).toBeInTheDocument();
    expect(within(dayContainer).getByText('Massa absurda')).toBeInTheDocument();
  });
});

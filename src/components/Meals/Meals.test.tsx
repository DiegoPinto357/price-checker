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
  const dialogAddButton = within(dialog).getByRole('button', {
    name: 'Adicionar',
  });
  await userEvent.click(dialogAddButton);
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

  it('edits meal', async () => {
    render(<Meals />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, 'Peixe exuberante');
    await addMeal(dayContainer, 'Massa absurda');

    const mealToEdit = within(dayContainer).getByText('Massa absurda');
    await userEvent.click(mealToEdit);

    const editDialog = screen.getByRole('dialog', { name: 'Editar item' });
    const nameInput = within(editDialog).getByTestId('edit-item-input');
    expect(nameInput).toHaveFocus();

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Leitão a pururuca');
    const dialogOkButton = within(editDialog).getByRole('button', {
      name: 'Ok',
    });
    await userEvent.click(dialogOkButton);

    expect(
      within(dayContainer).getByText('Peixe exuberante')
    ).toBeInTheDocument();
    expect(
      within(dayContainer).getByText('Leitão a pururuca')
    ).toBeInTheDocument();
  });

  it.todo('deletes meal');
});

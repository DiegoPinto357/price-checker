import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';
import { renderWithContext } from '../testUtils';
import Meals from '.';

MockDate.set('2024-03-08');

const MEALS = ['Peixe exuberante', 'Massa absurda', 'Leitão a pururuca'];

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

describe('MealsPlanner', () => {
  it('add meals to day container', async () => {
    renderWithContext(<Meals />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, MEALS[0]);
    await addMeal(dayContainer, MEALS[1]);

    expect(within(dayContainer).getByText(MEALS[0])).toBeInTheDocument();
    expect(within(dayContainer).getByText(MEALS[1])).toBeInTheDocument();
  });

  it('edits meal', async () => {
    renderWithContext(<Meals />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, MEALS[0]);
    await addMeal(dayContainer, MEALS[1]);

    const mealToEdit = within(dayContainer).getByText(MEALS[1]);
    await userEvent.click(mealToEdit);

    const editDialog = screen.getByRole('dialog', { name: 'Editar item' });
    const nameInput = within(editDialog).getByTestId('edit-item-input');
    expect(nameInput).toHaveFocus();

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, MEALS[2]);
    const dialogOkButton = within(editDialog).getByRole('button', {
      name: 'Ok',
    });
    await userEvent.click(dialogOkButton);

    expect(within(dayContainer).getByText(MEALS[0])).toBeInTheDocument();
    expect(within(dayContainer).queryByText(MEALS[1])).not.toBeInTheDocument();
    expect(within(dayContainer).getByText(MEALS[2])).toBeInTheDocument();
  });

  it('deletes meal', async () => {
    renderWithContext(<Meals />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, MEALS[0]);
    await addMeal(dayContainer, MEALS[1]);

    const mealToEdit = within(dayContainer).getByText(MEALS[1]);
    await userEvent.click(mealToEdit);

    const editDialog = screen.getByRole('dialog', { name: 'Editar item' });
    const deleteButton = within(editDialog).getByRole('button', {
      name: 'Deletar',
    });
    await userEvent.click(deleteButton);

    const confirmDialog = screen.getByRole('dialog', { name: 'Deletar item?' });
    const confirmButton = within(confirmDialog).getByRole('button', {
      name: 'Ok',
    });
    await userEvent.click(confirmButton);

    expect(within(dayContainer).getByText(MEALS[0])).toBeInTheDocument();
    expect(within(dayContainer).queryByText(MEALS[1])).not.toBeInTheDocument();
  });
});

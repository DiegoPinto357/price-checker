import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRender } from '../testUtils';
import { storage } from '../../proxies';
import PlannerDayList from './PlannerDayList';
import { DAYS } from '../../../mockData/ui/mealsPlanner/plannerListDays';

vi.mock('../../proxies/storage');

const render = createRender({ mealsPlannerProviderEnabled: true });

const USER_MEALS = [
  'Peixe exuberante',
  'Massa absurda',
  'Leitão a pururuca',
  'Crepioca',
];

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

describe('PlannerDayList', () => {
  it('add meals to day container', async () => {
    render(<PlannerDayList days={DAYS} />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, USER_MEALS[0]);
    await addMeal(dayContainer, USER_MEALS[1]);

    expect(within(dayContainer).getByText(USER_MEALS[0])).toBeInTheDocument();
    expect(within(dayContainer).getByText(USER_MEALS[1])).toBeInTheDocument();

    const mealsFile = await storage.readFile('/meals/2024-03.json');
    expect(mealsFile).toEqual({
      '2024-3-10': [{ label: USER_MEALS[0] }, { label: USER_MEALS[1] }],
    });
  });

  it('edits meal', async () => {
    render(<PlannerDayList days={DAYS} />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, USER_MEALS[0]);
    await addMeal(dayContainer, USER_MEALS[1]);

    const mealToEdit = within(dayContainer).getByText(USER_MEALS[1]);
    await userEvent.click(mealToEdit);

    const editDialog = screen.getByRole('dialog', { name: 'Editar item' });
    const nameInput = within(editDialog).getByTestId('edit-item-input');
    expect(nameInput).toHaveFocus();

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, USER_MEALS[2]);
    const dialogOkButton = within(editDialog).getByRole('button', {
      name: 'Ok',
    });
    await userEvent.click(dialogOkButton);

    expect(within(dayContainer).getByText(USER_MEALS[0])).toBeInTheDocument();
    expect(
      within(dayContainer).queryByText(USER_MEALS[1])
    ).not.toBeInTheDocument();
    expect(within(dayContainer).getByText(USER_MEALS[2])).toBeInTheDocument();

    const mealsFile = await storage.readFile('/meals/2024-03.json');
    expect(mealsFile).toEqual({
      '2024-3-10': [{ label: USER_MEALS[0] }, { label: USER_MEALS[2] }],
    });
  });

  it('deletes meal', async () => {
    render(<PlannerDayList days={DAYS} />);

    const dayContainer1 = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer1, USER_MEALS[0]);
    await addMeal(dayContainer1, USER_MEALS[1]);

    const dayContainer2 = screen.getByRole('group', {
      name: 'Segunda-feira, 11 de mar.',
    });
    await addMeal(dayContainer2, USER_MEALS[2]);
    await addMeal(dayContainer2, USER_MEALS[3]);

    const mealToEdit = within(dayContainer1).getByText(USER_MEALS[1]);
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

    expect(within(dayContainer1).getByText(USER_MEALS[0])).toBeInTheDocument();
    expect(
      within(dayContainer1).queryByText(USER_MEALS[1])
    ).not.toBeInTheDocument();
    expect(within(dayContainer2).getByText(USER_MEALS[2])).toBeInTheDocument();
    expect(within(dayContainer2).getByText(USER_MEALS[3])).toBeInTheDocument();

    const mealsFile = await storage.readFile('/meals/2024-03.json');
    expect(mealsFile).toEqual({
      '2024-3-10': [{ label: USER_MEALS[0] }],
      '2024-3-11': [{ label: USER_MEALS[2] }, { label: USER_MEALS[3] }],
    });
  });
});

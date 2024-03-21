import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';
import { createRender } from '../testUtils';
import { triggerIntersectionOnInstance } from '../lib/__mocks__/Observer';
import { storage } from '../../proxies';
import Meals from '.';

vi.mock('../lib/Observer');
vi.mock('../../proxies/storage');

type MockStorage = typeof storage & { clearFiles: () => void };

const mockStorage = storage as MockStorage;

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

const render = createRender({ mealsPlannerProviderEnabled: true });

describe('MealsPlanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.clearFiles();
  });

  it('renders a 3 month list of days', async () => {
    render(<Meals />);

    const dayContainers = screen.getAllByRole('group');
    expect(dayContainers).toHaveLength(29 + 31 + 30);
    expect(dayContainers[0]).toHaveAccessibleName('Quinta-feira, 1 de fev.');
    expect(dayContainers[dayContainers.length - 1]).toHaveAccessibleName(
      'Terça-feira, 30 de abr.'
    );

    // expect(storage.readFile).toBeCalledTimes(3);
  });

  it('adds month at the top of the list and removes the last one when user scrolls to top', () => {
    render(<Meals />);

    triggerIntersectionOnInstance['observer-top']();

    const dayContainers = screen.getAllByRole('group');
    expect(dayContainers).toHaveLength(31 + 29 + 31);
    expect(dayContainers[0]).toHaveAccessibleName('Segunda-feira, 1 de jan.');
    expect(dayContainers[dayContainers.length - 1]).toHaveAccessibleName(
      'Domingo, 31 de mar.'
    );
  });

  it('adds month at the bottom of the list and removes the first one when user scrolls to top', () => {
    render(<Meals />);

    triggerIntersectionOnInstance['observer-bottom']();

    const dayContainers = screen.getAllByRole('group');
    expect(dayContainers).toHaveLength(31 + 30 + 31);
    expect(dayContainers[0]).toHaveAccessibleName('Sexta-feira, 1 de mar.');
    expect(dayContainers[dayContainers.length - 1]).toHaveAccessibleName(
      'Sexta-feira, 31 de mai.'
    );
  });

  it('add meals to day container', async () => {
    render(<Meals />);

    const dayContainer = screen.getByRole('group', {
      name: 'Domingo, 10 de mar.',
    });
    await addMeal(dayContainer, MEALS[0]);
    await addMeal(dayContainer, MEALS[1]);

    expect(within(dayContainer).getByText(MEALS[0])).toBeInTheDocument();
    expect(within(dayContainer).getByText(MEALS[1])).toBeInTheDocument();
  });

  it('edits meal', async () => {
    render(<Meals />);

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
    render(<Meals />);

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

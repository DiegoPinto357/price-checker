import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MockDate from 'mockdate';
import { createRender } from '../testUtils';
import { triggerIntersectionOnInstance } from '../lib/__mocks__/Observer';
import { storage } from '../../proxies';
import Meals from '.';
import { MealsRecord } from '../Context/MealsPlannerContext';

vi.mock('../lib/Observer');
vi.mock('../../proxies/storage');

type MockStorage = typeof storage & { clearFiles: () => void };

const mockStorage = storage as MockStorage;

MockDate.set('2024-03-08');

const USER_MEALS = [
  'Peixe exuberante',
  'Massa absurda',
  'Leitão a pururuca',
  'Crepioca',
];

const MEALS_FILES = {
  jan: {
    filename: '2024-01.json',
    data: {
      '2024-1-3': [{ label: 'Bife illuminati' }],
    },
  },
  feb: {
    filename: '2024-02.json',
    data: {
      '2024-2-8': [
        { label: 'Banana portuguesa' },
        { label: 'Sophie no rolete' },
      ],
    },
  },
  apr: {
    filename: '2024-04.json',
    data: {
      '2024-4-12': [
        { label: 'Frango quadriculado' },
        { label: 'Pizza de pudim' },
      ],
      '2024-4-21': [
        { label: 'Batata a milanesa' },
        { label: 'Carpa cabeçuda' },
      ],
    },
  },
  may: {
    filename: '2024-05.json',
    data: {
      '2024-5-13': [{ label: 'Pizza napolitana' }],
    },
  },
} as const satisfies Record<string, { filename: string; data: MealsRecord }>;

const setupFiles = async () => {
  mockStorage.clearFiles();
  Object.values(MEALS_FILES).forEach(
    async ({ filename, data }) =>
      await storage.writeFile(`/meals/${filename}`, data)
  );
};

const verifyLoadedData = async (
  data: MealsRecord,
  { notInTheDocument } = { notInTheDocument: false }
) => {
  await Promise.all(
    Object.entries(data).map(async ([day, meals]) => {
      const dayContainer = screen.queryByTestId(day);

      if (notInTheDocument) {
        expect(dayContainer).not.toBeInTheDocument();
        return;
      }

      await Promise.all(
        meals.map(async meal => {
          await waitFor(() => {
            const mealCard = within(dayContainer!).getByText(meal.label);
            expect(mealCard).toBeInTheDocument();
          });
        })
      );
    })
  );
};

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
  beforeEach(async () => {
    vi.clearAllMocks();
    await setupFiles();
  });

  it('renders a 3 month list of days', async () => {
    await setupFiles();

    render(<Meals />);

    const dayContainers = screen.getAllByRole('group');
    expect(dayContainers).toHaveLength(29 + 31 + 30);
    expect(dayContainers[0]).toHaveAccessibleName('Quinta-feira, 1 de fev.');
    expect(dayContainers[dayContainers.length - 1]).toHaveAccessibleName(
      'Terça-feira, 30 de abr.'
    );

    await verifyLoadedData(MEALS_FILES.jan.data, { notInTheDocument: true });
    await verifyLoadedData(MEALS_FILES.feb.data);
    await verifyLoadedData(MEALS_FILES.apr.data);
    await verifyLoadedData(MEALS_FILES.may.data, { notInTheDocument: true });
  });

  it('adds month at the top of the list and removes the last one when user scrolls to top', async () => {
    render(<Meals />);

    triggerIntersectionOnInstance['observer-top']();

    const dayContainers = screen.getAllByRole('group');
    expect(dayContainers).toHaveLength(31 + 29 + 31);
    expect(dayContainers[0]).toHaveAccessibleName('Segunda-feira, 1 de jan.');
    expect(dayContainers[dayContainers.length - 1]).toHaveAccessibleName(
      'Domingo, 31 de mar.'
    );

    await verifyLoadedData(MEALS_FILES.jan.data);
    await verifyLoadedData(MEALS_FILES.apr.data, { notInTheDocument: true });
  });

  it('adds month at the bottom of the list and removes the first one when user scrolls to top', async () => {
    render(<Meals />);

    triggerIntersectionOnInstance['observer-bottom']();

    const dayContainers = screen.getAllByRole('group');
    expect(dayContainers).toHaveLength(31 + 30 + 31);
    expect(dayContainers[0]).toHaveAccessibleName('Sexta-feira, 1 de mar.');
    expect(dayContainers[dayContainers.length - 1]).toHaveAccessibleName(
      'Sexta-feira, 31 de mai.'
    );

    await verifyLoadedData(MEALS_FILES.feb.data, { notInTheDocument: true });
    await verifyLoadedData(MEALS_FILES.may.data);
  });

  it('add meals to day container', async () => {
    render(<Meals />);

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
    render(<Meals />);

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
    render(<Meals />);

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

import { screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRender } from '../testUtils';
import { storage } from '../../proxies';
import ShoppingList from '.';

vi.mock('@capacitor/haptics');
vi.mock('../../proxies/storage');

type MockStorage = typeof storage & { clearFiles: () => void };

const mockStorage = storage as MockStorage;

const addItems = async (items: string[]) => {
  const input = screen.getByRole('combobox', { name: 'Buscar produto' });
  for (const item of items) {
    await userEvent.type(input, `${item}{enter}`);
  }
};

const selectItems = async (itemIndexes: number[]) => {
  const listItems = screen.getAllByTestId(/list-item/);
  for (const itemIndex of itemIndexes) {
    await userEvent.click(listItems[itemIndex]);
  }
};

const deleteItem = async (itemLabel: string) => {
  const itemToDelete = screen.getByLabelText(itemLabel);
  fireEvent.contextMenu(itemToDelete);

  const editDialog = screen.getByRole('dialog', { name: 'Editar item' });
  const deleteButton = within(editDialog).getByRole('button', {
    name: 'Deletar',
  });
  await userEvent.click(deleteButton);

  const confirmDialog = screen.getByRole('dialog', {
    name: 'Deletar item?',
  });
  const dialogOkButton = within(confirmDialog).getByRole('button', {
    name: 'Ok',
  });
  await userEvent.click(dialogOkButton);
};

const editItem = async (
  itemLabel: string,
  { newName }: { newName: string }
) => {
  const itemToEdit = screen.getByLabelText(itemLabel);
  fireEvent.contextMenu(itemToEdit);

  const dialog = screen.getByRole('dialog', { name: 'Editar item' });
  const editNameInput = within(dialog).getByTestId('edit-item-input');
  fireEvent.change(editNameInput, { target: { value: newName } });

  const dialogOkButton = within(dialog).getByRole('button', { name: 'Ok' });
  await userEvent.click(dialogOkButton);
};

const render = createRender({ shoppingListProviderEnabled: true });

describe('ShoppingList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.clearFiles();
  });

  it('loads shopping list file on start', async () => {
    await storage.writeFile('/shopping-list.json', [
      {
        name: 'Pão',
      },
      {
        name: 'Vinho',
        checked: true,
      },
    ]);

    render(<ShoppingList />);

    await waitFor(() => {
      const unselectedItemsGroup = screen.getByTestId('unselected-items-group');
      const unselectedItem = within(unselectedItemsGroup).getByLabelText('Pão');
      const selectedItemsGroup = screen.getByTestId('selected-items-group');
      const selectedItem = within(selectedItemsGroup).getByLabelText('Vinho');

      expect(unselectedItem).toBeInTheDocument();
      expect(selectedItem).toBeInTheDocument();
    });
  });

  it('saves shopping list to a file', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banana', 'Vinho', 'Acepip']);

    const itemToSelect = screen.getByLabelText('Suculenta');
    await userEvent.click(itemToSelect);

    await deleteItem('Banana');

    await editItem('Acepip', { newName: 'Acepipe' });

    const shoppingListFile = await storage.readFile('/shopping-list.json');

    expect(shoppingListFile).toEqual([
      { name: 'Acepipe', checked: false },
      { name: 'Suculenta', checked: true },
      { name: 'Vinho', checked: false },
    ]);
  });

  it('inserts item by typing and pressing add button', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Buscar produto' });
    const addButton = screen.getByRole('button', { name: 'add' });
    await userEvent.type(input, 'Banana');
    fireEvent.click(addButton);

    const addedItem = screen.getByLabelText('Banana');
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('inserts item by typing and pressing enter', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Buscar produto' });
    await userEvent.type(input, 'Banana{enter}');

    const addedItem = screen.getByTestId('list-item-banana');
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('sorts inserted items alphabeticaly', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banana']);

    const addedItems = screen.getAllByTestId(/list-item/);
    expect(addedItems[0]).toHaveTextContent('Banana');
    expect(addedItems[1]).toHaveTextContent('Suculenta');
  });

  it('moves checked item to the selected items group', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banana', 'Vinho', 'Batata']);
    await selectItems([1, 2]);

    const selectedItemsGroup = screen.getByTestId('selected-items-group');
    const selectedItems =
      within(selectedItemsGroup).getAllByTestId(/list-item/);
    expect(selectedItems[0]).toHaveTextContent('Batata');
    expect(selectedItems[1]).toHaveTextContent('Suculenta');
  });

  it('trims spaces before adding new item', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Buscar produto' });
    await userEvent.type(input, '    Banana   {enter}');

    const addedItem = screen.getByTestId('list-item-banana');
    expect(addedItem).toBeInTheDocument();
  });

  it('does not insert an existing item', async () => {
    render(<ShoppingList />);

    await addItems(['Banana', 'Banana']);

    const addedItems = screen.getAllByTestId('list-item-banana');
    expect(addedItems).toHaveLength(1);
  });

  it('does not insert an existing item with different case', async () => {
    render(<ShoppingList />);

    await addItems(['Banana', 'banana']);

    const addedItems = screen.getAllByTestId('list-item-banana');
    expect(addedItems).toHaveLength(1);
  });

  it('deletes selected items when delete button is pressed and and dialog is confirmed', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banana', 'Vinho', 'Batata']);
    await selectItems([1, 2]);

    const deleteSelectedButton = screen.getByRole('button', {
      name: 'delete selected',
    });
    await userEvent.click(deleteSelectedButton);

    const dialog = screen.getByRole('dialog', { name: 'Deletar items?' });
    const dialogOkButton = within(dialog).getByRole('button', { name: 'Ok' });
    await userEvent.click(dialogOkButton);

    const selectedItemsGroup = screen.queryByTestId('selected-items-group');
    expect(selectedItemsGroup).not.toBeInTheDocument();
  });

  it('edits unselected item', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banan']);
    const itemToEdit = screen.getByTestId('list-item-banan');
    fireEvent.contextMenu(itemToEdit);

    const dialog = screen.getByRole('dialog', { name: 'Editar item' });
    const editNameInput = within(dialog).getByTestId('edit-item-input');
    expect(editNameInput).toHaveFocus();
    expect(editNameInput).toHaveValue('Banan');
    await userEvent.type(editNameInput, 'a');
    expect(editNameInput).toHaveValue('Banana');
    const dialogOkButton = within(dialog).getByRole('button', { name: 'Ok' });
    await userEvent.click(dialogOkButton);

    const editedItem = screen.getByTestId('list-item-banana');
    expect(editedItem).toBeInTheDocument();
  });

  it('edits selected item', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banan']);
    const unselectedItem = screen.getByTestId('list-item-banan');
    await userEvent.click(unselectedItem);
    const itemToEdit = screen.getByTestId('list-item-banan');
    fireEvent.contextMenu(itemToEdit);

    const dialog = screen.getByRole('dialog', { name: 'Editar item' });
    const editNameInput = within(dialog).getByTestId('edit-item-input');
    expect(editNameInput).toHaveFocus();
    expect(editNameInput).toHaveValue('Banan');
    await userEvent.type(editNameInput, 'a');
    expect(editNameInput).toHaveValue('Banana');
    const dialogOkButton = within(dialog).getByRole('button', { name: 'Ok' });
    await userEvent.click(dialogOkButton);

    const editedItem = screen.getByTestId('list-item-banana');
    expect(editedItem).toBeInTheDocument();
  });

  it('edits item and cofirm by pressing enter', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banan']);
    const itemToEdit = screen.getByTestId('list-item-banan');
    fireEvent.contextMenu(itemToEdit);

    const dialog = screen.getByRole('dialog', { name: 'Editar item' });
    const editNameInput = within(dialog).getByTestId('edit-item-input');
    expect(editNameInput).toHaveFocus();
    expect(editNameInput).toHaveValue('Banan');
    await userEvent.type(editNameInput, 'a{enter}');

    const editedItem = screen.getByTestId('list-item-banana');
    expect(editedItem).toBeInTheDocument();
  });

  it('deletes item', async () => {
    render(<ShoppingList />);

    await addItems(['Suculenta', 'Banana']);

    await deleteItem('Banana');

    const deletedItem = screen.queryByTestId('list-item-banana');
    expect(deletedItem).not.toBeInTheDocument();
  });

  // focus on search input after pressing the button
  // inserts item by selecting - needs DB cache
});

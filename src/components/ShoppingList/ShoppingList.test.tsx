import { screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithContext } from '../testUtils';
import ShoppingList from '.';

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

describe('ShoppingList', () => {
  it('inserts item by typing and pressing add button', async () => {
    renderWithContext(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Buscar produto' });
    const addButton = screen.getByRole('button', { name: 'add' });
    await userEvent.type(input, 'Banana');
    fireEvent.click(addButton);

    const addedItem = screen.getByLabelText('Banana');
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('inserts item by typing and pressing enter', async () => {
    renderWithContext(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Buscar produto' });
    await userEvent.type(input, 'Banana{enter}');

    const addedItem = screen.getByTestId('list-item-banana');
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('sorts inserted items alphabeticaly', async () => {
    renderWithContext(<ShoppingList />);

    await addItems(['Suculenta', 'Banana']);

    const addedItems = screen.getAllByTestId(/list-item/);
    expect(addedItems[0]).toHaveTextContent('Banana');
    expect(addedItems[1]).toHaveTextContent('Suculenta');
  });

  it('moves checked item to the selected items group', async () => {
    renderWithContext(<ShoppingList />);

    await addItems(['Suculenta', 'Banana', 'Vinho', 'Batata']);
    await selectItems([1, 2]);

    const selectedItemsGroup = screen.getByTestId('selected-items-group');
    const selectedItems =
      within(selectedItemsGroup).getAllByTestId(/list-item/);
    expect(selectedItems[0]).toHaveTextContent('Batata');
    expect(selectedItems[1]).toHaveTextContent('Suculenta');
  });

  it('trims spaces before adding new item', async () => {
    renderWithContext(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Buscar produto' });
    await userEvent.type(input, '    Banana   {enter}');

    const addedItem = screen.getByTestId('list-item-banana');
    expect(addedItem).toBeInTheDocument();
  });

  it('does not insert an existing item', async () => {
    renderWithContext(<ShoppingList />);

    await addItems(['Banana', 'Banana']);

    const addedItems = screen.getAllByTestId('list-item-banana');
    expect(addedItems).toHaveLength(1);
  });

  it('does not insert an existing item with different case', async () => {
    renderWithContext(<ShoppingList />);

    await addItems(['Banana', 'banana']);

    const addedItems = screen.getAllByTestId('list-item-banana');
    expect(addedItems).toHaveLength(1);
  });

  it('deletes selected items when delete button is pressed and and dialog is confirmed', async () => {
    renderWithContext(<ShoppingList />);

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

  // trim values before adding
  // focus on input after pressing the button
  // inserts item by selcting - needs DB cache
});

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShoppingList from '.';

describe('ShoppingList', () => {
  it('inserts item by typing and pressing add button', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Item' });
    const addButton = screen.getByRole('button', { name: 'Adicionar' });
    await userEvent.type(input, 'Banana');
    fireEvent.click(addButton);

    const addedItem = screen.getByLabelText('Banana');
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('inserts item by typing and pressing enter', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Item' });
    await userEvent.type(input, 'Banana{enter}');

    const addedItem = screen.getByTestId('list-item-Banana');
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('sorts inserted items alphabeticaly', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Item' });
    await userEvent.type(input, 'Suculenta{enter}');
    await userEvent.type(input, 'Banana{enter}');

    const addedItems = screen.getAllByTestId(/list-item/);
    expect(addedItems[0]).toHaveTextContent('Banana');
    expect(addedItems[1]).toHaveTextContent('Suculenta');
  });

  it('moves checked item to the end of the list', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Item' });
    await userEvent.type(input, 'Suculenta{enter}');
    await userEvent.type(input, 'Banana{enter}');
    await userEvent.type(input, 'Vinho{enter}');
    await userEvent.type(input, 'Batata{enter}');

    const addedItems = screen.getAllByTestId(/list-item/);
    await userEvent.click(addedItems[1]);
    await userEvent.click(addedItems[2]);

    const sortedItems = screen.getAllByTestId(/list-item/);
    expect(sortedItems[0]).toHaveTextContent('Banana');
    expect(sortedItems[1]).toHaveTextContent('Vinho');
    expect(sortedItems[2]).toHaveTextContent('Batata');
    expect(sortedItems[3]).toHaveTextContent('Suculenta');
  });

  it('does not insert an existing item', async () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Item' });
    await userEvent.type(input, 'Banana{enter}');
    await userEvent.type(input, 'Banana{enter}');

    const addedItems = screen.getAllByTestId('list-item-Banana');
    expect(addedItems).toHaveLength(1);
  });

  // inserts item by selcting - needs DB cache
});

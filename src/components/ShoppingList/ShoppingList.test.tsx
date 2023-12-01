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

    const addedItem = await screen.findByRole('checkbox', { name: 'Banana' });
    expect(addedItem).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  // inserts item by typing and pressing enter

  // inserts item by selcting - needs DB cache

  // insert items pressing enter
  // sort items alphabetically
  // sort checked items
  // Prevent duplicated
  // prevent empty
});

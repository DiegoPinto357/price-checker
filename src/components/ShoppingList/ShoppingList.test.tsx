import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShoppingList from '.';

describe('ShoppingList', () => {
  it('inserts item', () => {
    render(<ShoppingList />);

    const input = screen.getByRole('combobox', { name: 'Item' });
    const addButton = screen.getByRole('button', { name: 'Adicionar' });
    userEvent.type(input, 'Banana');
    userEvent.click(addButton);

    const addedItem = screen.getByRole('checkbox', { name: 'Banana' });
    expect(addedItem).toBeInTheDocument();

    // expext input to be clear
  });

  // insert items pressing enter
  // sort items alphabetically
  // sort checked items
  // Prevent duplicated
});

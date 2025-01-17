import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./Products', () => <div>Products</div>);

describe('App', () => {
  it('renders each module for each selected tab', async () => {
    render(<App />);

    let content = await screen.findByTestId('meals-planner');
    expect(content).toBeInTheDocument();

    const shoppingListTab = await screen.findByRole('tab', {
      name: 'shopping list',
    });
    await userEvent.click(shoppingListTab);
    content = await screen.findByTestId('shopping-list');
    expect(content).toBeInTheDocument();

    const recipesTab = await screen.findByRole('tab', { name: 'recipes' });
    await userEvent.click(recipesTab);
    content = await screen.findByTestId('recipes');
    expect(content).toBeInTheDocument();

    const nfScannerTab = await screen.findByRole('tab', { name: 'nf scanner' });
    await userEvent.click(nfScannerTab);
    content = await screen.findByTestId('qr-scanner');
    expect(content).toBeInTheDocument();

    const mealsTab = await screen.findByRole('tab', {
      name: 'meals planner',
    });
    await userEvent.click(mealsTab);
    content = await screen.findByTestId('meals-planner');
    expect(content).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./Products', () => <div>Products</div>);

describe('App', () => {
  it('renders each module for each selected tab', async () => {
    render(<App />);

    let content = screen.getByTestId('meals-planner');
    expect(content).toBeInTheDocument();

    const shoppingListTab = screen.getByRole('tab', {
      name: 'shopping list',
    });
    await userEvent.click(shoppingListTab);
    // TODO get elements by heading text
    content = screen.getByTestId('shopping-list');
    expect(content).toBeInTheDocument();

    const nfScannerTab = screen.getByRole('tab', { name: 'nf scanner' });
    await userEvent.click(nfScannerTab);
    content = screen.getByTestId('qr-scanner');
    expect(content).toBeInTheDocument();

    const settingsTab = screen.getByRole('tab', { name: 'settings' });
    await userEvent.click(settingsTab);
    content = screen.getByTestId('settings');
    expect(content).toBeInTheDocument();

    const mealsTab = screen.getByRole('tab', {
      name: 'meals planner',
    });
    await userEvent.click(mealsTab);
    content = screen.getByTestId('meals-planner');
    expect(content).toBeInTheDocument();
  });
});

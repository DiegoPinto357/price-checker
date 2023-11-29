import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders each module for each selected tab', async () => {
    render(<App />);

    let content = screen.getByTestId('shopping-list');
    expect(content).toBeInTheDocument();

    const nfScannerTab = screen.getByRole('tab', { name: 'Escanear NF' });
    await userEvent.click(nfScannerTab);
    content = screen.getByTestId('qr-scanner');
    expect(content).toBeInTheDocument();

    const settingsTab = screen.getByRole('tab', { name: 'Configurações' });
    await userEvent.click(settingsTab);
    content = screen.getByTestId('settings');
    expect(content).toBeInTheDocument();

    const shoppingListTab = screen.getByRole('tab', {
      name: 'Lista de Compras',
    });
    await userEvent.click(shoppingListTab);
    content = screen.getByTestId('shopping-list');
    expect(content).toBeInTheDocument();
  });
});

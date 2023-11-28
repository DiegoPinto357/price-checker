import { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { QrCodeReaderProps } from './NFScan/QrCodeReader';
import { storage } from '../proxies';
import App from './App';
import nfData from '../../mockData/nf/nfData.json';

vi.mock('axios');
vi.mock('../proxies/storage');
vi.mock('../proxies/database');

vi.mock('./NFScan/QrCodeReader', () => ({
  default: ({ onClose }: QrCodeReaderProps) => {
    onClose(
      'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=4…62|2|1|1|F45F565F22E7784B638952FF47C3870F93E7212C'
    );
    return null;
  },
}));

describe('App', () => {
  it('scans qr code and saves nf and products data', async () => {
    (axios.get as Mock).mockResolvedValue({ data: nfData });

    render(<App />);

    const qrScanButton = screen.getByRole('button', { name: 'Parse NF' });
    await userEvent.click(qrScanButton);

    const saveResultsButton = screen.getByRole('button', { name: 'Salvar' });
    await userEvent.click(saveResultsButton);

    // FIXME remove storage assertions, focus on screens and UI
    expect(storage.writeFile).toBeCalledTimes(nfData.items.length + 3);

    expect(storage.writeFile).toBeCalledWith(`/nfs/${nfData.key}.json`, nfData);

    nfData.items.forEach(item => {
      expect(storage.writeFile).toBeCalledWith(`/products/${item.code}.json`, {
        code: item.code,
        description: item.description,
        history: [
          {
            nfKey: nfData.key,
            date: nfData.date,
            amount: item.amount,
            unit: item.unit,
            value: item.value,
            totalValue: item.totalValue,
          },
        ],
      });
    });
  });
});

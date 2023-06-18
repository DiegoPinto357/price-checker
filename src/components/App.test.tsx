import { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { QrCodeReaderProps } from './QrCodeReader';
import App from './App';
import nfData from '../../mockData/nf/nfData.json';

vi.mock('axios');

vi.mock('./QrCodeReader', () => ({
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

    expect(axios.post).toBeCalledTimes(nfData.items.length + 1);

    expect(axios.post).toBeCalledWith(
      'http://127.0.0.1:3001/storage/write-file',
      {
        filename: `/nfs/${nfData.key}.json`,
        data: nfData,
      }
    );

    nfData.items.forEach(item => {
      expect(axios.post).toBeCalledWith(
        'http://127.0.0.1:3001/storage/write-file',
        {
          filename: `/products/${item.code}.json`,
          data: { ...item, nfKey: nfData.key },
        }
      );
    });
  });
});

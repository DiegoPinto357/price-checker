import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { QrCodeReaderProps } from './QrCodeReader';
import { storage } from '../../proxies';
import NFScanner from './NFScanner';
import nfData from '../../../mockData/nf/nfData.json';
import { useEffect } from 'react';

vi.mock('axios');
vi.mock('../../proxies/storage');
vi.mock('../../proxies/database');

vi.mock('./QrCodeReader', () => ({
  default: ({ onClose }: QrCodeReaderProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      onClose(
        'https://www.sefaz.rs.gov.br/NFCE/NFCE-COM.aspx?p=4…62|2|1|1|F45F565F22E7784B638952FF47C3870F93E7212C'
      );
    }, [onClose]);
    return null;
  },
}));

describe('NFScanner', () => {
  it('scans qr code and saves nf and products data', async () => {
    vi.mocked(axios.get).mockResolvedValue({ data: nfData });

    render(<NFScanner />);

    const qrScanButton = screen.getByRole('button', {
      name: 'Escanear Nota Fiscal',
    });
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

  describe('error handling', () => {
    it('renders error message when getNfData fails', async () => {
      vi.mocked(axios.get).mockRejectedValue({
        response: { data: { message: 'Something went wrong!' } },
      });

      render(<NFScanner />);

      const qrScanButton = screen.getByRole('button', {
        name: 'Escanear Nota Fiscal',
      });
      await userEvent.click(qrScanButton);

      const errorMessage = screen.getByText('Something went wrong!');
      expect(errorMessage).toBeInTheDocument();
    });

    // it('renders error message when saveNf fails', () => {});

    // it('renders error message when saveProducts fails', () => {});
  });
});

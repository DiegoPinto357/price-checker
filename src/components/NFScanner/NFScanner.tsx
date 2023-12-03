import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/react';
import QrCodeReader from './QrCodeReader';
import QrResults from './QrResults';
import Loader from '../Loader';
import { getNfData, saveNf } from '../../nfs';
import { saveProducts } from '../../products';
import { Nf, Product } from '../../types';

type ContentPage = 'idle' | 'qr-reader' | 'qr-results';

const NFScanner = () => {
  const [contentPage, setContentPage] = useState<ContentPage>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nf, setNf] = useState<Nf | null>();

  const handleParseButtonClick = useCallback(async () => {
    setContentPage('qr-reader');
  }, []);

  const handleQrCodeReaderClose = useCallback(async (data?: string) => {
    setIsLoading(true);
    if (data) {
      const key = data.match(/\?p=([^&]*)/)![1];
      const nfData = await getNfData(key);
      setNf(nfData);
      setContentPage('qr-results');
      setIsLoading(false);
      return;
    }

    setContentPage('idle');
    setIsLoading(false);
  }, []);

  const handleQrResultsSaveClick = useCallback(
    async (products: Product[]) => {
      setIsLoading(true);
      if (nf) {
        await Promise.all([saveNf(nf), saveProducts(products, nf)]);
      }
      setNf(null);
      setContentPage('idle');
      setIsLoading(false);
    },
    [nf]
  );

  const handleQrResultsCancelClick = useCallback(() => {
    setContentPage('idle');
  }, []);

  const renderContentPage = useCallback(
    (selectedContentPage: ContentPage) => {
      switch (selectedContentPage) {
        case 'idle': {
          const buttonStyle = 'grow w-full md:w-1/5';
          return (
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                className={buttonStyle}
                color="primary"
                onPress={handleParseButtonClick}
              >
                Parse NF
              </Button>
            </div>
          );
        }

        case 'qr-reader':
          return <QrCodeReader onClose={handleQrCodeReaderClose} />;

        case 'qr-results':
          return (
            <QrResults
              products={nf ? nf.items : []}
              onSaveClick={handleQrResultsSaveClick}
              onCancelClick={handleQrResultsCancelClick}
            />
          );
      }
    },
    [
      nf,
      handleParseButtonClick,
      handleQrCodeReaderClose,
      handleQrResultsSaveClick,
      handleQrResultsCancelClick,
    ]
  );

  return (
    <div data-testid="qr-scanner">
      {renderContentPage(contentPage)}
      {isLoading && <Loader />}
    </div>
  );
};

export default NFScanner;

import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/react';
import { IoCameraOutline } from 'react-icons/io5';
import Typography from '../lib/Typography';
import QrCodeReader from './QrCodeReader';
import QrResults from './QrResults';
import Loader from '../lib/Loader';
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
    if (data) {
      setIsLoading(true);
      const key = data.match(/\?p=([^&]*)/)![1];
      const nfData = await getNfData(key);
      setNf(nfData);
      setContentPage('qr-results');
      setIsLoading(false);
      return;
    }

    setContentPage('idle');
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
          return (
            <div className="h-full flex items-center justify-center">
              <Button
                color="primary"
                size="lg"
                onPress={handleParseButtonClick}
                endContent={<IoCameraOutline className="w-6 h-6" />}
              >
                Escanear Nota Fiscal
              </Button>
            </div>
          );
        }

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
      handleQrResultsSaveClick,
      handleQrResultsCancelClick,
    ]
  );

  return (
    <div data-testid="qr-scanner" className="flex flex-col h-full">
      {/* TODO refactor conditional rendering */}
      {contentPage === 'qr-reader' ? (
        <QrCodeReader onClose={handleQrCodeReaderClose} />
      ) : (
        <>
          <Typography variant="h1">Nota Fiscal</Typography>
          {renderContentPage(contentPage)}{' '}
        </>
      )}
      {isLoading && <Loader />}
    </div>
  );
};

export default NFScanner;

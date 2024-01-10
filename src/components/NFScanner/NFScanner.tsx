import { useCallback, useState } from 'react';
import { AxiosError } from 'axios'; // TODO migrate to HttpError
import { Button } from '@nextui-org/react';
import { IoCameraOutline } from 'react-icons/io5';
import Typography from '../lib/Typography';
import ErrorMessage from '../lib/ErrorMessage';
import Loader from '../lib/Loader';
import QrCodeReader from './QrCodeReader';
import QrResults from './QrResults';
import { getNfData, saveNf } from '../../nfs';
import { saveProducts } from '../../products';

import type { Nf, Product } from '../../types';

type ContentPage = 'idle' | 'qr-reader' | 'qr-results';

const NFScanner = () => {
  const [contentPage, setContentPage] = useState<ContentPage>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nf, setNf] = useState<Nf | null>();

  const handleParseButtonClick = useCallback(async () => {
    setContentPage('qr-reader');
    setErrorMessage(null);
  }, []);

  const handleQrCodeReaderClose = useCallback(async (data?: string) => {
    if (data) {
      setIsLoading(true);
      const key = data.match(/\?p=([^&]*)/)![1];

      try {
        const nfData = await getNfData(key);
        setNf(nfData);
      } catch (error) {
        let message;
        // TODO create a global error handler, so modules doesn't have to handle specific error types
        if (error instanceof AxiosError) message = error.response?.data.message;
        else message = String(error);

        setErrorMessage(message);
        setContentPage('idle');
        setIsLoading(false);
        return;
      }

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
            <div className="h-full flex flex-col gap-4 items-center justify-center">
              <Button
                color="primary"
                size="lg"
                onPress={handleParseButtonClick}
                endContent={<IoCameraOutline className="w-6 h-6" />}
              >
                Escanear Nota Fiscal
              </Button>
              {errorMessage ? (
                <ErrorMessage className="px-6" message={errorMessage} />
              ) : null}
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
      errorMessage,
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

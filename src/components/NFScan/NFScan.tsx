import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/react';
import QrCodeReader from './QrCodeReader';
import QrResults from './QrResults';
import Loader from '../Loader';
import { getNfData, saveNf } from '../../nfs';
import { saveProducts } from '../../products';
import { Nf, Product } from '../../types';
import dataSync from '../../dataSync';

type ContentPage = 'idle' | 'qr-reader' | 'qr-results';

const NFScan = () => {
  const [contentPage, setContentPage] = useState<ContentPage>('idle');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nf, setNf] = useState<Nf | null>();

  const onParseButtonClick = useCallback(async () => {
    setContentPage('qr-reader');
  }, []);

  // TODO chnage event hanlder naming to "handle"
  const onSyncButtonClick = useCallback(async () => {
    setIsLoading(true);
    await dataSync.startSync();
    setIsLoading(false);
  }, []);

  const onQrCodeReaderClose = useCallback(async (data?: string) => {
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

  const onQrResultsSaveClick = useCallback(
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

  const onQrResultsCancelClick = useCallback(() => {
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
                onPress={onParseButtonClick}
              >
                Parse NF
              </Button>

              <Button
                className={buttonStyle}
                color="primary"
                onPress={onSyncButtonClick}
              >
                DB Sync
              </Button>
            </div>
          );
        }

        case 'qr-reader':
          return <QrCodeReader onClose={onQrCodeReaderClose} />;

        case 'qr-results':
          return (
            <QrResults
              products={nf ? nf.items : []}
              onSaveClick={onQrResultsSaveClick}
              onCancelClick={onQrResultsCancelClick}
            />
          );
      }

      return null;
    },
    [
      nf,
      onParseButtonClick,
      onSyncButtonClick,
      onQrCodeReaderClose,
      onQrResultsSaveClick,
      onQrResultsCancelClick,
    ]
  );

  return (
    <>
      {renderContentPage(contentPage)}
      {isLoading && <Loader />}
    </>
  );
};

export default NFScan;

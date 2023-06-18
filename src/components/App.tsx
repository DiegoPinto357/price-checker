import { useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import QrCodeReader from './QrCodeReader';
import QrResults from './QrResults';
import NodejsLoader from './NodejsLoader';
import { getNfData, saveNf } from '../nfs';
import { saveProducts } from '../products';
import { Nf, Product } from '../types';

enum ContentPage {
  Loader,
  Idle,
  QrReader,
  QrResults,
}

const App = () => {
  const [contentPage, setContentPage] = useState<ContentPage>(ContentPage.Idle);
  const [nf, setNf] = useState<Nf | null>();

  const onButtonClick = useCallback(async () => {
    setContentPage(ContentPage.QrReader);
  }, []);

  const onQrCodeReaderClose = useCallback(async (data?: string) => {
    if (data) {
      const key = data.match(/\?p=([^&]*)/)![1];
      const nfData = await getNfData(key);
      setNf(nfData);
      setContentPage(ContentPage.QrResults);
      return;
    }

    setContentPage(ContentPage.Idle);
  }, []);

  const onQrResultsSaveClick = useCallback(
    async (products: Product[]) => {
      if (nf) {
        await saveNf(nf);
        await saveProducts(products, nf.key);
      }
      setNf(null);
      setContentPage(ContentPage.Idle);
    },
    [nf]
  );

  const onQrResultsCancelClick = useCallback(() => {
    setContentPage(ContentPage.Idle);
  }, []);

  const renderContentPage = useCallback(
    (selectedContentPage: ContentPage) => {
      switch (selectedContentPage) {
        case ContentPage.Loader:
          break;

        case ContentPage.Idle:
          return <Button onPress={onButtonClick}>Parse NF</Button>;

        case ContentPage.QrReader:
          return <QrCodeReader onClose={onQrCodeReaderClose} />;

        case ContentPage.QrResults:
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
      onButtonClick,
      onQrCodeReaderClose,
      onQrResultsSaveClick,
      onQrResultsCancelClick,
    ]
  );

  return (
    <NextUIProvider>
      <Container sm>
        <NodejsLoader />
        {renderContentPage(contentPage)}
      </Container>
    </NextUIProvider>
  );
};

export default App;

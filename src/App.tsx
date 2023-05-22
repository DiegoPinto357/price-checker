import { useCallback, useState } from 'react';
import { NextUIProvider, Container, Button } from '@nextui-org/react';
import QrCodeReader from './QrCodeReader';
import QrResults, { QrResultsProps } from './QrResults';
import NodejsLoader from './NodejsLoader';
import core from './core';

enum ContentPage {
  Loader,
  Idle,
  QrReader,
  QrResults,
}

const App = () => {
  const [contentPage, setContentPage] = useState<ContentPage>(ContentPage.Idle);
  const [items, setItems] = useState<QrResultsProps['items']>([]);

  const onButtonClick = useCallback(async () => {
    setContentPage(ContentPage.QrReader);
  }, []);

  const onQrCodeReaderClose = useCallback(async (data?: string) => {
    if (data) {
      const key = data.match(/\?p=([^&]*)/)![1];
      const nfData = await core.getNfData(key);
      setItems(nfData.items);
      setContentPage(ContentPage.QrResults);
      return;
    }

    setContentPage(ContentPage.Idle);
  }, []);

  const onQrResultsSaveClick = useCallback(() => {
    setContentPage(ContentPage.Idle);
  }, []);

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
              items={items}
              onSaveClick={onQrResultsSaveClick}
              onCancelClick={onQrResultsCancelClick}
            />
          );
      }

      return null;
    },
    [
      items,
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

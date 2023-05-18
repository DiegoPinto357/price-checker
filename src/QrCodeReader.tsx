import { useCallback, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Button } from '@nextui-org/react';
import core from './core';

interface QrCodeReaderProps {
  onClose: (data: object) => void;
}

const QrCodeReader = ({ onClose }: QrCodeReaderProps) => {
  const startQrReader = useCallback(async () => {
    await BarcodeScanner.checkPermission({ force: true });
    document.body.style.position = 'unset';
    document.body.style.backgroundColor = 'transparent';
    BarcodeScanner.hideBackground();
    return await BarcodeScanner.startScan({
      cameraDirection: 'back',
      targetedFormats: ['QR_CODE'],
    });
  }, []);

  const stopQrReader = useCallback(() => {
    document.body.style.position = 'relative';
    document.body.style.backgroundColor = 'var(--nextui-colors-background)';
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  }, []);

  useEffect(() => {
    const readQrCode = async () => {
      const result = await startQrReader();
      stopQrReader();

      if (result.hasContent) {
        const qrCodeData = result.content.replace('"', '');
        console.log(qrCodeData);

        const key = qrCodeData.match(/\?p=([^&]*)/)![1];

        const data = await core.getNfData(key);
        onClose(data);
      }
    };

    readQrCode();
  }, [startQrReader, stopQrReader, onClose]);

  return (
    <div style={{ position: 'relative' }}>
      <Button
        style={{ position: 'absolute', zIndex: 100 }}
        onPress={stopQrReader}
      >
        Close
      </Button>
    </div>
  );
};

export default QrCodeReader;

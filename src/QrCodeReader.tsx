import { useCallback, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Button } from '@nextui-org/react';

const overrideBodyCss = () => {
  document.body.style.position = 'unset';
  document.body.style.backgroundColor = 'transparent';
};

const restoreBodyCss = () => {
  document.body.style.position = 'relative';
  document.body.style.backgroundColor = 'var(--nextui-colors-background)';
};

interface QrCodeReaderProps {
  onClose: (data?: string) => void;
}

const QrCodeReader = ({ onClose }: QrCodeReaderProps) => {
  const startQrReader = useCallback(async () => {
    await BarcodeScanner.checkPermission({ force: true });
    overrideBodyCss();
    BarcodeScanner.hideBackground();
    return await BarcodeScanner.startScan({
      cameraDirection: 'back',
      targetedFormats: ['QR_CODE'],
    });
  }, []);

  const stopQrReader = useCallback(() => {
    restoreBodyCss();
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const readQrCode = async () => {
      const result = await startQrReader();
      stopQrReader();

      if (result.hasContent) {
        const qrCodeData = result.content.replace('"', '');
        return onClose(qrCodeData);
      }

      onClose();
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
